import { getAssessmentAction } from "@/server/actions/assessments";
import ResultBreakdown from "@/components/result-breakdown";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ResultsDetail({
  params,
}: Readonly<{ params: { patientId: string; assessmentId: string } }>) {
  const result = await getAssessmentAction(params.assessmentId);
  if (!result || "error" in result || result.patientId !== params.patientId) {
    notFound();
  }
  const assessment = result as {
    id: string;
    patientId: string;
    status: string;
    createdAt: string;
    cognitiveTests: Array<{
      testId: string;
      name: string;
      score?: number;
      maxScore?: number;
      status: string;
      notes?: string;
      assessedAt?: string;
    }>;
    speech: { status: string };
    gait: { status: string };
    resultProvenance?: {
      clinicianId?: string;
      reviewStatus?: string;
      compositeAvailable?: boolean;
    };
    consent?: {
      purposeDisclosed?: boolean;
      retentionDisclosed?: boolean;
      recordingConsent?: boolean;
    };
    clinicianNotes?: string;
  };

  return (
    <div className="space-y-5 max-w-3xl">
      <Link
        href="/results"
        className="text-sm text-muted underline offset-4 hover:text-primary"
      >
        ← Back to results
      </Link>
      <ResultBreakdown assessment={assessment} />
    </div>
  );
}
