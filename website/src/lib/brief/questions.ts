import { segments } from "@/lib/segments";
import type { BriefAnswers } from "@/lib/brief/types";

export interface Choice {
  value: string;
  label: string;
  hint?: string;
}

export interface Question {
  id: keyof BriefAnswers | "detail";
  /** Short label for the progress rail. */
  short: string;
  prompt: string;
  help?: string;
  choices: Choice[];
  /** Shown only when this returns true. */
  when?: (a: BriefAnswers) => boolean;
  optional?: boolean;
}

export const sectorChoices: Choice[] = [
  { value: "technology", label: "Technology, IT & software services", hint: "The largest single flow in this corridor" },
  { value: "pharma", label: "Pharmaceuticals, life sciences & healthcare" },
  { value: "engineering", label: "Engineering, automotive & manufacturing" },
  { value: "textiles", label: "Textiles, apparel & leather", hint: "Among the largest tariff gains under CETA" },
  { value: "chemicals", label: "Chemicals, plastics & materials" },
  { value: "gems", label: "Gems, jewellery & precious metals" },
  { value: "food", label: "Food, agriculture & marine products" },
  { value: "professional", label: "Professional & business services" },
  { value: "financial", label: "Financial services, fintech & insurance", hint: "May engage FCA authorisation" },
  { value: "energy", label: "Energy, renewables & infrastructure" },
  { value: "logistics", label: "Logistics, shipping & supply chain" },
  { value: "other", label: "Something else" },
];

export const questions: Question[] = [
  {
    id: "segment",
    short: "Position",
    prompt: "Which of these sounds most like you?",
    help: "Pick the closest. The brief adapts to everything you tell us afterwards.",
    choices: segments.map((s) => ({ value: s.id, label: s.selfDescription, hint: s.summary })),
  },
  {
    id: "entityStatus",
    short: "Entity",
    prompt: "What do you have in the UK today?",
    when: (a) => a.segment !== "partner",
    choices: [
      { value: "none", label: "Nothing yet", hint: "No company, no branch, no registered presence" },
      { value: "branch", label: "A UK establishment or branch", hint: "Registered under the Indian parent" },
      { value: "subsidiary", label: "A UK limited company", hint: "Trading normally" },
      { value: "dormant", label: "A UK company that is dormant", hint: "Incorporated but not trading" },
      { value: "non_compliant", label: "A UK company with problems", hint: "Late filings, strike-off action, or a register that is wrong" },
    ],
  },
  {
    id: "peoplePosition",
    short: "People",
    prompt: "What is the position on people?",
    when: (a) => a.segment !== "partner",
    choices: [
      { value: "need_to_move", label: "We need to move people from India to the UK", hint: "Sponsorship or an unsponsored route" },
      { value: "hiring_locally", label: "We will hire locally in the UK", hint: "No visa needed, but employment documents are" },
      { value: "already_here", label: "We already have people in the UK", hint: "Existing visas, existing payroll, or both" },
      { value: "none", label: "Nobody in the UK, and none planned", hint: "Selling in, or holding an entity only" },
    ],
  },
  {
    id: "sector",
    short: "Sector",
    prompt: "What sector are you in?",
    choices: sectorChoices,
  },
  {
    id: "scale",
    short: "Scale",
    prompt: "How large is the business behind this?",
    help: "The Indian parent or your own business, not the UK operation.",
    when: (a) => a.segment !== "principal",
    choices: [
      { value: "micro", label: "Fewer than 10 people" },
      { value: "small", label: "10 to 50 people" },
      { value: "mid", label: "50 to 250 people" },
      { value: "large", label: "250 to 1,000 people" },
      { value: "enterprise", label: "More than 1,000 people" },
    ],
  },
  {
    id: "urgency",
    short: "Timing",
    prompt: "When does this need to be done?",
    help: "An honest answer produces a more useful sequence. There is no wrong one.",
    choices: [
      { value: "exploring", label: "We are exploring", hint: "No fixed date yet" },
      { value: "this_quarter", label: "This quarter", hint: "Within roughly three months" },
      { value: "thirty_days", label: "Within 30 days", hint: "A deadline is already set" },
      { value: "overdue", label: "It is already late", hint: "A date has passed, or something has gone wrong" },
    ],
  },
];

/** Segment-specific follow-up. One question, asked after the core six. */
export const detailQuestion: Record<string, Question> = {
  bridgehead: {
    id: "detail",
    short: "Detail",
    prompt: "What is driving the timing?",
    choices: [
      { value: "first_customer", label: "A first UK customer or contract" },
      { value: "tender", label: "A tender or framework that requires a UK entity" },
      { value: "presence", label: "Credibility: we need a UK address and number" },
      { value: "strategy", label: "A strategic decision, no single trigger" },
    ],
  },
  establisher: {
    id: "detail",
    short: "Detail",
    prompt: "How many people do you expect to have in the UK within two years?",
    help: "This drives whether the Expansion Worker route is a bridge or the wrong tool.",
    choices: [
      { value: "1_2", label: "One or two" },
      { value: "3_10", label: "Three to ten" },
      { value: "11_50", label: "Eleven to fifty" },
      { value: "50_plus", label: "More than fifty" },
    ],
  },
  exporter: {
    id: "detail",
    short: "Detail",
    prompt: "How settled is your origin position?",
    help: "Preference has to be claimed, and the claim has to survive verification.",
    choices: [
      { value: "confident", label: "We know our classification and our origin rule" },
      { value: "partial", label: "We know the classification, not the origin position" },
      { value: "unknown", label: "Neither; we are starting from the beginning" },
      { value: "cbam", label: "We are in aluminium, cement, fertiliser, hydrogen or steel", hint: "UK CBAM applies from 1 January 2027" },
    ],
  },
  acquirer: {
    id: "detail",
    short: "Detail",
    prompt: "Where is the transaction?",
    choices: [
      { value: "mandate", label: "A mandate, no target yet" },
      { value: "identified", label: "A target identified, nothing signed" },
      { value: "heads", label: "Heads of terms agreed" },
      { value: "diligence", label: "In diligence, or exchanged" },
    ],
  },
  operator: {
    id: "detail",
    short: "Detail",
    prompt: "What is the immediate concern?",
    choices: [
      { value: "eccta", label: "Identity verification for directors and PSCs" },
      { value: "filings", label: "Filings, confirmation statements or accounts" },
      { value: "remediation", label: "Something is wrong and needs putting right" },
      { value: "growth", label: "Nothing is wrong; we are growing and need better support" },
    ],
  },
  principal: {
    id: "detail",
    short: "Detail",
    prompt: "What is the basis for your move?",
    choices: [
      { value: "talent", label: "Recognised achievement in my field", hint: "Global Talent needs no employer, no entity and no job offer" },
      { value: "founder", label: "A business I intend to start in the UK" },
      { value: "employment", label: "A job with a UK employer, or my own company" },
      { value: "unsure", label: "I do not know which route applies" },
    ],
  },
  partner: {
    id: "detail",
    short: "Detail",
    prompt: "What kind of practice are you?",
    choices: [
      { value: "law", label: "A law firm or chambers in India" },
      { value: "accounting", label: "A chartered accountancy or consulting firm" },
      { value: "chamber", label: "A chamber of commerce or trade body" },
      { value: "ipa", label: "An investment promotion agency or government body" },
      { value: "other", label: "Something else" },
    ],
  },
};

export function visibleQuestions(answers: BriefAnswers): Question[] {
  const core = questions.filter((q) => !q.when || q.when(answers));
  const detail = answers.segment ? detailQuestion[answers.segment] : undefined;
  return detail ? [...core, detail] : core;
}
