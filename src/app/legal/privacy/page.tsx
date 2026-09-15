import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <section className="pt-32 pb-20">
      <div className="container-x max-w-3xl">
        <p className="eyebrow">Legal</p>
        <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tightest">Privacy Policy</h1>
        <p className="mt-2 text-sm text-ink-muted">Last updated: September 2026</p>
        <div className="prose-ink mt-8 space-y-6 text-[15px] leading-relaxed text-ink-muted">
          <p>
            Chow Heaven (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) respects your privacy. This policy explains what personal
            data we collect, how we use it, and your rights under applicable data protection laws, including
            Nigeria&apos;s NDPR and the UK GDPR.
          </p>

          <h2 className="font-serif text-2xl text-ink">1. Data we collect</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li><strong>Account data:</strong> name, email address, phone number and password (stored securely as a bcrypt hash).</li>
            <li><strong>Order data:</strong> items ordered, delivery address, payment reference, and transaction metadata.</li>
            <li><strong>Reservation data:</strong> booking date, time, number of guests and special requests.</li>
            <li><strong>Usage data:</strong> anonymised analytics (page views, referrers) collected through privacy-respecting tools.</li>
            <li><strong>Cookies:</strong> a single session cookie (<code>chw_session</code>) is used to keep you signed in. No third-party tracking cookies are set.</li>
          </ul>

          <h2 className="font-serif text-2xl text-ink">2. How we use your data</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>To process orders and reservations, and to send order-related communications (confirmation, status updates).</li>
            <li>To manage your account, loyalty points and favourites.</li>
            <li>To communicate with you about feedback and support requests.</li>
            <li>To improve our menu, service and website through aggregated, anonymised analytics.</li>
            <li>To comply with legal obligations and prevent fraud.</li>
          </ul>

          <h2 className="font-serif text-2xl text-ink">3. Data sharing</h2>
          <p>
            We do not sell your personal data. We share limited data with payment processors (Paystack / Flutterwave)
            solely to complete transactions, and with delivery partners only when you place a delivery order. All third
            parties are contractually bound to protect your information.
          </p>

          <h2 className="font-serif text-2xl text-ink">4. Data retention</h2>
          <p>
            Account data is retained for as long as your account is active. Order records are retained for up to six
            years for accounting and legal compliance. You may request deletion at any time by contacting us.
          </p>

          <h2 className="font-serif text-2xl text-ink">5. Your rights</h2>
          <p>
            You have the right to access, correct, port or delete your personal data. To exercise these rights,
            contact us at <a href="mailto:hello@chowheaven.ng" className="font-semibold text-burgundy hover:underline">hello@chowheaven.ng</a>.
          </p>

          <h2 className="font-serif text-2xl text-ink">6. Security</h2>
          <p>
            We implement industry-standard security measures including encrypted password storage (bcrypt),
            secure HTTP-only session cookies (SameSite=Lax), rate limiting on authentication endpoints, and
            HTTPS for all production traffic.
          </p>

          <h2 className="font-serif text-2xl text-ink">7. Contact</h2>
          <p>
            For privacy questions or data requests, email{" "}
            <a href="mailto:hello@chowheaven.ng" className="font-semibold text-burgundy hover:underline">hello@chowheaven.ng</a>.
          </p>
        </div>
      </div>
    </section>
  );
}