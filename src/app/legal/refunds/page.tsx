import type { Metadata } from "next";

export const metadata: Metadata = { title: "Refund Policy" };

export default function RefundsPage() {
  return (
    <section className="pt-32 pb-20">
      <div className="container-x max-w-3xl">
        <p className="eyebrow">Legal</p>
        <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tightest">Refund Policy</h1>
        <p className="mt-2 text-sm text-ink-muted">Last updated: September 2026</p>
        <div className="prose-ink mt-8 space-y-6 text-[15px] leading-relaxed text-ink-muted">
          <p>
            We want every meal at Chow Heaven to meet your expectations. If something isn&apos;t right,
            this policy explains how we handle refunds and cancellations.
          </p>

          <h2 className="font-serif text-2xl text-ink">1. Order cancellations</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li><strong>Before preparation:</strong> You may cancel an order at no charge if it has not yet entered preparation. Contact us immediately via phone or email.</li>
            <li><strong>During preparation:</strong> Cancellation may incur a partial charge to cover ingredients already prepared.</li>
            <li><strong>After dispatch:</strong> Orders that have already been dispatched or collected cannot be cancelled. The full order amount is due.</li>
          </ul>

          <h2 className="font-serif text-2xl text-ink">2. Delivery issues</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>If your order arrives damaged, incomplete or significantly different from what was ordered, contact us within 2 hours of delivery with photographic evidence.</li>
            <li>We will review the issue and may offer a full or partial refund, a replacement order, or credit toward a future order at our discretion.</li>
            <li>Late deliveries caused by circumstances beyond our control (severe weather, traffic disruption) do not qualify for automatic refunds, but we will work with you to find a fair resolution.</li>
          </ul>

          <h2 className="font-serif text-2xl text-ink">3. Quality concerns</h2>
          <p>
            If you are unsatisfied with the quality of your meal, please contact us within 24 hours of
            receipt. We may request a photograph of the item to assess the issue. Approved quality-related
            refunds are processed within 5–7 business days to the original payment method.
          </p>

          <h2 className="font-serif text-2xl text-ink">4. Reservation cancellations</h2>
          <p>
            You may cancel or reschedule a reservation at no charge up to 24 hours before the reserved
            time. Late cancellations or no-shows may affect future booking privileges, particularly for
            large party or private event bookings.
          </p>

          <h2 className="font-serif text-2xl text-ink">5. Promotional orders</h2>
          <p>
            Orders placed using promotional codes or coupon discounts are refunded based on the amount
            actually paid, not the full menu price. Promotional value cannot be converted to cash.
          </p>

          <h2 className="font-serif text-2xl text-ink">6. How refunds are processed</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Refunds are returned to the original payment method wherever possible.</li>
            <li>Bank transfer refunds may take up to 10 business days to appear in your account.</li>
            <li>Cash-on-delivery refunds are issued via bank transfer to an account you provide.</li>
            <li>You will receive an email confirmation when a refund is processed.</li>
          </ul>

          <h2 className="font-serif text-2xl text-ink">7. Contact</h2>
          <p>
            To request a refund or report an issue, email{" "}
            <a href="mailto:hello@chowheaven.ng" className="font-semibold text-burgundy hover:underline">hello@chowheaven.ng</a>{" "}
            or call <a href="tel:+2348035550199" className="font-semibold text-burgundy hover:underline">+234 803 555 0199</a>.
            We aim to respond to all refund requests within 24 hours.
          </p>
        </div>
      </div>
    </section>
  );
}