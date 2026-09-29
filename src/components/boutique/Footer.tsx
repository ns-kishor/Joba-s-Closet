"use client";

import { Facebook, Instagram, Music2, MapPin, Phone, Mail } from "lucide-react";
import { Link } from "@/lib/router";
import { CATEGORIES } from "@/lib/products";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-blush-100 bg-cream">
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 lg:pb-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* brand */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-full bg-blush-600 font-serif text-xl italic text-white" aria-hidden>
                J
              </span>
              <span className="font-serif text-xl font-semibold text-charcoal">Joba&rsquo;s Closet</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              A beautiful little digital boutique where women can discover affordable things they love —
              beauty, jewelry, nails and everyday favorites, starting from ৳100.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Instagram, label: "Instagram" },
                { icon: Music2, label: "TikTok" },
              ].map((s) => (
                <a
                  key={s.label}
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`Joba's Closet on ${s.label}`}
                  className="grid size-9 place-items-center rounded-full border border-blush-200 bg-white text-blush-600 transition hover:-translate-y-0.5 hover:bg-blush-600 hover:text-white"
                >
                  <s.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* shop */}
          <nav className="lg:col-span-2" aria-label="Footer — shop">
            <h3 className="eyebrow text-rosegold">Shop</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link to="/shop" className="text-charcoal-soft transition hover:text-blush-600">All Products</Link></li>
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <Link to={`/shop?category=${c.id}`} className="text-charcoal-soft transition hover:text-blush-600">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* customer care */}
          <nav className="lg:col-span-3" aria-label="Footer — customer care">
            <h3 className="eyebrow text-rosegold">Customer Care</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link to="/contact" className="text-charcoal-soft transition hover:text-blush-600">Contact Us</Link></li>
              <li><Link to="/policies/delivery" className="text-charcoal-soft transition hover:text-blush-600">Delivery Information</Link></li>
              <li><Link to="/policies/returns" className="text-charcoal-soft transition hover:text-blush-600">Return Policy</Link></li>
              <li><Link to="/policies/privacy" className="text-charcoal-soft transition hover:text-blush-600">Privacy Policy</Link></li>
              <li><Link to="/policies/terms" className="text-charcoal-soft transition hover:text-blush-600">Terms &amp; Conditions</Link></li>
            </ul>
          </nav>

          {/* contact */}
          <div className="lg:col-span-3">
            <h3 className="eyebrow text-rosegold">Get In Touch</h3>
            <ul className="mt-4 space-y-3 text-sm text-charcoal-soft">
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 size-4 shrink-0 text-rosegold" />
                <span>+880 1XXX-XXXXXX (10am – 8pm)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 size-4 shrink-0 text-rosegold" />
                <span>hello@jobascloset.com</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-rosegold" />
                <span>Dhaka, Bangladesh — online only, shipping nationwide</span>
              </li>
            </ul>
            <p className="mt-5 inline-flex rounded-full bg-blush-100 px-4 py-1.5 text-xs font-semibold text-blush-700">
              Cash on Delivery available
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-blush-200/60 pt-6 text-xs text-stone-gray sm:flex-row">
          <p>© 2026 Joba&rsquo;s Closet. All rights reserved.</p>
          <p>
            All jewelry is artificial / fashion jewelry (gold-tone &amp; silver-tone alloy) unless stated otherwise.
          </p>
        </div>
      </div>
    </footer>
  );
}
