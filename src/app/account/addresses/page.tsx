import type { Metadata } from "next";
import { getAddresses } from "@/app/actions/account";
import { AddressesManager } from "@/components/account/addresses-manager";

export const metadata: Metadata = { title: "Addresses" };
export const dynamic = "force-dynamic";

export default async function AccountAddressesPage() {
  const addresses = await getAddresses();

  return (
    <div>
      <h2 className="font-serif text-2xl text-ink">Addresses</h2>
      <p className="mt-1 text-sm text-ink-muted">Saved delivery addresses for faster checkout.</p>
      <div className="mt-6">
        <AddressesManager
          addresses={addresses.map((a) => ({
            id: a.id,
            label: a.label,
            street: a.street,
            city: a.city,
            state: a.state,
            zip: a.zip,
            isDefault: a.isDefault,
          }))}
        />
      </div>
    </div>
  );
}