"use client";

/**
 * Account hub.
 * Guest  → Sign in / Create account card + Order-ID tracking (accounts optional).
 * Member → dashboard: order history, profile, password, shortcuts.
 */
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  KeyRound,
  Loader2,
  LogOut,
  PackageSearch,
  ShoppingBag,
  UserRound,
  UserRoundPen,
} from "lucide-react";
import { Link, useRouter } from "@/lib/router";
import { formatBDT } from "@/lib/utils";
import { useShop, useHasMounted } from "@/lib/store";
import { useAuth, initials } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { AuthPanel } from "@/components/account/AuthPanel";
import { OrderHistory } from "@/components/account/OrderHistory";
import { ProfileDialog, PasswordDialog } from "@/components/account/AccountDialogs";
import { toast } from "sonner";

type TrackedOrder = {
  id: string;
  customerName: string;
  city: string;
  zone: "inside" | "outside";
  status: string;
  total: number;
  createdAt: string;
  items: { name: string; qty: number; price: number }[];
};

/* ── guest order tracking (kept for guests & members alike) ── */
function TrackOrderSection() {
  const [orderInput, setOrderInput] = useState("");
  const [tracking, setTracking] = useState(false);
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [notFound, setNotFound] = useState(false);

  const track = async () => {
    const id = orderInput.trim();
    if (!id) return;
    setTracking(true);
    setOrder(null);
    setNotFound(false);
    try {
      const res = await fetch(`/api/orders?id=${encodeURIComponent(id)}`);
      const data = await res.json();
      if (data.success && data.order) setOrder(data.order);
      else setNotFound(true);
    } catch {
      setNotFound(true);
    } finally {
      setTracking(false);
    }
  };

  return (
    <section className="rounded-3xl border border-blush-100 bg-white p-6 shadow-soft sm:p-8">
      <h2 className="flex items-center gap-2 font-serif text-2xl font-semibold text-charcoal">
        <PackageSearch className="size-5 text-rosegold" /> Track Your Order
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Enter the Order ID from your confirmation page (e.g.{" "}
        <span className="font-mono font-semibold">JC-XXXXXX</span>). No account needed.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Input
          value={orderInput}
          onChange={(e) => setOrderInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && track()}
          placeholder="JC-XXXXXX"
          className="h-12 flex-1 rounded-full border-blush-200 font-mono uppercase focus-visible:ring-blush-300"
          aria-label="Order ID"
        />
        <Button
          onClick={track}
          disabled={tracking || !orderInput.trim()}
          className="h-12 rounded-full bg-blush-600 px-8 font-semibold hover:bg-blush-700"
        >
          {tracking ? <Loader2 className="size-4 animate-spin" /> : "Track"}
        </Button>
      </div>

      {notFound && (
        <p className="mt-4 rounded-2xl bg-blush-50 px-4 py-3 text-sm text-blush-700">
          We couldn&rsquo;t find that Order ID. Double-check it, or contact us on Facebook — we&rsquo;ll
          find it for you.
        </p>
      )}

      {order && (
        <div className="mt-5 rounded-2xl border border-blush-100 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-mono text-lg font-bold text-charcoal">{order.id}</p>
            <span className="rounded-full bg-blush-100 px-3 py-1 text-xs font-bold text-blush-700">
              {order.status}
            </span>
          </div>
          <p className="mt-1 text-xs text-stone-gray">
            Placed{" "}
            {new Date(order.createdAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}{" "}
            · {order.city}
          </p>
          <ul className="mt-4 space-y-1.5 text-sm text-charcoal-soft">
            {order.items.map((it, i) => (
              <li key={i} className="flex justify-between gap-3">
                <span>
                  {it.name} <span className="text-stone-gray">× {it.qty}</span>
                </span>
                <span className="font-semibold text-charcoal">{formatBDT(it.price * it.qty)}</span>
              </li>
            ))}
          </ul>
          <Separator className="my-3 bg-blush-100" />
          <div className="flex justify-between text-sm">
            <span className="font-semibold text-charcoal">Total (COD)</span>
            <span className="font-bold text-charcoal">{formatBDT(order.total)}</span>
          </div>
        </div>
      )}
    </section>
  );
}

/* ── member dashboard ── */
function Dashboard() {
  const { user, logout } = useAuth();
  const wishlist = useShop((s) => s.wishlist);
  const mounted = useHasMounted();
  const { navigate } = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [historyKey, setHistoryKey] = useState(0);

  if (!user) return null;
  const firstName = user.name.split(" ")[0];

  const signOut = async () => {
    await logout();
    toast("You have been signed out. See you soon!");
    navigate("/account");
  };

  return (
    <>
      {/* greeting */}
      <header className="flex flex-col items-center gap-4 rounded-3xl border border-blush-100 bg-gradient-to-b from-blush-50 to-white p-7 text-center shadow-soft sm:p-9">
        <motion.span
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="grid size-16 place-items-center rounded-full bg-blush-600 font-serif text-xl font-semibold text-white shadow-lift"
          aria-hidden
        >
          {initials(user.name)}
        </motion.span>
        <div>
          <h1 className="font-serif text-4xl text-charcoal md:text-5xl">Hello, {firstName}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {user.email}
            {user.phone ? ` · ${user.phone}` : ""} · member since{" "}
            {new Date(user.createdAt).toLocaleDateString("en-GB", { dateStyle: "long" })}
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2.5">
          <Button
            onClick={() => setProfileOpen(true)}
            variant="outline"
            className="rounded-full border-blush-300 font-semibold text-blush-700 hover:bg-blush-50"
          >
            <UserRoundPen className="mr-2 size-4" /> Edit Profile
          </Button>
          <Button
            onClick={() => setPasswordOpen(true)}
            variant="outline"
            className="rounded-full border-blush-300 font-semibold text-blush-700 hover:bg-blush-50"
          >
            <KeyRound className="mr-2 size-4" /> Change Password
          </Button>
          <Button
            onClick={signOut}
            variant="ghost"
            className="rounded-full font-semibold text-stone-gray hover:bg-blush-50 hover:text-blush-700"
          >
            <LogOut className="mr-2 size-4" /> Sign Out
          </Button>
        </div>
      </header>

      {/* order history */}
      <div className="mt-6">
        <OrderHistory refreshKey={historyKey} />
      </div>

      {/* shortcuts */}
      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link
          to="/wishlist"
          className="group rounded-3xl border border-blush-100 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
        >
          <Heart className="size-6 text-rosegold" />
          <h3 className="mt-3 font-serif text-xl font-semibold text-charcoal">Wishlist</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {mounted ? `${wishlist.length} item${wishlist.length === 1 ? "" : "s"} saved on this device` : "Your saved favorites"}
          </p>
          <p className="mt-3 text-sm font-semibold text-blush-600 group-hover:underline">Open wishlist →</p>
        </Link>
        <Link
          to="/cart"
          className="group rounded-3xl border border-blush-100 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
        >
          <ShoppingBag className="size-6 text-rosegold" />
          <h3 className="mt-3 font-serif text-xl font-semibold text-charcoal">Your Bag</h3>
          <p className="mt-1 text-sm text-muted-foreground">Review your bag and proceed to checkout anytime.</p>
          <p className="mt-3 text-sm font-semibold text-blush-600 group-hover:underline">Open bag →</p>
        </Link>
      </section>

      {/* guest tracking stays available for members too (e.g. gift orders) */}
      <div className="mt-6">
        <TrackOrderSection />
      </div>

      <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
      <PasswordDialog open={passwordOpen} onOpenChange={setPasswordOpen} />
    </>
  );
}

/* ── page ── */
export function AccountView() {
  const { user, loading } = useAuth();
  const { query } = useRouter();

  return (
    <div className="mx-auto max-w-4xl px-4 pb-16 pt-8 sm:px-6 md:pt-12">
      {loading ? (
        /* first paint: resolve session before deciding which experience to show */
        <div className="grid place-items-center py-24">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="size-8 animate-spin text-blush-500" />
            <p className="text-sm text-muted-foreground">Opening your account...</p>
          </div>
        </div>
      ) : user ? (
        <Dashboard />
      ) : (
        <>
          <header className="mb-8 text-center">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-blush-100 text-blush-600">
              <UserRound className="size-7" />
            </span>
            <h1 className="mt-5 font-serif text-4xl text-charcoal md:text-5xl">Account</h1>
            <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              At Joba&rsquo;s Closet, accounts are optional — you can always check out as a guest. Sign in
              to keep your order history and favorites together, or track an order below.
            </p>
          </header>
          <AuthPanel initialTab={query.tab === "register" ? "register" : "signin"} />
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Just want to check an order?{" "}
            <span className="font-semibold text-charcoal">Use guest tracking below</span> — no sign-in
            needed.
          </p>
          <div className="mt-6">
            <TrackOrderSection />
          </div>
        </>
      )}
    </div>
  );
}
