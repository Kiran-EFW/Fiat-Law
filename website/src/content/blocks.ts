/**
 * The editorial block union shared by the CETA briefing and the insights.
 * Content is authored as data so that every page renders through the same
 * typographic system and nothing drifts.
 */
export type Block =
  | { kind: "p"; text: string }
  | { kind: "h"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "numbers"; items: string[] }
  | { kind: "quote"; text: string; attribution?: string }
  | { kind: "callout"; title: string; text: string; link?: { href: string; label: string } }
  | { kind: "table"; head: string[]; rows: string[][] };
