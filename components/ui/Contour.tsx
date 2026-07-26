type ContourProps = {
  className?: string;
  opacity?: number;
  variant?: "corner" | "field";
  anchor?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
};

type Ring = {
  d: string;
  opacity: number;
  width: number;
};

type Peak = {
  cx: number;
  cy: number;
  sx: number;
  sy: number;
  rot: number;
  amp: number;
};

type Terrain = {
  peaks: Peak[];
  /** Low-frequency warp strength — creates wavy, non-uniform bends. */
  warp: number;
  levels: number[];
};

const WIDTH = 1440;
const HEIGHT = 900;

function rotPoint(x: number, y: number, cx: number, cy: number, rot: number) {
  const cos = Math.cos(rot);
  const sin = Math.sin(rot);
  const dx = x - cx;
  const dy = y - cy;
  return { x: cx + dx * cos - dy * sin, y: cy + dx * sin + dy * cos };
}

/** Continuous elevation field — isolines of this never cross. */
function elevation(x: number, y: number, terrain: Terrain) {
  const w = terrain.warp;
  const wx = x + w * Math.sin(y * 0.0074) + w * 0.55 * Math.cos(x * 0.0051 + y * 0.002);
  const wy = y + w * Math.cos(x * 0.0068) + w * 0.45 * Math.sin(y * 0.0082 - x * 0.0015);

  let h = 0;
  for (const peak of terrain.peaks) {
    const p = rotPoint(wx, wy, peak.cx, peak.cy, peak.rot);
    const nx = (p.x - peak.cx) / peak.sx;
    const ny = (p.y - peak.cy) / peak.sy;
    h += peak.amp * Math.exp(-(nx * nx + ny * ny));
  }

  // Gentle secondary undulation so directional change isn't uniform
  h +=
    0.045 * Math.sin(wx * 0.011 + wy * 0.007) * Math.cos(wy * 0.009 - wx * 0.004) +
    0.028 * Math.sin((wx + wy) * 0.0085);

  return h;
}

const EDGE_TABLE: Array<Array<[number, number]>> = [
  [],
  [[0, 3]],
  [[0, 1]],
  [[1, 3]],
  [[1, 2]],
  [
    [0, 1],
    [2, 3],
  ],
  [[0, 2]],
  [[2, 3]],
  [[2, 3]],
  [[0, 2]],
  [
    [0, 3],
    [1, 2],
  ],
  [[1, 2]],
  [[1, 3]],
  [[0, 1]],
  [[0, 3]],
  [],
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function edgePoint(
  edge: number,
  x: number,
  y: number,
  stepX: number,
  stepY: number,
  v0: number,
  v1: number,
  v2: number,
  v3: number,
  level: number,
): [number, number] {
  const t01 = (level - v0) / (v1 - v0 || 1e-9);
  const t12 = (level - v1) / (v2 - v1 || 1e-9);
  const t23 = (level - v3) / (v2 - v3 || 1e-9);
  const t30 = (level - v0) / (v3 - v0 || 1e-9);

  switch (edge) {
    case 0:
      return [lerp(x, x + stepX, t01), y];
    case 1:
      return [x + stepX, lerp(y, y + stepY, t12)];
    case 2:
      return [lerp(x, x + stepX, t23), y + stepY];
    default:
      return [x, lerp(y, y + stepY, t30)];
  }
}

type Seg = { a: [number, number]; b: [number, number] };

function marchingSquares(terrain: Terrain, level: number, cols = 96, rows = 60): Seg[] {
  const stepX = WIDTH / cols;
  const stepY = HEIGHT / rows;
  const grid: number[][] = [];

  for (let r = 0; r <= rows; r += 1) {
    const row: number[] = [];
    const y = r * stepY;
    for (let c = 0; c <= cols; c += 1) {
      row.push(elevation(c * stepX, y, terrain));
    }
    grid.push(row);
  }

  const segs: Seg[] = [];

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const v0 = grid[r][c];
      const v1 = grid[r][c + 1];
      const v2 = grid[r + 1][c + 1];
      const v3 = grid[r + 1][c];

      let idx = 0;
      if (v0 >= level) idx |= 1;
      if (v1 >= level) idx |= 2;
      if (v2 >= level) idx |= 4;
      if (v3 >= level) idx |= 8;

      const edges = EDGE_TABLE[idx];
      const x = c * stepX;
      const y = r * stepY;

      for (const [e0, e1] of edges) {
        segs.push({
          a: edgePoint(e0, x, y, stepX, stepY, v0, v1, v2, v3, level),
          b: edgePoint(e1, x, y, stepX, stepY, v0, v1, v2, v3, level),
        });
      }
    }
  }

  return segs;
}

function keyOf(p: [number, number]) {
  return `${p[0].toFixed(1)},${p[1].toFixed(1)}`;
}

/** Stitch raw segments into continuous polylines. */
function stitch(segs: Seg[]): Array<Array<[number, number]>> {
  const adj = new Map<string, Array<[number, number]>>();

  const add = (from: [number, number], to: [number, number]) => {
    const k = keyOf(from);
    const list = adj.get(k) ?? [];
    list.push(to);
    adj.set(k, list);
  };

  for (const seg of segs) {
    add(seg.a, seg.b);
    add(seg.b, seg.a);
  }

  const used = new Set<string>();
  const lines: Array<Array<[number, number]>> = [];

  const edgeKey = (a: [number, number], b: [number, number]) => {
    const ka = keyOf(a);
    const kb = keyOf(b);
    return ka < kb ? `${ka}|${kb}` : `${kb}|${ka}`;
  };

  for (const seg of segs) {
    const startEdge = edgeKey(seg.a, seg.b);
    if (used.has(startEdge)) continue;

    const walk = (start: [number, number], next: [number, number]) => {
      const pts: Array<[number, number]> = [start, next];
      used.add(edgeKey(start, next));
      let prev = start;
      let curr = next;

      for (let guard = 0; guard < 20000; guard += 1) {
        const neighbors = adj.get(keyOf(curr)) ?? [];
        let found: [number, number] | null = null;
        for (const n of neighbors) {
          const ek = edgeKey(curr, n);
          if (!used.has(ek) && keyOf(n) !== keyOf(prev)) {
            found = n;
            break;
          }
        }
        if (!found) break;
        used.add(edgeKey(curr, found));
        pts.push(found);
        prev = curr;
        curr = found;
        if (keyOf(curr) === keyOf(pts[0])) break;
      }

      return pts;
    };

    const forward = walk(seg.a, seg.b);
    lines.push(forward);
  }

  return lines.filter((line) => line.length > 8);
}

function smoothPath(pts: Array<[number, number]>, closed: boolean) {
  if (pts.length < 3) return "";

  const points = closed ? pts.slice(0, -1) : pts;
  if (points.length < 3) return "";

  const sample = closed
    ? [...points, points[0], points[1]]
    : [
        points[0],
        ...points,
        points[points.length - 1],
      ];

  let d = `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  const start = closed ? 1 : 1;
  const end = closed ? sample.length - 2 : sample.length - 2;

  for (let i = start; i < end; i += 1) {
    const p0 = sample[i - 1];
    const p1 = sample[i];
    const p2 = sample[i + 1];
    const p3 = sample[i + 2] ?? p2;
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }

  return closed ? `${d} Z` : d;
}

function extractRings(terrain: Terrain): Ring[] {
  const rings: Ring[] = [];

  terrain.levels.forEach((level, index) => {
    const t = index / Math.max(1, terrain.levels.length - 1);
    const segs = marchingSquares(terrain, level);
    const lines = stitch(segs);

    // Prefer the longest loop for each level (main contour body)
    const ranked = [...lines].sort((a, b) => b.length - a.length);
    const keep = ranked.slice(0, 2);

    keep.forEach((line, lineIndex) => {
      const closed = keyOf(line[0]) === keyOf(line[line.length - 1]);
      const d = smoothPath(line, closed);
      if (!d) return;

      const opacity =
        0.18 +
        0.55 * Math.sin(Math.PI * t) +
        (lineIndex === 0 ? 0.08 : -0.05);

      rings.push({
        d,
        opacity: Math.min(0.82, Math.max(0.12, opacity)),
        width: t > 0.85 || t < 0.12 ? 1.05 : 0.75,
      });
    });
  });

  return rings;
}

function levelsBetween(min: number, max: number, count: number) {
  return Array.from({ length: count }, (_, i) => {
    const t = (i + 1) / (count + 1);
    // Slightly uneven intervals — denser near peak like real greens
    const eased = Math.pow(t, 0.9);
    return min + (max - min) * eased;
  });
}

const CORNER_TERRAIN: Record<
  NonNullable<ContourProps["anchor"]>,
  Terrain
> = {
  "bottom-right": {
    warp: 55,
    peaks: [
      { cx: 1320, cy: 820, sx: 520, sy: 380, rot: -0.4, amp: 1 },
      { cx: 1080, cy: 700, sx: 280, sy: 220, rot: 0.35, amp: 0.42 },
      { cx: 1420, cy: 560, sx: 240, sy: 300, rot: -0.2, amp: 0.28 },
    ],
    levels: levelsBetween(0.12, 0.92, 16),
  },
  "bottom-left": {
    warp: 55,
    peaks: [
      { cx: 120, cy: 820, sx: 520, sy: 380, rot: 0.35, amp: 1 },
      { cx: 360, cy: 700, sx: 280, sy: 220, rot: -0.3, amp: 0.42 },
      { cx: 40, cy: 560, sx: 240, sy: 300, rot: 0.15, amp: 0.28 },
    ],
    levels: levelsBetween(0.12, 0.92, 16),
  },
  "top-right": {
    warp: 52,
    peaks: [
      { cx: 1320, cy: 80, sx: 500, sy: 360, rot: 0.3, amp: 1 },
      { cx: 1100, cy: 200, sx: 260, sy: 210, rot: -0.25, amp: 0.4 },
      { cx: 1420, cy: 280, sx: 230, sy: 280, rot: 0.2, amp: 0.26 },
    ],
    levels: levelsBetween(0.12, 0.92, 15),
  },
  "top-left": {
    warp: 52,
    peaks: [
      { cx: 120, cy: 80, sx: 500, sy: 360, rot: -0.28, amp: 1 },
      { cx: 340, cy: 200, sx: 260, sy: 210, rot: 0.28, amp: 0.4 },
      { cx: 40, cy: 280, sx: 230, sy: 280, rot: -0.15, amp: 0.26 },
    ],
    levels: levelsBetween(0.12, 0.92, 15),
  },
};

const FIELD_TERRAIN: Terrain = {
  warp: 48,
  peaks: [
    { cx: 140, cy: 100, sx: 380, sy: 280, rot: -0.25, amp: 1 },
    { cx: 1280, cy: 120, sx: 360, sy: 260, rot: 0.3, amp: 0.95 },
    { cx: 1320, cy: 780, sx: 400, sy: 300, rot: -0.35, amp: 1 },
    { cx: 180, cy: 760, sx: 320, sy: 240, rot: 0.2, amp: 0.7 },
  ],
  levels: levelsBetween(0.14, 0.88, 14),
};

const CACHE = new Map<string, Ring[]>();

function getRings(key: string, terrain: Terrain) {
  const cached = CACHE.get(key);
  if (cached) return cached;
  const rings = extractRings(terrain);
  CACHE.set(key, rings);
  return rings;
}

export function Contour({
  className = "",
  opacity = 1,
  variant = "corner",
  anchor = "bottom-right",
}: ContourProps) {
  const rings =
    variant === "field"
      ? getRings("field", FIELD_TERRAIN)
      : getRings(`corner:${anchor}`, CORNER_TERRAIN[anchor]);

  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      style={{ opacity }}
      preserveAspectRatio="xMidYMid slice"
    >
      {rings.map((ring, index) => (
        <path
          key={index}
          d={ring.d}
          stroke="#009A6D"
          strokeWidth={ring.width}
          strokeOpacity={ring.opacity}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
