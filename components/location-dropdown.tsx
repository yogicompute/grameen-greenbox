"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Plus } from "lucide-react";

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
  addresses: Address[];
  value?: number | null;
  onChange?: (id: number) => void;
  onAddAddress?: () => void;
}

export function LocationDropdown({
  addresses = [],
  value = null,
  onChange,
  onAddAddress,
}: Props) {
  const [menuOpen, setMenuOpen] = React.useState(false);

  const selectedId = value ?? addresses.find((a) => a.is_default)?.id ?? null;
  const [internalValue, setInternalValue] = React.useState<string | null>(
    selectedId != null ? String(selectedId) : null
  );

  React.useEffect(() => {
    setInternalValue(
      value != null
        ? String(value)
        : addresses.find((a) => a.is_default)?.id != null
        ? String(addresses.find((a) => a.is_default)?.id)
        : null
    );
  }, [value, addresses]);

  const handleValueChange = (val: string) => {
    setInternalValue(val);
    const id = Number(val);
    if (!Number.isNaN(id)) onChange?.(id);
  };

  const selectedAddress = React.useMemo(() => {
    if (!internalValue) return null;
    const id = Number(internalValue);
    return addresses.find((a) => a.id === id) ?? null;
  }, [internalValue, addresses]);

  const summary = selectedAddress
    ? `${selectedAddress.label ? selectedAddress.label + " • " : ""}${
        selectedAddress.line1
      }${selectedAddress.city ? `, ${selectedAddress.city}` : ""}`
    : "Select delivery address";

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="cursor-pointer inline-flex items-center gap-2"
          >
            <span className="text-sm">Deliver to: </span>
            <span className="text-sm font-medium truncate max-w-48">
              {summary}
            </span>
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-72">
          <div className="px-3 py-2">
            <DropdownMenuLabel className="flex justify-between items-center">
              <div>Saved Addresses</div>
              <Button
                onClick={() => {
                  // delegate adding an address to parent (Navbar) which controls the AddressModal
                  onAddAddress?.();
                  setMenuOpen(false);
                }}
                className="flex gap-2 justify-center items-center"
              >
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </DropdownMenuLabel>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuRadioGroup
            value={internalValue ?? undefined}
            onValueChange={handleValueChange}
          >
            {addresses.length === 0 ? (
              <div className="p-3 text-sm text-muted-foreground">
                No saved addresses
              </div>
            ) : (
              addresses.map((address) => {
                const idStr = address.id != null ? String(address.id) : "";
                return (
                  <DropdownMenuRadioItem
                    key={idStr || Math.random()}
                    value={idStr}
                  >
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-medium">
                        {address.label ?? `${address.city}, ${address.country}`}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {address.line1}
                        {address.city ? ` • ${address.city}` : ""}
                        {address.postal_code ? ` • ${address.postal_code}` : ""}
                      </span>
                    </div>
                  </DropdownMenuRadioItem>
                );
              })
            )}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* AddressModal is managed by parent (Navbar) via onAddAddress */}
    </>
  );
}
