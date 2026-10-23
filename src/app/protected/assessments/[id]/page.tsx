import { getAssessmentAction } from "@/server/actions/assessments";
import { AssessmentForm } from "@/components/assessment-form";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function AssessmentDetail({
  params,
}: Readonly<{ params: { id: string } }>) {
  const result = await getAssessmentAction(params.id);
  if (!result || "error" in result) {
    notFound();
  }
  const assessment = result as {
    id: string;
    patientId: string;
    status: string;
    cognitiveTests: Array<{
      testId: string;
      name: string;
      score?: number;
      maxScore?: number;
      status: string;
      notes?: string;
      assessedAt?: string;
    }>;
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Assessment</h1>
          <p className="text-sm text-muted">
            Patient {assessment.patientId} · {assessment.status}
          </p>
        </div>
        <Link
          href="/patients"
          className="text-sm text-muted underline offset-4 hover:text-primary"
        >
          Back to patients
        </Link>
      </div>
      <AssessmentForm
        assessment={{
          ...assessment,
          cognitiveTests: assessment.cognitiveTests.map((t) => ({
            ...t,
            status: t.status as
              | "missing"
              | "not-performed"
              | "unavailable"
              | "completed",
          })),
        }}
      />
    </div>
  );
}
