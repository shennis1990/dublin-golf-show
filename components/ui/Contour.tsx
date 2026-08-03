type ContourProps = {
  className?: string;
  /** Overall visibility. Prefer 0.04–0.10; up to ~0.15 in quiet areas. */
  opacity?: number;
  /** Small family of green-reading patterns reused sitewide. */
  pattern?: "green" | "ridge" | "swale" | "apron";
  /** Corner-anchored placement — lines fade off-screen from this corner. */
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
  /** Low-frequency warp — soft, uneven bends like real turf. */
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
  const wx =
    x +
    w * Math.sin(y * 0.0062) +
    w * 0.4 * Math.cos(x * 0.0044 + y * 0.0018);
  const wy =
    y +
    w * Math.cos(x * 0.0058) +
    w * 0.35 * Math.sin(y * 0.0071 - x * 0.0012);

  let h = 0;
  for (const peak of terrain.peaks) {
    const p = rotPoint(wx, wy, peak.cx, peak.cy, peak.rot);
    const nx = (p.x - peak.cx) / peak.sx;
    const ny = (p.y - peak.cy) / peak.sy;
    h += peak.amp * Math.exp(-(nx * nx + ny * ny));
  }

  // Soft secondary undulation — irregular, never concentric
  h +=
    0.032 * Math.sin(wx * 0.009 + wy * 0.006) * Math.cos(wy * 0.0075 - wx * 0.0035) +
    0.018 * Math.sin((wx * 0.7 + wy) * 0.007);

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

function marchingSquares(terrain: Terrain, level: number, cols = 100, rows = 64): Seg[] {
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

    lines.push(walk(seg.a, seg.b));
  }

  return lines.filter((line) => line.length > 10);
}

function smoothPath(pts: Array<[number, number]>, closed: boolean) {
  if (pts.length < 3) return "";

  const points = closed ? pts.slice(0, -1) : pts;
  if (points.length < 3) return "";

  const sample = closed
    ? [...points, points[0], points[1]]
    : [points[0], ...points, points[points.length - 1]];

  let d = `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  const end = closed ? sample.length - 2 : sample.length - 2;

  for (let i = 1; i < end; i += 1) {
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

    // Keep the strongest contour body per level — avoid noisy fragments
    const ranked = [...lines].sort((a, b) => b.length - a.length);
    const keep = ranked.slice(0, 1);

    keep.forEach((line) => {
      const closed = keyOf(line[0]) === keyOf(line[line.length - 1]);
      const d = smoothPath(line, closed);
      if (!d) return;

      // Relative stroke weight within the pattern; final visibility is outer opacity
      const opacity = 0.45 + 0.4 * Math.sin(Math.PI * t);

      rings.push({
        d,
        opacity: Math.min(0.9, Math.max(0.35, opacity)),
        width: t > 0.82 || t < 0.15 ? 1.1 : 0.7,
      });
    });
  });

  return rings;
}

function levelsBetween(min: number, max: number, count: number) {
  return Array.from({ length: count }, (_, i) => {
    const t = (i + 1) / (count + 1);
    // Slightly denser near the high point — like a green book
    const eased = Math.pow(t, 0.88);
    return min + (max - min) * eased;
  });
}

/**
 * Pattern family — believable putting-green topography, not concentric radar.
 * Each uses elongated asymmetric slopes that expand/contract like real terrain.
 */
const PATTERNS: Record<NonNullable<ContourProps["pattern"]>, Terrain> = {
  // Classic green: primary crown + secondary shelf, offset and elongated
  green: {
    warp: 38,
    peaks: [
      { cx: 780, cy: 420, sx: 420, sy: 280, rot: -0.55, amp: 1 },
      { cx: 980, cy: 560, sx: 300, sy: 200, rot: 0.4, amp: 0.48 },
      { cx: 560, cy: 300, sx: 260, sy: 340, rot: 0.25, amp: 0.32 },
    ],
    levels: levelsBetween(0.16, 0.9, 13),
  },
  // Diagonal ridge — slope falls away to either side
  ridge: {
    warp: 42,
    peaks: [
      { cx: 520, cy: 280, sx: 560, sy: 160, rot: 0.65, amp: 1 },
      { cx: 880, cy: 520, sx: 480, sy: 150, rot: 0.55, amp: 0.72 },
      { cx: 1100, cy: 700, sx: 280, sy: 200, rot: -0.2, amp: 0.28 },
    ],
    levels: levelsBetween(0.14, 0.88, 12),
  },
  // Soft swale between two rises — open in the middle, denser on flanks
  swale: {
    warp: 36,
    peaks: [
      { cx: 320, cy: 360, sx: 300, sy: 360, rot: 0.2, amp: 0.95 },
      { cx: 1080, cy: 480, sx: 340, sy: 300, rot: -0.35, amp: 1 },
      { cx: 700, cy: 700, sx: 220, sy: 180, rot: 0.5, amp: 0.22 },
    ],
    levels: levelsBetween(0.15, 0.86, 12),
  },
  // Front-apron fall-off — denser near one edge, opens into the field
  apron: {
    warp: 34,
    peaks: [
      { cx: 240, cy: 720, sx: 480, sy: 260, rot: -0.15, amp: 1 },
      { cx: 480, cy: 520, sx: 320, sy: 220, rot: 0.45, amp: 0.55 },
      { cx: 160, cy: 400, sx: 200, sy: 280, rot: 0.1, amp: 0.3 },
    ],
    levels: levelsBetween(0.14, 0.9, 13),
  },
};

/** Corner terrains hug one corner and fade into open space. */
const CORNER_TERRAIN: Record<NonNullable<ContourProps["anchor"]>, Terrain> = {
  "bottom-right": {
    warp: 40,
    peaks: [
      { cx: 1280, cy: 760, sx: 460, sy: 320, rot: -0.48, amp: 1 },
      { cx: 1040, cy: 820, sx: 300, sy: 180, rot: 0.55, amp: 0.5 },
      { cx: 1360, cy: 520, sx: 220, sy: 280, rot: 0.15, amp: 0.34 },
    ],
    levels: levelsBetween(0.14, 0.9, 14),
  },
  "bottom-left": {
    warp: 40,
    peaks: [
      { cx: 160, cy: 760, sx: 460, sy: 320, rot: 0.42, amp: 1 },
      { cx: 400, cy: 820, sx: 300, sy: 180, rot: -0.5, amp: 0.5 },
      { cx: 80, cy: 520, sx: 220, sy: 280, rot: -0.12, amp: 0.34 },
    ],
    levels: levelsBetween(0.14, 0.9, 14),
  },
  "top-right": {
    warp: 38,
    peaks: [
      { cx: 1280, cy: 140, sx: 440, sy: 300, rot: 0.38, amp: 1 },
      { cx: 1060, cy: 100, sx: 280, sy: 170, rot: -0.4, amp: 0.48 },
      { cx: 1360, cy: 360, sx: 210, sy: 260, rot: -0.18, amp: 0.3 },
    ],
    levels: levelsBetween(0.14, 0.9, 13),
  },
  "top-left": {
    warp: 38,
    peaks: [
      { cx: 160, cy: 140, sx: 440, sy: 300, rot: -0.35, amp: 1 },
      { cx: 380, cy: 100, sx: 280, sy: 170, rot: 0.42, amp: 0.48 },
      { cx: 80, cy: 360, sx: 210, sy: 260, rot: 0.16, amp: 0.3 },
    ],
    levels: levelsBetween(0.14, 0.9, 13),
  },
};

const ANCHOR_ASPECT: Record<
  NonNullable<ContourProps["anchor"]>,
  string
> = {
  "bottom-right": "xMaxYMax slice",
  "bottom-left": "xMinYMax slice",
  "top-right": "xMaxYMin slice",
  "top-left": "xMinYMin slice",
};

const ANCHOR_FADE: Record<
  NonNullable<ContourProps["anchor"]>,
  { x1: string; y1: string; x2: string; y2: string }
> = {
  "bottom-right": { x1: "100%", y1: "100%", x2: "20%", y2: "15%" },
  "bottom-left": { x1: "0%", y1: "100%", x2: "80%", y2: "15%" },
  "top-right": { x1: "100%", y1: "0%", x2: "20%", y2: "85%" },
  "top-left": { x1: "0%", y1: "0%", x2: "80%", y2: "85%" },
};

const PATTERN_FADE: Record<
  NonNullable<ContourProps["pattern"]>,
  { x1: string; y1: string; x2: string; y2: string; aspect: string }
> = {
  green: { x1: "88%", y1: "28%", x2: "8%", y2: "92%", aspect: "xMaxYMid slice" },
  ridge: { x1: "12%", y1: "18%", x2: "92%", y2: "88%", aspect: "xMidYMid slice" },
  swale: { x1: "50%", y1: "100%", x2: "50%", y2: "5%", aspect: "xMidYMax slice" },
  apron: { x1: "12%", y1: "95%", x2: "88%", y2: "12%", aspect: "xMinYMax slice" },
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
  opacity = 0.08,
  pattern,
  anchor = "bottom-right",
}: ContourProps) {
  const isCorner = !pattern;
  const rings = isCorner
    ? getRings(`corner:${anchor}`, CORNER_TERRAIN[anchor])
    : getRings(`pattern:${pattern}`, PATTERNS[pattern]);

  const fadeId = `contour-fade-${isCorner ? anchor : pattern}`;
  const fade = isCorner ? ANCHOR_FADE[anchor] : PATTERN_FADE[pattern];
  const aspect = isCorner ? ANCHOR_ASPECT[anchor] : PATTERN_FADE[pattern].aspect;

  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      style={{ opacity }}
      preserveAspectRatio={aspect}
    >
      <defs>
        <linearGradient
          id={fadeId}
          x1={fade.x1}
          y1={fade.y1}
          x2={fade.x2}
          y2={fade.y2}
        >
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="55%" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id={`${fadeId}-mask`}>
          <rect width={WIDTH} height={HEIGHT} fill={`url(#${fadeId})`} />
        </mask>
        <linearGradient id={`${fadeId}-stroke`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#009A6D" stopOpacity="0.85" />
          <stop offset="55%" stopColor="#009A6D" stopOpacity="1" />
          <stop offset="100%" stopColor="#00a878" stopOpacity="0.75" />
        </linearGradient>
      </defs>

      <g mask={`url(#${fadeId}-mask)`}>
        {rings.map((ring, index) => (
          <path
            key={index}
            d={ring.d}
            stroke={`url(#${fadeId}-stroke)`}
            strokeWidth={ring.width}
            strokeOpacity={ring.opacity}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </g>
    </svg>
  );
}
