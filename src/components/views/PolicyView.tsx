"use client";

import { Link } from "@/lib/router";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/boutique/SectionHeading";

type Doc = {
  title: string;
  intro: string;
  sections: { heading: string; body: string[] }[];
};

const DOCS: Record<string, Doc> = {
  privacy: {
    title: "Privacy Policy",
    intro:
      "Your privacy matters to us. This policy explains what information Joba's Closet collects when you shop with us and how we keep it safe.",
    sections: [
      {
        heading: "What we collect",
        body: [
          "When you place an order we collect your name, phone number, delivery address and any optional details you share such as an email address or delivery note. This is the minimum we need to deliver your order and contact you about it.",
          "If you contact us through the contact form, Facebook or WhatsApp, we keep the conversation so we can help you better next time. We do not collect payment card information because we currently accept Cash on Delivery only.",
        ],
      },
      {
        heading: "How we use it",
        body: [
          "Your information is used only to process, confirm and deliver your orders, and to provide customer support. We may send occasional updates about your order by phone or message.",
          "If you subscribe to our newsletter, we use your email to share new arrivals and offers. You can ask us to stop at any time.",
        ],
      },
      {
        heading: "What we never do",
        body: [
          "We never sell, rent or trade your personal information to third parties. Your details are shared only with our delivery partners, strictly for delivering your order.",
          "Wishlist items and bag contents are stored locally on your own device, not on our servers.",
        ],
      },
      {
        heading: "Questions",
        body: [
          "If you have any questions about your privacy or want your data removed, contact us at hello@jobascloset.com or through our Facebook page.",
        ],
      },
    ],
  },
  terms: {
    title: "Terms & Conditions",
    intro:
      "Welcome to Joba's Closet. By using this website and placing an order, you agree to the simple terms below — written in plain language.",
    sections: [
      {
        heading: "Our products",
        body: [
          "We sell women's beauty products, accessories and fashion items. All jewelry on Joba's Closet is artificial, imitation or fashion jewelry — including items described as gold-tone or silver-tone. These are not made of real gold, real silver or other precious metals and stones, and are priced accordingly.",
          "Product colors may look slightly different depending on your screen and lighting. We describe every item honestly and show real product photos whenever possible.",
        ],
      },
      {
        heading: "Orders & pricing",
        body: [
          "All prices are shown in Bangladeshi Taka (৳) and may change without prior notice. Placing an order is an offer to buy; it becomes final after we confirm it by phone. In the rare case an item is unavailable, we'll inform you and refund or adjust your order.",
          "We may cancel an order if we cannot reach you by phone after reasonable attempts, or if the delivery information appears incorrect.",
        ],
      },
      {
        heading: "Delivery",
        body: [
          "Delivery typically takes 1–2 working days inside Dhaka and 2–4 working days outside Dhaka. Delivery charges are shown at checkout. Delivery times are estimates, not guarantees.",
        ],
      },
      {
        heading: "Acceptable use",
        body: [
          "Please use this website fairly and lawfully. Do not attempt to disrupt the site, place fraudulent orders, or misuse another person's information.",
        ],
      },
    ],
  },
  returns: {
    title: "Return Policy",
    intro:
      "We want you to love what you receive. If something isn't right, here is exactly how returns work — no confusing fine print.",
    sections: [
      {
        heading: "7-day return window",
        body: [
          "You may return any unused item in its original condition and packaging within 7 days of receiving your order. Just contact us with your Order ID and a photo of the item so we can help quickly.",
        ],
      },
      {
        heading: "When we cover the cost",
        body: [
          "If the item arrived damaged, defective or is not what you ordered, we will replace it or refund you fully — including any delivery charge you paid. We may ask for a photo of the issue before arranging the return.",
        ],
      },
      {
        heading: "For change-of-mind returns",
        body: [
          "If you simply changed your mind, you can still return the item within 7 days as long as it is unused and in original packaging. In this case the return delivery cost is borne by you, and we refund the product price.",
        ],
      },
      {
        heading: "What can't be returned",
        body: [
          "For hygiene reasons, used cosmetics, opened skincare, used press-on nails and ear piercing items cannot be returned. Items damaged by the customer after delivery are also not eligible.",
        ],
      },
      {
        heading: "Refund method",
        body: [
          "Cash on Delivery orders are refunded through bKash/Nagad or bank transfer within 3–5 working days after the returned item reaches us and passes a quick check.",
        ],
      },
    ],
  },
  delivery: {
    title: "Delivery Information",
    intro:
      "Here's everything you need to know about how your little box of joy reaches you.",
    sections: [
      {
        heading: "Delivery zones & charges",
        body: [
          "Inside Dhaka: ৳60 — usually delivered within 1–2 working days after phone confirmation.",
          "Outside Dhaka: ৳120 — usually delivered within 2–4 working days via courier. Orders over ৳1,500 ship free, anywhere in Bangladesh.",
        ],
      },
      {
        heading: "Order confirmation",
        body: [
          "After you place an order, our team calls you on the phone number you provided to confirm the details. Orders are dispatched only after confirmation, so please keep your phone available. If we cannot reach you within 48 hours, the order may be cancelled.",
        ],
      },
      {
        heading: "Cash on Delivery",
        body: [
          "We currently accept Cash on Delivery — you pay only when the order is in your hands. Please keep the exact amount ready if possible; our delivery partner may carry limited change.",
        ],
      },
      {
        heading: "Tracking & support",
        body: [
          "You can check your order status anytime from the Account page using your Order ID. For anything urgent, message us on Facebook with your Order ID and we'll help right away.",
        ],
      },
    ],
  },
};

export function PolicyView({ doc }: { doc: string }) {
  const data = DOCS[doc];

  if (!data) {
    return (
      <div className="mx-auto grid max-w-xl place-items-center px-4 py-28 text-center">
        <h1 className="font-serif text-4xl text-charcoal">Page not found</h1>
        <Button asChild className="mt-6 rounded-full bg-blush-600 px-8 hover:bg-blush-700">
          <Link to="/">Back Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-8 sm:px-6 md:pt-12">
      <nav aria-label="Breadcrumb" className="mb-4 text-xs font-medium text-stone-gray">
        <Link to="/" className="transition hover:text-blush-600">Home</Link>
        <span className="mx-1.5">/</span>
        <span className="text-blush-700">{data.title}</span>
      </nav>
      <header className="text-center">
        <h1 className="font-serif text-4xl text-charcoal md:text-5xl">{data.title}</h1>
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">{data.intro}</p>
      </header>
      <div className="mt-10 space-y-4">
        {data.sections.map((s, i) => (
          <Reveal key={s.heading} delay={i * 0.04}>
            <section className="rounded-3xl border border-blush-100 bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-serif text-xl font-semibold text-charcoal">
                {i + 1}. {s.heading}
              </h2>
              <div className="mt-3 space-y-3">
                {s.body.map((p, j) => (
                  <p key={j} className="text-[15px] leading-relaxed text-charcoal-soft">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          </Reveal>
        ))}
      </div>
      <p className="mt-8 text-center text-xs text-stone-gray">
        Last updated: September 2026 · Questions?{" "}
        <Link to="/contact" className="font-semibold text-blush-600 underline-offset-4 hover:underline">
          Contact us
        </Link>
      </p>
    </div>
  );
}
