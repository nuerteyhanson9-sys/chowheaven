import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/ui/reveal";
import { PageHero } from "@/components/ui/page-hero";

export const metadata: Metadata = {
  title: "The Experience",
  description:
    "More than a meal — a celebration of Nigerian culture, warmth and hospitality at Chow Heaven, Lagos.",
};

const INTERIOR_1 = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=70";
const INTERIOR_2 = "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1600&q=70";
const CHEF = "/images/menu/chef-in-kitchen.jpg";
const FOOD_1 = "/images/menu/party-jollof.jpg";
const FOOD_2 = "/images/menu/suya-platter.jpg";
const FOOD_3 = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Puff_Puff.jpg/960px-Puff_Puff.jpg";
const DRINK = "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1400&q=70";

export default function ExperiencePage() {
  return (
    <>
      {/* ═══ HERO ═══ */}
      <PageHero
        images={[
          { src: INTERIOR_1, alt: "Warm evening atmosphere inside Chow Heaven restaurant in Lagos" },
          { src: INTERIOR_2, alt: "Guests enjoying a meal at Chow Heaven's open kitchen bar" },
          { src: FOOD_1, alt: "Beautifully plated Nigerian jollof rice with grilled chicken" },
        ]}
        eyebrow="The Chow Heaven Experience"
        title={
          <>
            MORE THAN A MEAL.<br />
            A CELEBRATION OF CULTURE.
          </>
        }
        subtitle="From the warmth of our welcome to the last bite of your dessert, every moment at Chow Heaven is crafted to feel like home — elevated, memorable, unmistakably Nigerian."
        ctas={[
          { href: "/menu", label: "Explore the Menu", variant: "gold" },
          { href: "/reservations", label: "Reserve a Table", variant: "outline-light" },
        ]}
      />

      {/* ═══ THE FOOD ═══ */}
      <section className="section-space">
        <div className="container-x grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="order-2 lg:order-1">
            <Reveal>
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-paper-warm">
                <Image
                  src={FOOD_2}
                  alt="Charcoal-grilled suya skewers with pepper sauce — a signature at Chow Heaven"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width:1024px) 100vw, 50vw"
                />
              </div>
            </Reveal>
          </div>
          <div className="order-1 lg:order-2">
            <Reveal>
              <div className="hairline-gold" />
              <p className="eyebrow mt-6">The Food</p>
              <h2 className="mt-4 font-serif text-3xl font-semibold leading-[1.08] tracking-tightest text-ink sm:text-4xl">
                Bold, unapologetic,<br />
                unmistakably Nigerian.
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <div className="mt-8 space-y-5 text-[0.95rem] leading-relaxed text-ink-muted">
                <p>
                  Every dish at Chow Heaven begins with a question: how do we honour the
                  recipe while elevating the plate? Our kitchen is rooted in the flavours
                  of Nigerian homes — the smoky depths of party jollof, the rich warmth
                  of egusi soup, the charcoal perfume of suya.
                </p>
                <p>
                  We source ingredients daily from Lagos markets and Nigerian farms.
                  Our chefs cook boldly and plate with the care of a fine-dining kitchen.
                  The result is food that feels both familiar and new — like tasting
                  your grandmother&apos;s cooking for the first time.
                </p>
              </div>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-10 grid grid-cols-3 gap-6">
                <ExperienceStat value="12+" label="Signature dishes" />
                <ExperienceStat value="7" label="Menu categories" />
                <ExperienceStat value="Daily" label="Fresh from market" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ THE ATMOSPHERE ═══ */}
      <section className="section-space bg-paper-warm motif-gold">
        <div className="container-x grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <div className="hairline-gold" />
              <p className="eyebrow mt-6">The Atmosphere</p>
              <h2 className="mt-4 font-serif text-3xl font-semibold leading-[1.08] tracking-tightest text-ink sm:text-4xl">
                Warm textures, soft light<br />
                and the music of home.
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <div className="mt-8 space-y-5 text-[0.95rem] leading-relaxed text-ink-muted">
                <p>
                  Our space is designed for slow, joyful evenings. Warm lighting,
                  textured walls inspired by Nigerian craft, and a soundtrack of
                  Afrobeats turned just low enough for good conversation.
                </p>
                <p>
                  Whether you are here for a quick lunch, a family celebration or a
                  long evening with friends, the atmosphere adapts to you. Every table
                  feels like the best table in the house.
                </p>
              </div>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/reservations" className="btn-primary">Reserve a Table</Link>
                <Link href="/gallery" className="btn-outline">See the Gallery</Link>
              </div>
            </Reveal>
          </div>
          <div>
            <Reveal>
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-paper-deep">
                <Image
                  src={INTERIOR_1}
                  alt="The warm, inviting dining room at Chow Heaven, Lagos"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width:1024px) 100vw, 50vw"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ THE PEOPLE ═══ */}
      <section className="section-space overflow-hidden bg-burgundy grain adire-cream">
        <div className="container-x grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="order-2 lg:order-1">
            <Reveal>
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                <Image
                  src={CHEF}
                  alt="A Chow Heaven chef carefully plating a Nigerian dish with precision and care"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width:1024px) 100vw, 50vw"
                />
              </div>
            </Reveal>
          </div>
          <div className="order-1 lg:order-2">
            <Reveal>
              <div className="hairline-gold" />
              <p className="eyebrow mt-6 text-gold-soft">The People</p>
              <h2 className="mt-4 font-serif text-3xl font-semibold leading-[1.08] tracking-tightest text-paper sm:text-4xl">
                Hospitality that runs deep.
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <div className="mt-8 space-y-5 text-[0.95rem] leading-relaxed text-paper/75">
                <p>
                  Nigerian hospitality is not a service — it is a language. At Chow Heaven,
                  every guest is welcomed with the same warmth you would find in a family
                  home. We remember your name. We remember your favourite dish.
                </p>
                <p>
                  Our team is built on pride — pride in Nigerian food, Nigerian culture,
                  and the belief that every person who walks through our doors deserves
                  to feel like family.
                </p>
              </div>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-10 grid grid-cols-3 gap-6 border-t border-paper/15 pt-10">
                <ExperienceStat light value="4.8" label="Guest rating" />
                <ExperienceStat light value="42" label="Team members" />
                <ExperienceStat light value="∞" label="Hospitality" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative overflow-hidden bg-paper-warm py-28 motif-gold">
        <div className="absolute inset-0 right-0 top-0 hidden opacity-40 lg:block">
          <Image src={FOOD_3} alt="Nigerian puff puff dessert" fill className="object-cover" sizes="50vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-paper-warm via-paper-warm/90 to-paper-warm/20" />
        </div>
        <div className="relative z-10 container-x flex max-w-2xl flex-col items-start gap-8 lg:max-w-none lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Reveal>
              <h2 className="font-serif text-4xl font-semibold tracking-tightest sm:text-5xl">
                Come for the food.<br />Stay for the experience.
              </h2>
              <p className="mt-5 max-w-md text-[0.95rem] text-ink-muted">
                Dine in, pick up, or have it delivered — your favourite Nigerian
                dishes are a few taps away.
              </p>
            </Reveal>
          </div>
          <Reveal delay={150}>
            <div className="flex flex-wrap gap-4">
              <Link href="/menu" className="btn-primary">ORDER ONLINE</Link>
              <Link href="/reservations" className="btn-outline">RESERVE A TABLE</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function ExperienceStat({ value, label, light }: { value: string; label: string; light?: boolean }) {
  return (
    <div>
      <span className={`font-serif text-3xl font-semibold ${light ? "text-gold-soft" : "text-burgundy"}`}>{value}</span>
      <p className={`mt-1 text-xs font-semibold uppercase tracking-wider ${light ? "text-paper/60" : "text-ink-faint"}`}>{label}</p>
    </div>
  );
}