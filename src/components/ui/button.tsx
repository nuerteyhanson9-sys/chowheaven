import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "gold" | "outline" | "ghost" | "dark";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
};

const sizes = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-sm",
};

const variants = {
  primary: "border-burgundy bg-burgundy text-paper shadow-card hover:-translate-y-0.5 hover:bg-burgundy-deep hover:shadow-lift",
  gold: "border-gold bg-gold text-night hover:-translate-y-0.5 hover:bg-gold-deep hover:shadow-lift",
  outline: "border-ink/25 bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-paper",
  ghost: "border-transparent bg-transparent text-ink/80 hover:bg-ink/5 hover:text-ink",
  dark: "border-ink bg-ink text-paper hover:bg-burgundy",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn("btn rounded-sm font-semibold tracking-wide", variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden
        />
      )}
      {children}
    </button>
  );
}