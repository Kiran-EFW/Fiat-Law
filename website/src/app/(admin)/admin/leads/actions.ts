"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { leadStore, type LeadStatus } from "@/lib/leads/store";

const STATUSES: LeadStatus[] = ["new", "contacted", "proposal_sent", "instructed", "declined"];

export async function setLeadStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as LeadStatus;
  if (!id || !STATUSES.includes(status)) return;
  await leadStore.setStatus(id, status);
  // "layout", not "page": it clears the client router cache for the list *and*
  // every /admin/leads/[id] beneath it. Revalidating the two paths separately
  // left the other one serving a stale segment on the next soft navigation.
  revalidatePath("/admin/leads", "layout");
}

export async function deleteLead(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await leadStore.remove(id);
  revalidatePath("/admin/leads", "layout");
  // Redirect to a URL carrying the erased reference rather than the bare list.
  // Two reasons: the client router cache has no entry for it, so the list is
  // guaranteed to render without the deleted row; and an erasure ought to be
  // acknowledged by reference, since the record proving it happened is gone.
  redirect(`/admin/leads?erased=${encodeURIComponent(id)}`);
}
