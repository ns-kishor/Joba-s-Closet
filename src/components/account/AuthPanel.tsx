"use client";

/**
 * Sign in / Create account card with a brand side panel.
 * Used on the Account page for guests — accounts remain optional.
 */
import { useState, type FormEvent } from "react";
import Image from "next/image";
import { Eye, EyeOff, Loader2, LogIn, Sparkles, UserPlus } from "lucide-react";
import { useRouter } from "@/lib/router";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const inputCls = "h-12 rounded-2xl border-blush-200 bg-white focus-visible:ring-blush-300";

export function AuthPanel({ initialTab = "signin" }: { initialTab?: "signin" | "register" }) {
  const { login, register } = useAuth();
  const { query, navigate } = useRouter();
  const [busy, setBusy] = useState<"signin" | "register" | null>(null);
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const goAfterAuth = () => {
    const next = query.next && query.next.startsWith("/") ? query.next : "/account";
    navigate(next);
  };

  const onSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const errs: Record<string, string> = {};
    if (!email) errs.email = "Please enter your email";
    if (!password) errs.password = "Please enter your password";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setBusy("signin");
    const res = await login(email, password);
    setBusy(null);
    if (!res.ok) {
      setErrors({ form: res.error ?? "Could not sign you in" });
      return;
    }
    toast(`Welcome back to Joba's Closet!`);
    goAfterAuth();
  };

  const onRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const phone = String(form.get("phone") ?? "").replace(/[\s-]/g, "");
    const password = String(form.get("password") ?? "");
    const errs: Record<string, string> = {};
    if (name.length < 3) errs.name = "Please enter your full name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errs.email = "Please enter a valid email address";
    if (phone && !/^01[3-9]\d{8}$/.test(phone))
      errs.phone = "Enter a valid BD mobile number (e.g. 01712345678)";
    if (password.length < 6) errs.password = "Password must be at least 6 characters";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setBusy("register");
    const res = await register(name, email, phone, password);
    setBusy(null);
    if (!res.ok) {
      setErrors({ form: res.error ?? "Could not create your account" });
      return;
    }
    toast.success(`Welcome to Joba's Closet, ${name.split(" ")[0]}!`);
    goAfterAuth();
  };

  const errText = (k: string) =>
    errors[k] ? <p className="text-xs font-medium text-destructive">{errors[k]}</p> : null;

  return (
    <section className="grid overflow-hidden rounded-3xl border border-blush-100 bg-white shadow-soft md:grid-cols-[1fr_340px]">
      {/* forms */}
      <div className="p-6 sm:p-9">
        <Tabs defaultValue={initialTab}>
          <TabsList className="grid h-12 w-full grid-cols-2 rounded-full bg-blush-50 p-1">
            <TabsTrigger
              value="signin"
              className="rounded-full text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-blush-700 data-[state=active]:shadow-sm"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="rounded-full text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-blush-700 data-[state=active]:shadow-sm"
            >
              Create Account
            </TabsTrigger>
          </TabsList>

          {/* ── sign in ── */}
          <TabsContent value="signin">
            <h2 className="mt-6 font-serif text-3xl text-charcoal">Welcome back</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Sign in to see your orders, saved favorites and a faster checkout.
            </p>
            <form onSubmit={onSignIn} className="mt-6 space-y-4" noValidate>
              <div className="space-y-1.5">
                <Label htmlFor="si-email" className="text-charcoal-soft">Email Address</Label>
                <Input
                  id="si-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={inputCls}
                />
                {errText("email")}
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="si-password" className="text-charcoal-soft">Password</Label>
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="flex items-center gap-1 text-xs font-semibold text-blush-600 hover:text-blush-700"
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                    {showPw ? "Hide" : "Show"}
                  </button>
                </div>
                <Input
                  id="si-password"
                  name="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Your password"
                  className={inputCls}
                />
                {errText("password")}
              </div>

              {errors.form && (
                <p className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                  {errors.form}
                </p>
              )}

              <Button
                type="submit"
                disabled={busy !== null}
                className="h-12 w-full rounded-full bg-blush-600 font-semibold hover:bg-blush-700"
              >
                {busy === "signin" ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <LogIn className="mr-2 size-4" />
                )}
                Sign In
              </Button>
            </form>
          </TabsContent>

          {/* ── register ── */}
          <TabsContent value="register">
            <h2 className="mt-6 font-serif text-3xl text-charcoal">Join the Closet</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Create an account to keep your order history in one place — checkout stays one tap away.
            </p>
            <form onSubmit={onRegister} className="mt-6 space-y-4" noValidate>
              <div className="space-y-1.5">
                <Label htmlFor="rg-name" className="text-charcoal-soft">Full Name</Label>
                <Input id="rg-name" name="name" autoComplete="name" placeholder="e.g. Nusrat Jahan" className={inputCls} />
                {errText("name")}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rg-email" className="text-charcoal-soft">Email Address</Label>
                <Input
                  id="rg-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={inputCls}
                />
                {errText("email")}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rg-phone" className="text-charcoal-soft">
                  Phone <span className="text-stone-gray">(optional)</span>
                </Label>
                <Input
                  id="rg-phone"
                  name="phone"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="01XXXXXXXXX"
                  className={inputCls}
                />
                {errText("phone")}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rg-password" className="text-charcoal-soft">Password</Label>
                <Input
                  id="rg-password"
                  name="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="At least 6 characters"
                  className={inputCls}
                />
                {errText("password")}
              </div>

              {errors.form && (
                <p className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                  {errors.form}
                </p>
              )}

              <Button
                type="submit"
                disabled={busy !== null}
                className="h-12 w-full rounded-full bg-blush-600 font-semibold hover:bg-blush-700"
              >
                {busy === "register" ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <UserPlus className="mr-2 size-4" />
                )}
                Create My Account
              </Button>
              <p className="text-center text-xs leading-relaxed text-stone-gray">
                By creating an account you agree to our Terms &amp; Privacy Policy.
              </p>
            </form>
          </TabsContent>
        </Tabs>
      </div>

      {/* brand side panel */}
      <aside className="relative hidden overflow-hidden bg-charcoal md:block">
        <Image
          src="/images/brand/promo-jewelry.jpg"
          alt=""
          fill
          sizes="340px"
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-7 text-white">
          <Sparkles className="size-5 text-rosegold" />
          <p className="mt-3 font-serif text-2xl leading-snug">
            Everything you love,
            <br />
            saved in one place.
          </p>
          <p className="mt-2 text-xs leading-relaxed text-white/80">
            Order history · Faster checkout · Wishlists
          </p>
        </div>
      </aside>
    </section>
  );
}
