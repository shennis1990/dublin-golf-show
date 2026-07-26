import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost";

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-white hover:bg-[#00b07c] hover:shadow-[0_16px_40px_rgba(0,154,109,0.28)]",
  ghost:
    "border border-white/20 bg-white/[0.03] text-white backdrop-blur-sm hover:border-white/40 hover:bg-white/[0.07]",
};

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const classes = `group relative inline-flex items-center justify-center overflow-hidden rounded-full px-8 py-3.5 font-display text-[13px] font-semibold tracking-[0.12em] uppercase transition-all duration-500 ease-out hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${variants[variant]} ${className}`;

  if ("href" in props && props.href) {
    const { href, ...rest } = props;
    return (
      <a href={href} className={classes} {...rest}>
        <span className="relative z-10">{children}</span>
      </a>
    );
  }

  return (
    <button className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      <span className="relative z-10">{children}</span>
    </button>
  );
}
