import Link from "next/link";
import Image from "next/image";
import { Star, ArrowRight, ChefHat, Flame, Utensils } from "lucide-react";

import { prisma } from "@/lib/db";
import { formatMoney } from "@/lib/utils";
import { getPublicReviews } from "@/app/actions/reviews";
import { SITE } from "@/lib/constants";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { RatingStars } from "@/components/ui/skeleton";

const HERO_IMG = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/A_plate_of_jollof_rice_and_chicken.jpg/1200px-A_plate_of_jollof_rice_and_chicken.jpg";
const STORY_IMG = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Suya_with_pepper_sauce.jpg/1200px-Suya_with_pepper_sauce.jpg";
const INTRO_IMG = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Pot_of_Egusi_soup.jpg/960px-Pot_of_Egusi_soup.jpg";

export const revalidate = 120;

async function getFeatured() {
  const items = await prisma.menuItem.findMany({
    where: { available: true, isFeatured: true },
    include: { category: true },
    take: 6,
    orderBy: { createdAt: "desc" },
  });
  return items.map((i) => ({
    ...i,
    price: Number(i.price),
    discountPrice: i.discountPrice ? Number(i.discountPrice) : null,
  }));
}

async function getRecentReviews() {
  const reviews = await prisma.review.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });
  return reviews;
}

export default async function HomePage() {
  const [featured, reviews] = await Promise.all([getFeatured(), getRecentReviews()]);

  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="relative flex h-[min(100dvh,900px)] min-h-[600px] items-center overflow-hidden">
        <Image
          src={HERO_IMG}
          alt="Plate of Nigerian jollof rice and grilled chicken"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-night/85 via-night/55 to-night/75" />

        <div className="relative z-10 container-x py-24">
          <Reveal>
            <p className="eyebrow text-gold-soft">Est. 2024 — Lagos, Nigeria</p>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="mt-6 font-serif text-[clamp(2.8rem,7vw,5.5rem)] font-semibold leading-[1.02] tracking-tightest text-paper">
              THE TASTE OF<br />
              NIGERIA, REIMAGINED
            </h1>
          </Reveal>
          <Reveal delay={250}>
            <p className="mt-7 max-w-lg text-lg leading-relaxed text-paper/75">
              Authentic Nigerian flavours presented with contemporary elegance —
              from smoky jollof rice to sizzling suya platters, every dish
              celebrates home.
            </p>
          </Reveal>
          <Reveal delay={400}>
            <div className="mt-12 flex flex-wrap gap-4">
              <Link href="/menu" className="btn-primary text-base tracking-wider">
                ORDER ONLINE
              </Link>
              <Link
                href="/reservations"
                className="btn border-paper/40 bg-transparent px-7 py-3.5 text-sm font-semibold tracking-wide text-paper transition-all hover:border-paper hover:bg-paper/10"
              >
                RESERVE A TABLE
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ INTRO ═══ */}
      <section className="section-space">
        <div className="container-x grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <div>
              <p className="eyebrow">A Taste of Home</p>
              <h2 className="mt-4 font-serif text-4xl font-semibold tracking-tightest sm:text-5xl">
                Every plate tells<br />a story of heritage.
              </h2>
              <p className="mt-6 text-[15px] leading-relaxed text-ink-muted">
                At Chow Heaven, tradition meets craft. Our kitchen honours
                recipes that have travelled across generations of Nigerian homes,
                refined with the care and precision that a modern dining
                experience demands.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
                We source locally, cook boldly, and serve every dish with the
                pride of people who believe Nigerian cuisine deserves a seat at
                the world&apos;s table.
              </p>
              <div className="mt-10 flex gap-12 text-ink-muted">
                <Stat icon={<ChefHat className="h-5 w-5 text-gold" />} label="Authentic Recipes" />
                <Stat icon={<Flame className="h-5 w-5 text-gold" />} label="Fired Fresh Daily" />
                <Stat icon={<Utensils className="h-5 w-5 text-gold" />} label="Casual Elegance" />
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="relative aspect-[4/5] overflow-hidden bg-paper-warm">
              <Image
                src={INTRO_IMG}
                alt="Pot of authentic Nigerian egusi soup"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ SIGNATURE DISHES ═══ */}
      {featured.length > 0 && (
        <section className="section-space bg-paper-warm">
          <div className="container-x">
            <Reveal>
              <SectionHeading
                eyebrow="From our kitchen"
                title="Signature dishes"
                copy="Handpicked favourites — the plates our guests return for again and again."
                align="center"
              />
            </Reveal>
            <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((item, i) => (
                <Reveal key={item.id} delay={i * 80}>
                  <Link
                    href="/menu"
                    className="group card-shell overflow-hidden transition-shadow hover:shadow-lift"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-paper-deep">
                          <span className="text-sm text-ink-faint">Image coming soon</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-serif text-lg text-ink">{item.name}</h3>
                          <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{item.description}</p>
                        </div>
                        <span className="shrink-0 text-right font-serif text-lg font-bold text-burgundy">
                          {formatMoney(item.discountPrice ?? item.price)}
                          {item.discountPrice && (
                            <span className="block text-xs font-normal text-ink-faint line-through">{formatMoney(item.price)}</span>
                          )}
                        </span>
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                        <span className="tag-chip text-gold">{item.category?.name}</span>
                        <ArrowRight className="ml-auto h-4 w-4 text-gold opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
            <Reveal delay={300}>
              <div className="mt-14 text-center">
                <Link href="/menu" className="btn-outline px-10">
                  View Full Menu
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ═══ EXPERIENCE STRIP ═══ */}
      <section id="experience" className="relative overflow-hidden bg-burgundy py-28 grain">
        <div className="relative z-10 container-x text-center">
          <Reveal>
            <p className="eyebrow text-gold-soft">The Chow Heaven Experience</p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-4 font-serif text-4xl font-semibold leading-[1.08] tracking-tightest text-paper sm:text-5xl">
              More than a meal.<br />A celebration of culture.
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed text-paper/70">
              From the warmth of our welcome to the last bite of your dessert,
              every moment at Chow Heaven is crafted to feel like home — elevated,
              memorable, unmistakably Nigerian.
            </p>
          </Reveal>
          <Reveal delay={350}>
            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              <ExperienceCard
                title="The Food"
                desc="Bold, uncompromising Nigerian flavours, plated with the care of a fine-dining kitchen."
              />
              <ExperienceCard
                title="The Atmosphere"
                desc="Warm textures, soft light and the music of home — designed for slow, joyful evenings."
              />
              <ExperienceCard
                title="The People"
                desc="Hospitality that runs deep. You are a guest here, always."
              />
            </div>
          </Reveal>
          <Reveal delay={500}>
            <div className="mt-16">
              <Link href="/our-story#experience" className="btn border-paper/40 bg-transparent px-10 py-3.5 text-paper hover:bg-paper/10">
                Discover Our Story
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      {reviews.length > 0 && (
        <section className="section-space">
          <div className="container-x">
            <Reveal>
              <SectionHeading
                eyebrow="What our guests say"
                title="Words from the table"
                align="center"
              />
            </Reveal>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review, i) => (
                <Reveal key={review.id} delay={i * 70}>
                  <div className="card-shell p-6">
                    <RatingStars value={review.rating} />
                    <p className="mt-4 text-sm leading-relaxed text-ink-muted line-clamp-4">
                      {review.comment}
                    </p>
                    <p className="mt-4 text-xs font-bold uppercase tracking-wider text-ink-faint">
                      — {review.customerName ?? "A valued guest"}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ FINAL CTA ═══ */}
      <section className="relative overflow-hidden bg-paper-warm py-28">
        <div className="absolute inset-0 right-0 top-0 hidden opacity-40 lg:block">
          <Image
            src={STORY_IMG}
            alt="Nigerian suya platter"
            fill
            className="object-cover"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-paper-warm via-paper-warm/90 to-paper-warm/20" />
        </div>
        <div className="relative z-10 container-x flex max-w-2xl flex-col items-start gap-8 lg:max-w-none lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Reveal>
              <h2 className="font-serif text-4xl font-semibold tracking-tightest sm:text-5xl">
                Ready to order?
              </h2>
              <p className="mt-5 max-w-md text-[15px] text-ink-muted">
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

function Stat({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      {icon}
      <span className="text-sm font-semibold">{label}</span>
    </div>
  );
}

function ExperienceCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-sm border border-paper/10 bg-paper/5 px-8 py-8 text-left">
      <h3 className="font-serif text-xl text-paper">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-paper/65">{desc}</p>
    </div>
  );
}