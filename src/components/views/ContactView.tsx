"use client";

import { useState } from "react";
import { Clock, Facebook, Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Reveal } from "@/components/boutique/SectionHeading";
import { toast } from "sonner";

export function ContactView() {
  const [form, setForm] = useState({ name: "", contact: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.contact.trim() || !form.message.trim()) {
      toast.error("Please fill in your name, contact and message");
      return;
    }
    setSending(true);
    // simulate send — messages are delivered to our inbox by the team
    setTimeout(() => {
      setSending(false);
      setForm({ name: "", contact: "", subject: "", message: "" });
      toast.success("Message sent! 💕", { description: "We usually reply within a few hours." });
    }, 900);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 md:pt-12">
      <header className="text-center">
        <p className="eyebrow text-rosegold">We&rsquo;d love to hear from you</p>
        <h1 className="mt-2 font-serif text-4xl text-charcoal md:text-5xl">Contact Us</h1>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">
          Questions about an order, a product, or a bulk gift? Message us — a real human replies.
        </p>
      </header>

      <div className="mt-12 grid gap-8 lg:grid-cols-[380px_1fr] lg:gap-12">
        {/* info cards */}
        <div className="space-y-4">
          {[
            {
              icon: Phone,
              title: "Phone / WhatsApp",
              lines: ["+880 1XXX-XXXXXX", "Saturday–Thursday, 10am–8pm"],
            },
            {
              icon: Facebook,
              title: "Facebook",
              lines: ["Message us anytime", "fb.com/jobascloset"],
            },
            {
              icon: Mail,
              title: "Email",
              lines: ["hello@jobascloset.com", "Replies within 24 hours"],
            },
            {
              icon: MapPin,
              title: "Business Address",
              lines: ["Dhaka, Bangladesh", "Online-only boutique, shipping nationwide"],
            },
          ].map((c) => (
            <Reveal key={c.title}>
              <div className="flex gap-4 rounded-3xl border border-blush-100 bg-white p-5 shadow-soft">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-blush-100 text-blush-600">
                  <c.icon className="size-5" />
                </span>
                <div>
                  <h2 className="text-sm font-bold text-charcoal">{c.title}</h2>
                  {c.lines.map((l) => (
                    <p key={l} className="mt-0.5 text-[13px] leading-relaxed text-charcoal-soft">{l}</p>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
          <div className="flex items-center gap-2 rounded-3xl bg-blush-50 p-4 text-xs text-blush-700">
            <Clock className="size-4 shrink-0" />
            <span>Fastest replies on Facebook Messenger during business hours.</span>
          </div>
        </div>

        {/* form */}
        <Reveal delay={0.1}>
          <form onSubmit={submit} className="rounded-3xl border border-blush-100 bg-white p-6 shadow-soft sm:p-8">
            <h2 className="font-serif text-2xl font-semibold text-charcoal">Send a Message</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="c-name" className="text-charcoal-soft">Your Name *</Label>
                <Input id="c-name" value={form.name} onChange={set("name")} placeholder="e.g. Farhana Akter" className="border-blush-200 focus-visible:ring-blush-300" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-contact" className="text-charcoal-soft">
                  Phone or Email <span className="text-stone-gray">*</span>
                </Label>
                <Input id="c-contact" value={form.contact} onChange={set("contact")} placeholder="01XXXXXXXXX" className="border-blush-200 focus-visible:ring-blush-300" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="c-subject" className="text-charcoal-soft">
                  Subject <span className="text-stone-gray">(optional)</span>
                </Label>
                <Input id="c-subject" value={form.subject} onChange={set("subject")} placeholder="Order help, product question..." className="border-blush-200 focus-visible:ring-blush-300" />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="c-message" className="text-charcoal-soft">Message *</Label>
                <Textarea id="c-message" value={form.message} onChange={set("message")} rows={5} placeholder="How can we help you?" className="resize-none border-blush-200 focus-visible:ring-blush-300" />
              </div>
            </div>
            <Button
              type="submit"
              disabled={sending}
              className="mt-6 h-12 rounded-full bg-blush-600 px-9 font-semibold hover:bg-blush-700"
            >
              {sending ? "Sending..." : (
                <>
                  Send Message <Send className="ml-2 size-4" />
                </>
              )}
            </Button>
          </form>
        </Reveal>
      </div>
    </div>
  );
}
