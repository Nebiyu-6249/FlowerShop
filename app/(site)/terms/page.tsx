import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/config";

export const metadata: Metadata = { title: "Terms of service" };

export default function TermsPage() {
  return (
    <div className="container max-w-3xl py-10 md:py-16">
      <h1 className="font-display text-3xl md:text-4xl">Terms of service</h1>
      <p className="mt-1 text-xs text-ink-mute">Last updated: June 2026</p>

      <div className="prose-sm mt-8 space-y-6 text-sm leading-relaxed text-ink-soft">
        <section>
          <h2 className="font-display text-xl text-ink">1. Who we are</h2>
          <p className="mt-2">
            {SITE_NAME} operates this website and delivers floral arrangements and gifts within the United
            Arab Emirates. By placing an order you agree to these terms.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-ink">2. Orders &amp; payment</h2>
          <p className="mt-2">
            All prices are in UAE Dirhams (AED) and include VAT where applicable. An order is confirmed once
            payment is authorised and you receive an order number. We may decline or refund orders we cannot
            fulfil, for example due to stock or delivery coverage.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-ink">3. Delivery</h2>
          <p className="mt-2">
            Delivery windows are estimates. We are not responsible for delays caused by incorrect address
            details or an unreachable recipient, though we will always attempt to contact you before
            returning an order to the studio. Re-delivery may carry an additional fee.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-ink">4. Substitutions &amp; freshness</h2>
          <p className="mt-2">
            Flowers are natural, seasonal products. Where a pictured stem is unavailable we substitute with
            one of equal or greater value in a matching palette. Arrangements are covered by a 7-day
            freshness guarantee when cared for per the included care card.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-ink">5. Cancellations &amp; refunds</h2>
          <p className="mt-2">
            Orders can be modified or cancelled free of charge until production begins. Once a bouquet has
            been prepared or dispatched, refunds are at our discretion and typically issued as store credit.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-ink">6. Contact</h2>
          <p className="mt-2">Questions about these terms? Reach us via the contact page or WhatsApp.</p>
        </section>
      </div>
    </div>
  );
}
