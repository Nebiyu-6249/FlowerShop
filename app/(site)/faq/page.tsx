import type { Metadata } from "next";
import { ChevronDown } from "lucide-react";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about delivery times, freshness guarantee, payments, substitutions and custom orders.",
};

const FAQS: [string, string][] = [
  [
    "How late can I order for same-day delivery?",
    "Order by 6pm for same-day delivery anywhere we cover. In central Dubai, our 1-hour express slot runs 10am to 8pm.",
  ],
  [
    "What if the recipient isn't home?",
    "Our driver calls the recipient on arrival. If they're unreachable, we'll contact you to leave the flowers with reception, a neighbour, or reschedule for a small fee.",
  ],
  [
    "How long will the flowers last?",
    "Every arrangement carries a 7-day freshness guarantee. Follow the care card (trim stems, fresh water every 2 days, keep away from AC vents) and most bouquets last 8 to 10 days.",
  ],
  [
    "Do you substitute flowers?",
    "Flowers are seasonal, so if a stem isn't at its best we substitute with an equal or higher value stem in the same palette. The overall look always matches the photos.",
  ],
  [
    "Which payment methods do you accept?",
    "Cards (Visa, Mastercard, Amex), Apple Pay, Google Pay, and buy-now-pay-later with Tabby and Tamara.",
  ],
  [
    "Can I include a gift message?",
    "Yes, add up to 200 characters at the product page or in your cart. It's handwritten on our studio card, and we never include prices in the box.",
  ],
  [
    "Do you do weddings and corporate arrangements?",
    "We do. Message us on WhatsApp or through the contact form with your date and brief, and our studio team will send a proposal within 24 hours.",
  ],
  [
    "Can I change or cancel my order?",
    "You can change or cancel free of charge up to the moment the bouquet enters production, usually 2 to 3 hours before the delivery slot. After that, contact us on WhatsApp and we'll do our best.",
  ],
];

export default function FaqPage() {
  return (
    <div className="container max-w-3xl py-10 md:py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-wine">Help</p>
      <h1 className="mt-1 font-display text-3xl md:text-5xl">Frequently asked questions</h1>

      <div className="mt-8 space-y-3">
        {FAQS.map(([q, a]) => (
          <details key={q} className="group rounded-xl2 border border-line bg-white">
            <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 text-sm font-medium [&::-webkit-details-marker]:hidden">
              {q}
              <ChevronDown className="h-4 w-4 shrink-0 text-ink-mute transition-transform group-open:rotate-180" />
            </summary>
            <p className="px-5 pb-5 text-sm leading-relaxed text-ink-soft">{a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
