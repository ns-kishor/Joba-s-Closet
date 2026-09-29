"use client";

/** Profile edit + password change dialogs for the account dashboard. */
import { useState, type FormEvent } from "react";
import { Loader2, Lock, Save } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const inputCls = "h-11 rounded-2xl border-blush-200 bg-white focus-visible:ring-blush-300";

export function ProfileDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { user, updateProfile } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const phone = String(form.get("phone") ?? "").replace(/[\s-]/g, "");
    if (name.length < 3) {
      setError("Please enter your full name");
      return;
    }
    if (phone && !/^01[3-9]\d{8}$/.test(phone)) {
      setError("Enter a valid BD mobile number (e.g. 01712345678)");
      return;
    }
    setBusy(true);
    setError("");
    const res = await updateProfile(name, phone);
    setBusy(false);
    if (!res.ok) {
      setError(res.error ?? "Could not update your profile");
      return;
    }
    toast.success("Profile updated");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl border-blush-100 p-6 sm:p-7">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-charcoal">Edit Profile</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Update the details we use for delivery confirmations.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="mt-2 space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="pf-name" className="text-charcoal-soft">Full Name</Label>
            <Input
              id="pf-name"
              name="name"
              defaultValue={user?.name ?? ""}
              autoComplete="name"
              className={inputCls}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pf-phone" className="text-charcoal-soft">
              Phone <span className="text-stone-gray">(optional)</span>
            </Label>
            <Input
              id="pf-phone"
              name="phone"
              inputMode="tel"
              defaultValue={user?.phone ?? ""}
              autoComplete="tel"
              placeholder="01XXXXXXXXX"
              className={inputCls}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-charcoal-soft">Email</Label>
            <Input value={user?.email ?? ""} disabled className={`${inputCls} bg-blush-50/60 text-stone-gray`} />
            <p className="text-[11px] text-stone-gray">Your email is your sign-in ID and can&rsquo;t be changed.</p>
          </div>

          {error && (
            <p className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={busy}
            className="h-11 w-full rounded-full bg-blush-600 font-semibold hover:bg-blush-700"
          >
            {busy ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function PasswordDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { changePassword } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const currentPassword = String(form.get("current") ?? "");
    const newPassword = String(form.get("next") ?? "");
    const confirm = String(form.get("confirm") ?? "");
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirm) {
      setError("The two new passwords don&rsquo;t match");
      return;
    }
    setBusy(true);
    setError("");
    const res = await changePassword(currentPassword, newPassword);
    setBusy(false);
    if (!res.ok) {
      setError(res.error ?? "Could not change your password");
      return;
    }
    toast.success("Password changed — other devices have been signed out");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl border-blush-100 p-6 sm:p-7">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-charcoal">Change Password</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            For your safety, other devices will be signed out after the change.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="mt-2 space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="pw-current" className="text-charcoal-soft">Current Password</Label>
            <Input id="pw-current" name="current" type="password" autoComplete="current-password" className={inputCls} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pw-new" className="text-charcoal-soft">New Password</Label>
            <Input id="pw-new" name="next" type="password" autoComplete="new-password" className={inputCls} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pw-confirm" className="text-charcoal-soft">Confirm New Password</Label>
            <Input id="pw-confirm" name="confirm" type="password" autoComplete="new-password" className={inputCls} />
          </div>

          {error && (
            <p className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={busy}
            className="h-11 w-full rounded-full bg-blush-600 font-semibold hover:bg-blush-700"
          >
            {busy ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Lock className="mr-2 size-4" />}
            Update Password
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
