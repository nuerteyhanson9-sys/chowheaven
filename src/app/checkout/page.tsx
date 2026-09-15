import type { Metadata } from "next";
import { CheckoutFlow } from "@/components/checkout/checkout-flow";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <section className="pt-32 pb-24 min-h-screen">
      <div className="container-x">
        <p className="eyebrow">Secure checkout</p>
        <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tightest sm:text-5xl">Checkout</h1>
      </div>
      <div className="container-x mt-10">
        <CheckoutFlow />
      </div>
    </section>
  );
}