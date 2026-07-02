import type { Metadata } from "next";
import { SITE_NAME, SUPPORT_EMAIL } from "@/lib/config";

export const metadata: Metadata = { title: "Privacy policy" };

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl py-10 md:py-16">
      <h1 className="font-display text-3xl md:text-4xl">Privacy policy</h1>
      <p className="mt-1 text-xs text-ink-mute">Last updated: June 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink-soft">
        <section>
          <h2 className="font-display text-xl text-ink">What we collect</h2>
          <p className="mt-2">
            To fulfil orders, {SITE_NAME} collects your name, contact details, delivery addresses, order
            history, and gift messages. Payment details are processed by our payment providers and never
            stored on our servers.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-ink">How we use it</h2>
          <p className="mt-2">
            We use your information to deliver orders, send order updates, run the loyalty programme, and,
            if you opt in, share occasional offers. We do not sell personal data to third parties.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-ink">Recipients&apos; data</h2>
          <p className="mt-2">
            Recipient names, phone numbers and addresses are used only to complete the delivery you
            requested and are never used for marketing.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-ink">Cookies &amp; storage</h2>
          <p className="mt-2">
            We use essential cookies and local storage to keep your cart, language choice and session
            working. Analytics, if enabled, are aggregated and anonymised.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl text-ink">Your rights</h2>
          <p className="mt-2">
            You can request a copy of your data, correct it, or ask us to delete your account at any time by
            emailing {SUPPORT_EMAIL}. We comply with applicable UAE data protection regulations, including
            Federal Decree-Law No. 45 of 2021 (PDPL).
          </p>
        </section>
      </div>
    </div>
  );
}
