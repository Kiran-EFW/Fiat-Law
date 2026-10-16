import { questions, detailQuestion } from "@/lib/brief/questions";
import { segmentById, isSegmentId } from "@/lib/segments";
import type { BriefAnswers } from "@/lib/brief/types";

/**
 * Turns stored answer codes back into the words the client actually saw.
 * Used by the admin view so that nobody has to remember what `non_compliant`
 * or `3_10` meant.
 */
const coreLabels: Record<string, Record<string, string>> = Object.fromEntries(
  questions.map((q) => [q.id, Object.fromEntries(q.choices.map((c) => [c.value, c.label]))]),
);

export function answerLabel(field: string, value: string, segment?: string): string {
  if (field === "segment") return isSegmentId(value) ? segmentById[value].name : value;
  if (field === "detail") {
    const question = segment ? detailQuestion[segment] : undefined;
    return question?.choices.find((c) => c.value === value)?.label ?? value;
  }
  return coreLabels[field]?.[value] ?? value;
}

export interface AnswerRow {
  field: string;
  question: string;
  value: string;
}

/** Flattens a stored answer set into an ordered, readable list. */
export function answerRows(answers: BriefAnswers): AnswerRow[] {
  const rows: AnswerRow[] = [];
  for (const question of questions) {
    const value = answers[question.id as keyof BriefAnswers];
    if (typeof value === "string" && value) {
      rows.push({
        field: question.id as string,
        question: question.short,
        value: answerLabel(question.id as string, value, answers.segment),
      });
    }
  }
  if (answers.detail) {
    rows.push({
      field: "detail",
      question: answers.segment ? (detailQuestion[answers.segment]?.short ?? "Detail") : "Detail",
      value: answerLabel("detail", answers.detail, answers.segment),
    });
  }
  if (answers.originCity) {
    rows.push({ field: "originCity", question: "From", value: answers.originCity });
  }
  return rows;
}
