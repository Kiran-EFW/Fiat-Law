import { pageMeta } from "@/lib/seo";
import { BriefFlow } from "@/components/brief/BriefFlow";
import { EphemeralLeadNotice } from "@/components/PreviewBanner";

export const metadata = pageMeta({
  title: "The UK Entry Brief",
  description:
    "Answer six to nine questions and receive a written UK Entry Brief: the route that fits, the sequence with realistic timelines, the specific obstacles your position will hit, and what we would do at each step.",
  path: "/uk-entry-brief",
  eyebrow: "A written position on your matter",
});

export default async function UkEntryBriefPage({
  searchParams,
}: {
  searchParams: Promise<{ segment?: string }>;
}) {
  const { segment } = await searchParams;
  return <BriefFlow initialSegment={segment} notice={<EphemeralLeadNotice className="mt-8" />} />;
}
