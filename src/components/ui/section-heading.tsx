import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  copy,
  align = "left",
  light = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  copy?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className={cn("eyebrow justify-center", align === "center" ? "justify-center" : "")}>
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "mt-4 font-serif text-4xl font-semibold leading-[1.08] tracking-tightest sm:text-5xl",
          light ? "text-paper" : "text-ink",
        )}
      >
        {title}
      </h2>
      {copy && (
        <p className={cn("mt-5 max-w-xl text-[15px] leading-relaxed", light ? "text-paper/70" : "text-ink-muted")}>
          {copy}
        </p>
      )}
    </div>
  );
}