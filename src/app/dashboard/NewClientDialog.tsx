// components/dashboard/NewClientDialog.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClientRecord } from "@/app/dashboard/actions";
import { Plus } from "lucide-react";

export function NewClientDialog() {
  const [open, setOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    await createClientRecord(formData);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="bg-signal-amber text-deep-space hover:bg-signal-amber/90 gap-1.5">
        <Plus className="size-4" />
        New client
      </DialogTrigger>

      <DialogContent className="bg-[#10142A] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Add a new client</DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-white/70 mb-1.5 block">Client name</label>
            <Input name="name" placeholder="e.g. Jane Cooper" required />
          </div>

          <div>
            <label className="text-sm text-white/70 mb-1.5 block">Email</label>
            <Input name="email" type="email" placeholder="jane@company.com" required />
          </div>

          <div>
            <label className="text-sm text-white/70 mb-1.5 block">
              Company <span className="text-white/40">(optional)</span>
            </label>
            <Input name="company_name" placeholder="e.g. TrustNet Co." />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="w-full bg-signal-amber text-deep-space hover:bg-signal-amber/90"
            >
              Add client
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}