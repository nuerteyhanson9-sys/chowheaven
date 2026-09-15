import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="grid min-h-screen grid-cols-1 lg:grid-cols-[1fr_1.1fr]">
      <div className="hidden items-center justify-center bg-night lg:flex">
        <div className="max-w-md p-12">
          <Reveal>
            <Link href="/" className="font-serif text-4xl font-bold text-paper">
              Chow<span className="text-gold">Heaven</span>
            </Link>
            <p className="mt-6 font-serif text-2xl leading-snug text-paper/80">
              “The taste of Nigeria,<br />reimagined.”
            </p>
            <p className="mt-6 text-sm leading-relaxed text-paper/50">
              Order jollof that tastes like the best party you ever went to,
              suya that&apos;s still cracking off the grill, and soups so good
              they deserve a second bowl.
            </p>
            <Link href="/menu" className="mt-10 inline-block text-sm font-bold tracking-wider text-gold underline-offset-4 hover:underline">
              Explore the menu →
            </Link>
          </Reveal>
        </div>
      </div>

      <div className="flex items-center justify-center bg-paper px-6 py-16 sm:px-10">
        <div className="w-full max-w-md">
          <Reveal>
            <Link href="/" className="mb-8 inline-block font-serif text-2xl font-bold text-ink lg:hidden">
              Chow<span className="text-gold">Heaven</span>
            </Link>
            <h1 className="font-serif text-3xl font-semibold tracking-tightest text-ink">{title}</h1>
            {subtitle && <p className="mt-2 text-sm text-ink-muted">{subtitle}</p>}
            <div className="mt-8">{children}</div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}