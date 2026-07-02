"use client";

import { useState } from "react";
import { Clock, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { SUPPORT_EMAIL, SUPPORT_PHONE, WHATSAPP_NUMBER } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const submit = () => {
    if (!name.trim() || !email.trim() || !message.trim()) return;
    // TODO: wire to a real inbox (e.g. Resend or a CRM webhook)
    console.info("[mock contact form]", { name, email, message });
    setSent(true);
  };

  return (
    <div className="container max-w-4xl py-10 md:py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-wine">Contact</p>
      <h1 className="mt-1 font-display text-3xl md:text-5xl">We answer fast</h1>
      <p className="mt-2 max-w-xl text-sm text-ink-soft">
        Questions about an order, a custom arrangement, or weekly flowers for your office or hotel?
        WhatsApp is quickest, but the form works too.
      </p>

      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_320px]">
        {/* Form */}
        <div className="rounded-xl2 border border-line bg-white p-6">
          {sent ? (
            <div className="py-10 text-center">
              <Send className="mx-auto h-10 w-10 text-sage" />
              <p className="mt-3 font-display text-xl">Message sent</p>
              <p className="mt-1 text-sm text-ink-mute">We&apos;ll get back to you within a couple of hours (9am to 9pm).</p>
            </div>
          ) : (
            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="c-name">Name</Label>
                  <Input id="c-name" className="mt-1.5" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="c-email">Email</Label>
                  <Input id="c-email" type="email" className="mt-1.5" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
              <div>
                <Label htmlFor="c-msg">Message</Label>
                <Textarea id="c-msg" rows={5} className="mt-1.5" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us what you need…" />
              </div>
              <Button className="justify-self-start" onClick={submit}>Send message</Button>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-3">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I have a question about an order.")}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-xl2 bg-[#25D366] p-5 text-white shadow-soft transition-transform hover:-translate-y-0.5"
          >
            <MessageCircle className="h-6 w-6" />
            <div>
              <p className="font-medium">Chat on WhatsApp</p>
              <p className="text-xs opacity-90">Fastest reply, 9am to 9pm daily</p>
            </div>
          </a>

          {[
            [Phone, "Call us", SUPPORT_PHONE],
            [Mail, "Email", SUPPORT_EMAIL],
            [MapPin, "Studio", "Warehouse 12, Al Quoz 3, Dubai"],
            [Clock, "Hours", "Daily 9am to 9pm"],
          ].map(([Icon, label, value]) => {
            const I = Icon as typeof Phone;
            return (
              <div key={label as string} className="flex items-start gap-3 rounded-xl2 border border-line bg-white p-5">
                <I className="mt-0.5 h-5 w-5 text-wine" />
                <div>
                  <p className="text-sm font-medium">{label as string}</p>
                  <p className="text-xs text-ink-soft">{value as string}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
