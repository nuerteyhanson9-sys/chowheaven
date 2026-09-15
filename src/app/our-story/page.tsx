import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone } from "lucide-react";

import { getSettings } from "@/lib/settings";
import { Reveal } from "@/components/ui/reveal";
import { PageHero } from "@/components/ui/page-hero";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "The story of Chow Heaven — how a Lagos home kitchen grew into a premium Nigerian dining experience.",
};

const STORY_IMG_1 = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Suya_with_pepper_sauce.jpg/1200px-Suya_with_pepper_sauce.jpg";
const STORY_IMG_2 = "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=70";
const STORY_IMG_3 = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Pot_of_Egusi_soup.jpg/960px-Pot_of_Egusi_soup.jpg";
const INTERIOR_IMG = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=70";
const KITCHEN_IMG = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/A_plate_of_jollof_rice_and_chicken.jpg/1200px-A_plate_of_jollof_rice_and_chicken.jpg";

export default async function OurStoryPage() {
  const settings = await getSettings();

  return (
    <>
      {/* Hero */}
      <PageHero
        images={[
          { src: INTERIOR_IMG, alt: "The warm, intimate dining room of Chow Heaven in Lagos" },
          { src: STORY_IMG_2, alt: "A Chow Heaven chef plating a dish with precision" },
          { src: KITCHEN_IMG, alt: "Plate of house-special party jollof with grilled chicken" },
        ]}
        eyebrow="Our Story"
        title={
          <>
            FROM A LAGOS KITCHEN<br />
            TO THE WORLD&apos;S TABLE.
          </>
        }
        subtitle="A story rooted in Nigerian food, family, hospitality, and the flavours that bring us home."
        ctas={[
          { href: "/menu", label: "Taste It", variant: "gold" },
          { href: "/experience", label: "The Experience", variant: "outline-light" },
        ]}
        align="center"
      />

      {/* Editorial story */}
      <section className="section-space">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="space-y-6">
            <Reveal>
              <p className="eyebrow">The beginning</p>
              <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight tracking-tightest sm:text-4xl">
                It started with a pot<br />of party jollof.
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <div className="space-y-4 text-[15px] leading-relaxed text-ink-muted">
                <p>
                  Chow Heaven began exactly where most great Nigerian meals do — at a home
                  kitchen in Lagos, with a pot of smoky party jollof that guests refused to
                  leave without. That pot followed us to catered birthdays, weddings and
                  office lunches, until friends started asking a simple question:
                  <em className="text-ink"> why not open a restaurant?</em>
                </p>
                <p>
                  So we did. In 2024 we opened our doors on Market Street with a single
                  promise: cook the food we grew up on, but with the precision, sourcing and
                  presentation it deserves. No shortcuts, no compromising on flavour.
                </p>
                <p>
                  Today our kitchen celebrates the full breadth of Nigerian cooking — from
                  the smoky depths of suya and pepper soup to the comfort of egusi, pounded
                  yam and grilled seafood — all reimagined for the modern table.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Reveal delay={80}>
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image src={STORY_IMG_1} alt="Nigerian suya platter with pepper sauce" fill className="object-cover" sizes="(max-width:1024px) 50vw, 25vw" />
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="relative mt-10 aspect-[3/4] overflow-hidden">
                <Image src={STORY_IMG_3} alt="Bowl of authentic egusi soup" fill className="object-cover" sizes="(max-width:1024px) 50vw, 25vw" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Experience section (nav anchor "Experience") */}
      <section id="experience" className="section-space bg-burgundy grain">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="order-2 lg:order-1">
            <Reveal>
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={STORY_IMG_2} alt="Chef plating a dish with care at Chow Heaven" fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
              </div>
            </Reveal>
          </div>
          <div className="order-1 lg:order-2">
            <Reveal>
              <p className="eyebrow text-gold-soft">The experience</p>
              <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight tracking-tightest text-paper sm:text-4xl">
                Sense every sense.
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <div className="mt-8 space-y-8">
                <ExpBlock
                  title="The smell"
                  desc="Charcoal grills, caramelising onions and the unmistakable perfume of party jollof drifting from the kitchen."
                />
                <ExpBlock
                  title="The sound"
                  desc="Afrobeats turned low, the clink of glasses and the hum of a room full of good conversation."
                />
                <ExpBlock
                  title="The taste"
                  desc="Bold, layered, unapologetic. Every plate finishes with the little smile that says: that was home."
                />
                <ExpBlock
                  title="The warmth"
                  desc="Hospitality is our native language. You're not a customer here — you're a guest, and we mean it."
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values strip */}
      <section className="section-space">
        <div className="container-x grid gap-8 text-center sm:grid-cols-3">
          {[
            { k: "01", t: "Local & seasonal", d: "Ingredients sourced from Nigerian farms and markets, chosen daily." },
            { k: "02", t: "Cooked to order", d: "No heat lamps. Your plate leaves the pass the moment it's ready." },
            { k: "03", t: "Rooted in heritage", d: "Recipes passed down, refined with modern technique and care." },
          ].map((v, i) => (
            <Reveal key={v.k} delay={i * 100}>
              <div>
                <span className="font-serif text-5xl text-burgundy/30">{v.k}</span>
                <h3 className="mt-3 font-serif text-xl text-ink">{v.t}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-ink-muted">{v.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section-space bg-paper-warm">
        <div className="container-x grid gap-10 text-center lg:grid-cols-3 lg:text-left">
          <div className="lg:col-span-1">
            <p className="eyebrow">Find us</p>
            <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tightest sm:text-4xl">Come hungry.</h2>
          </div>
          <div className="space-y-4 text-sm lg:col-span-2">
            <div className="rounded-sm border border-ink/10 bg-paper-card p-6">
              <p className="flex items-start gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" />{settings.address}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-sm border border-ink/10 bg-paper-card p-6">
                <p className="flex items-center gap-3">
                  <Phone className="h-5 w-5 shrink-0 text-gold" />
                  <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="hover:text-burgundy">{settings.phone}</a>
                </p>
              </div>
              <div className="rounded-sm border border-ink/10 bg-paper-card p-6">
                <p className="font-semibold text-ink">{settings.hours}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/reservations" className="btn-primary">Reserve a Table</Link>
              <Link href="/gallery" className="btn-outline">See the Gallery</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ExpBlock({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="border-l border-gold/40 pl-5">
      <h3 className="font-serif text-xl text-paper">{title}</h3>
      <p className="mt-1.5 max-w-md text-sm leading-relaxed text-paper/65">{desc}</p>
    </div>
  );
}