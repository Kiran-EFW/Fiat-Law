import { z } from "zod";

export const segmentEnum = z.enum([
  "bridgehead",
  "establisher",
  "exporter",
  "acquirer",
  "operator",
  "principal",
  "partner",
]);

export const briefAnswersSchema = z.object({
  segment: segmentEnum,
  entityStatus: z.enum(["none", "branch", "subsidiary", "dormant", "non_compliant"]).optional(),
  peoplePosition: z.enum(["none", "need_to_move", "already_here", "hiring_locally"]).optional(),
  sector: z
    .enum([
      "technology",
      "pharma",
      "engineering",
      "textiles",
      "chemicals",
      "gems",
      "food",
      "professional",
      "financial",
      "energy",
      "logistics",
      "other",
    ])
    .optional(),
  scale: z.enum(["micro", "small", "mid", "large", "enterprise"]).optional(),
  urgency: z.enum(["exploring", "this_quarter", "thirty_days", "overdue"]).optional(),
  detail: z.string().max(80).optional(),
  originCity: z.string().max(120).optional(),
  contact: z.object({
    name: z.string().min(1, "Please give us a name").max(160),
    role: z.string().max(160).optional().default(""),
    company: z.string().max(200).optional().default(""),
    email: z.email("That does not look like a valid email address").max(254),
    phone: z.string().max(60).optional(),
    channel: z.enum(["email", "phone", "whatsapp"]).optional(),
    notes: z.string().max(4000).optional(),
  }),
  consent: z.literal(true, { error: "We need your agreement to the privacy notice to respond." }),
  marketingConsent: z.boolean().optional().default(false),
});

export const leadSubmissionSchema = z.object({
  answers: briefAnswersSchema,
  source: z
    .object({
      referrer: z.string().max(500).optional(),
      landingPath: z.string().max(300).optional(),
      utmSource: z.string().max(120).optional(),
      utmMedium: z.string().max(120).optional(),
      utmCampaign: z.string().max(160).optional(),
    })
    .optional(),
  timing: z
    .object({
      startedAt: z.number().int().nonnegative().optional(),
      durationMs: z.number().int().nonnegative().max(86_400_000).optional(),
    })
    .optional(),
  /**
   * Honeypot. Deliberately permissive: rejecting a filled value here would
   * return a 422 naming the field, which tells a bot exactly what to stop
   * filling in. The routes accept it, discard it, and answer 200 instead.
   */
  website: z.string().max(500).optional(),
});

export type LeadSubmission = z.infer<typeof leadSubmissionSchema>;

/** Plain contact form, used on /contact and /partners. */
export const enquirySchema = z.object({
  name: z.string().min(1).max(160),
  email: z.email().max(254),
  company: z.string().max(200).optional().default(""),
  phone: z.string().max(60).optional(),
  subject: z.string().max(200).optional().default(""),
  message: z.string().min(10, "Please tell us a little more").max(4000),
  consent: z.literal(true, { error: "We need your agreement to the privacy notice to respond." }),
  /** Honeypot — see the note on leadSubmissionSchema.website. */
  website: z.string().max(500).optional(),
});

export type Enquiry = z.infer<typeof enquirySchema>;
