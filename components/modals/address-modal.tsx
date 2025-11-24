"use client";

import React, { useEffect, useState } from "react";
import { X, Trash } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Address = {
  id?: number;
  user_id?: string;
  label?: string | null;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone_number?: string | null;
  alternate_phone_number?: string | null;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  address?: Address | null; // if provided => edit, else create
  onSaved?: () => void;
  onDeleted?: () => void;
  // called when the user needs to authenticate; parent should open Auth modal
  onRequireAuth?: (draft?: Partial<Address>) => void;
  // optional initial draft to prefill the form when reopening after auth
  initialData?: Partial<Address> | null;
}

export default function AddressModal({
  isOpen,
  onClose,
  address,
  onSaved,
  onDeleted,
  onRequireAuth,
  // optional initial draft data to prefill the form (used when resuming after auth)
  initialData,
}: Props) {
  const [form, setForm] = useState<Address>({
    label: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    phone_number: "",
    alternate_phone_number: "",
    is_default: false,
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    // prefer explicit address (editing saved address), else use initialData draft if provided, else blank
    if (address) {
      setForm({
        id: address.id,
        user_id: address.user_id,
        label: address.label ?? "",
        line1: address.line1 ?? "",
        line2: address.line2 ?? "",
        city: address.city ?? "",
        state: address.state ?? "",
        postal_code: address.postal_code ?? "",
        country: address.country ?? "",
        phone_number: address.phone_number ?? "",
        alternate_phone_number: address.alternate_phone_number ?? "",
        is_default: !!address.is_default,
      });
    } else if (initialData) {
      setForm((s) => ({
        ...s,
        ...initialData,
      }));
    } else {
      setForm({
        label: "",
        line1: "",
        line2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
        phone_number: "",
        alternate_phone_number: "",
        is_default: false,
      });
    }
    setError(null);
  }, [address, isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (k: keyof Address, v: string | boolean | null) => {
    setForm((s) => ({ ...s, [k]: v as any }));
    setError(null);
  };

  const validate = (): string | null => {
    if (!form.line1?.trim()) return "Address line 1 is required";
    if (!form.city?.trim()) return "City is required";
    if (!form.state?.trim()) return "State is required";
    if (!form.postal_code?.trim()) return "Postal code is required";
    if (!form.country?.trim()) return "Country is required";
    return null;
  };

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setSaving(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) {
          // ask parent to open auth modal (and close this modal). Parent should reopen this modal after auth.
          setSaving(false);
          alert("Please sign in to save your address");
          onRequireAuth?.(form);
          return;
      }

      const payload: Partial<Address> = {
        user_id: user.id,
        label: form.label || null,
        line1: form.line1,
        line2: form.line2 || null,
        city: form.city,
        state: form.state,
        postal_code: form.postal_code,
        country: form.country,
        phone_number: form.phone_number || null,
        alternate_phone_number: form.alternate_phone_number || null,
        is_default: !!form.is_default,
      };

      // If setting this as default, unset previous defaults
      if (payload.is_default) {
        const { error: unsetErr } = await supabase
          .from("addresses")
          .update({ is_default: false })
          .eq("user_id", user.id)
          .neq("id", form.id ?? 0);
        if (unsetErr) throw unsetErr;
      }

      if (form.id) {
        const { error } = await supabase
          .from("addresses")
          .update(payload)
          .eq("id", form.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("addresses").insert([payload]);
        if (error) throw error;
      }

      setError(null);
      onSaved?.();
      onClose();
    } catch (err: any) {
      console.error("Address save error:", err);
      setError(err?.message || "Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  const handleAuthSuccess = () => {
    // kept for backward-compat; parent should handle auth flow.
  };

  const handleDelete = async () => {
    if (!form.id) return;
    if (!confirm("Delete this address?")) return;
    setDeleting(true);
    try {
      const { error } = await supabase
        .from("addresses")
        .delete()
        .eq("id", form.id);
      if (error) throw error;
      onDeleted?.();
      onClose();
    } catch (err: any) {
      console.error("Address delete error:", err);
      setError(err?.message || "Failed to delete address");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <Card className="w-full max-w-lg relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-secondary rounded transition-colors"
          >
            <X size={20} />
            <span className="sr-only">Close</span>
          </button>

          <div className="p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold">
                {form.id ? "Edit Address" : "Add Address"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {form.id
                  ? "Update your saved address"
                  : "Save an address for faster checkout"}
              </p>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 gap-3">
              <label className="text-sm">Label (optional)</label>
              <Input
                name="label"
                value={form.label || ""}
                onChange={(e) => handleChange("label", e.target.value)}
                placeholder="Home, Office, etc."
              />

              <label className="text-sm">Address line 1</label>
              <Input
                name="line1"
                value={form.line1}
                onChange={(e) => handleChange("line1", e.target.value)}
                required
              />

              <label className="text-sm">Address line 2 (optional)</label>
              <Textarea
                name="line2"
                value={form.line2 || ""}
                onChange={(e) => handleChange("line2", e.target.value)}
                className="h-20"
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm">City</label>
                  <Input
                    name="city"
                    value={form.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm">State</label>
                  <Input
                    name="state"
                    value={form.state}
                    onChange={(e) => handleChange("state", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm">Postal code</label>
                  <Input
                    name="postal_code"
                    value={form.postal_code}
                    onChange={(e) =>
                      handleChange("postal_code", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <label className="text-sm">Country</label>
                  <Input
                    name="country"
                    value={form.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm">Phone</label>
                  <Input
                    name="phone_number"
                    value={form.phone_number || ""}
                    onChange={(e) =>
                      handleChange("phone_number", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="text-sm">Alternate phone</label>
                  <Input
                    name="alternate_phone_number"
                    value={form.alternate_phone_number || ""}
                    onChange={(e) =>
                      handleChange("alternate_phone_number", e.target.value)
                    }
                  />
                </div>
              </div>

              <label className="inline-flex items-center gap-2 mt-1">
                <input
                  type="checkbox"
                  checked={!!form.is_default}
                  onChange={(e) => handleChange("is_default", e.target.checked)}
                />
                <span className="text-sm">Set as default address</span>
              </label>

              {error && (
                <div className="p-2 text-sm text-destructive bg-destructive/10 rounded">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between gap-3 pt-3">
                <div className="flex gap-2">
                  {form.id && (
                    <Button
                      variant="outline"
                      onClick={handleDelete}
                      disabled={deleting}
                    >
                      {deleting ? (
                        "Deleting..."
                      ) : (
                        <>
                          <Trash className="mr-2" size={14} /> Delete
                        </>
                      )}
                    </Button>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="secondary" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving
                      ? "Saving..."
                      : form.id
                      ? "Update Address"
                      : "Save Address"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </Card>
      </div>
      {/* Auth flow is handled by parent via onRequireAuth */}
    </>
  );
}
