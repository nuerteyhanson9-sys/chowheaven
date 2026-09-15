import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <section className="pt-32 pb-20">
      <div className="container-x max-w-3xl">
        <p className="eyebrow">Legal</p>
        <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tightest">Terms of Service</h1>
        <p className="mt-2 text-sm text-ink-muted">Last updated: September 2026</p>
        <div className="prose-ink mt-8 space-y-6 text-[15px] leading-relaxed text-ink-muted">
          <p>
            These Terms of Service (&quot;Terms&quot;) govern your use of the Chow Heaven website, mobile experience
            and services (collectively, the &quot;Service&quot;). By accessing or using the Service, you agree to
            be bound by these Terms.
          </p>

          <h2 className="font-serif text-2xl text-ink">1. Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and for all
            activity under your account. You must be at least 16 years old to create an account. Provide
            accurate information and update it when necessary.
          </p>

          <h2 className="font-serif text-2xl text-ink">2. Orders &amp; payments</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>All orders are subject to availability. We reserve the right to cancel or modify orders if items are unavailable or if pricing errors occur.</li>
            <li>Prices are displayed in Nigerian Naira (₦) and include applicable taxes unless otherwise stated.</li>
            <li>Payments are processed through third-party providers (Paystack, Flutterwave). We do not store your full card details.</li>
            <li>Promotional codes and coupons are subject to their stated terms and cannot be exchanged for cash.</li>
          </ul>

          <h2 className="font-serif text-2xl text-ink">3. Reservations</h2>
          <p>
            Reservations are requests and do not constitute confirmed bookings until you receive written
            confirmation from our team. We reserve the right to release unconfirmed tables 24 hours
            before the reserved time. A valid phone number or email is required for all bookings.
          </p>

          <h2 className="font-serif text-2xl text-ink">4. Cancellations &amp; refunds</h2>
          <p>
            See our <a href="/legal/refunds" className="font-semibold text-burgundy hover:underline">Refund Policy</a> for full details on order cancellations, delivery issues and
            refund eligibility.
          </p>

          <h2 className="font-serif text-2xl text-ink">5. User conduct</h2>
          <p>
            You agree not to misuse the Service, including but not limited to: placing fraudulent orders,
            submitting false reservation details, attempting to access other users&apos; accounts, or using the
            Service for any unlawful purpose.
          </p>

          <h2 className="font-serif text-2xl text-ink">6. Intellectual property</h2>
          <p>
            All content on this website — including text, images, logos, and design — is the property of
            Chow Heaven or its licensors and is protected by applicable intellectual property laws. You may
            not reproduce or distribute content without written permission.
          </p>

          <h2 className="font-serif text-2xl text-ink">7. Limitation of liability</h2>
          <p>
            To the maximum extent permitted by law, Chow Heaven shall not be liable for any indirect,
            incidental or consequential damages arising from your use of the Service. Our total liability
            shall not exceed the value of your most recent order.
          </p>

          <h2 className="font-serif text-2xl text-ink">8. Changes to these Terms</h2>
          <p>
            We may update these Terms from time to time. Material changes will be communicated via email
            or a notice on the website. Continued use of the Service after changes take effect constitutes
            acceptance of the updated Terms.
          </p>

          <h2 className="font-serif text-2xl text-ink">9. Contact</h2>
          <p>
            Questions about these Terms? Email{" "}
            <a href="mailto:hello@chowheaven.ng" className="font-semibold text-burgundy hover:underline">hello@chowheaven.ng</a>.
          </p>
        </div>
      </div>
    </section>
  );
}