import Link from "next/link";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";
import { KenBurns, type HeroImage } from "@/components/ui/ken-burns";

export type HeroCta = { href: string; label: string; variant?: "gold" | "outline-light" };

type PageHeroProps = {
  images: HeroImage[];
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  ctas?: HeroCta[];
  showScroll?: boolean;
  overlay?: "default" | "light";
  align?: "left" | "center";
  className?: string;
};

/**
 * Full-viewport cinematic hero shared by every major page.
 * Immersive Nigerian imagery + dark overlay + editorial lockup + CTAs.
 */
export function PageHero({
  images,
  eyebrow,
  title,
  subtitle,
  ctas,
  showScroll = true,
  overlay = "default",
  align = "left",
  className,
}: PageHeroProps) {
  const centered = align === "center";
  return (
    <section
      className={cn("relative flex h-[min(100dvh,940px)] min-h-[620px] items-center overflow-hidden", className)}
    >
      <KenBurns images={images} className="hero-media" />
      <div className={overlay === "light" ? "hero-overlay--light" : "hero-overlay"} />

      {/* Adire accent — top hairline */}
      <div className="adire-cream absolute inset-x-0 top-20 z-20 h-px opacity-30" />

      <div className={cn("relative z-10 container-x py-28", centered && "text-center")}>
        <Reveal>
          <p className={cn("eyebrow items-center text-gold-soft", centered ? "justify-center" : "")}>
            {eyebrow}
          </p>
        </Reveal>
        <Reveal delay={110}>
          <h1 className="logo-mark mt-6 max-w-4xl font-medium leading-[1.02] tracking-tightest text-paper [font-variation-settings:'opsz'_90] text-[clamp(2.6rem,6.5vw,5.25rem)]">
            {title}
          </h1>
        </Reveal>
        {subtitle && (
          <Reveal delay={240}>
            <p
              className={cn(
                "mt-7 max-w-xl text-[1.02rem] leading-relaxed text-paper/75",
                centered && "mx-auto",
              )}
            >
              {subtitle}
            </p>
          </Reveal>
        )}
        {ctas && ctas.length > 0 && (
          <Reveal delay={380}>
            <div className={cn("mt-12 flex flex-wrap gap-4", centered && "justify-center")}>
              {ctas.map((cta) => (
                <Link
                  key={cta.label}
                  href={cta.href}
                  className={cta.variant === "gold" ? "btn-order inline-flex gap-2 items-center" : "btn-outline-light"}
                >
                  {cta.label}
                </Link>
              ))}
            </div>
          </Reveal>
        )}
      </div>

      {showScroll && (
        <div className="scroll-cue">
          <span className="text-[0.62rem]">Scroll to discover</span>
          <span className="cue-line" />
        </div>
      )}
    </section>
  );
}