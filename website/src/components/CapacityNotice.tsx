import { capacityLabel, capacityNote, type Capacity } from "@/config/firm";
import { cx } from "@/components/ui";

/**
 * Every page that describes work states the capacity it is delivered in.
 * See VISION.md §3 — this is a regulatory requirement of the structure, not a
 * design flourish.
 */
export function CapacityBadge({ capacity, className }: { capacity: Capacity; className?: string }) {
  return (
    <span
      className={cx(
        "inline-flex items-center border px-3 py-1.5 font-sans text-[0.6875rem] font-medium uppercase tracking-[0.12em]",
        capacity === "solicitor"
          ? "border-crimson-600/40 bg-crimson-50 text-crimson-700"
          : capacity === "coordinated"
            ? "border-stone-300 bg-stone-100 text-stone-600"
            : "border-stone-300 bg-parchment text-stone-600",
        className,
      )}
    >
      {capacityLabel[capacity]}
    </span>
  );
}

export function CapacityNotice({ capacity, className }: { capacity: Capacity; className?: string }) {
  return (
    <div className={cx("border-l-2 border-stone-300 pl-5", className)}>
      <p className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-stone-500">Delivered by</p>
      <p className="mt-2 font-display text-lg leading-snug text-ink">{capacityLabel[capacity]}</p>
      <p className="mt-2 text-[0.875rem] leading-relaxed text-stone-600">{capacityNote[capacity]}</p>
    </div>
  );
}
