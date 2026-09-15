import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = { title: "Your Cart" };

export default function CartPage() {
  return (
    <section className="pt-32 pb-20 min-h-screen">
      <div className="container-x">
        <p className="eyebrow">Almost there</p>
        <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tightest sm:text-5xl">Your Cart</h1>
      </div>
      <div className="container-x mt-10">
        <CartView />
      </div>
    </section>
  );
}