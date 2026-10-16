import type { SegmentId } from "@/lib/segments";
import type { Capacity } from "@/config/firm";

export type Urgency = "exploring" | "this_quarter" | "thirty_days" | "overdue";
export type EntityStatus = "none" | "branch" | "subsidiary" | "dormant" | "non_compliant";
export type PeoplePosition = "none" | "need_to_move" | "already_here" | "hiring_locally";
export type Scale = "micro" | "small" | "mid" | "large" | "enterprise";

export type SectorId =
  | "technology"
  | "pharma"
  | "engineering"
  | "textiles"
  | "chemicals"
  | "gems"
  | "food"
  | "professional"
  | "financial"
  | "energy"
  | "logistics"
  | "other";

/** Answers collected by the brief. Everything optional until submitted. */
export interface BriefAnswers {
  segment?: SegmentId;
  entityStatus?: EntityStatus;
  peoplePosition?: PeoplePosition;
  sector?: SectorId;
  scale?: Scale;
  urgency?: Urgency;
  /** Segment-specific follow-up, keyed by question id. */
  detail?: string;
  /** City in India, free text, optional. */
  originCity?: string;
  contact?: {
    name: string;
    role: string;
    company: string;
    email: string;
    phone?: string;
    channel?: "email" | "phone" | "whatsapp";
    notes?: string;
  };
  consent?: boolean;
  marketingConsent?: boolean;
}

export interface SequenceStep {
  title: string;
  detail: string;
  /** Realistic elapsed time, expressed honestly. */
  elapsed: string;
  capacity: Capacity;
  /** Marks the item that actually gates everything else. */
  criticalPath?: boolean;
}

export interface Obstacle {
  title: string;
  body: string;
  /** The primary source. Named so it can be checked. */
  source: string;
}

export interface ScopeLine {
  service: string;
  slug: string;
  items: string[];
  capacity: Capacity;
  /** Hidden when the corresponding firm.capabilities flag is false. */
  gated?: boolean;
}

export interface Recommendation {
  /** One sentence naming the situation back to them. */
  headline: string;
  /** Bulleted restatement of what they told us. */
  position: string[];
  route: {
    name: string;
    why: string;
    alternatives?: string;
  };
  sequence: SequenceStep[];
  obstacles: Obstacle[];
  scope: ScopeLine[];
  needFromYou: string[];
  /** Where we would tell them not to instruct us. Credibility comes from this. */
  candour?: string;
}
