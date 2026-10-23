import { listPatientsAction } from "@/server/actions/patients";
import Link from "next/link";
import { AssessmentStarter } from "@/components/assessment-starter";

export default async function NewAssessment() {
  const result = await listPatientsAction();
  if ("error" in result) {
    return (
      <div className="max-w-md mx-auto mt-12 text-center">
        <h1 className="text-2xl font-bold text-foreground">New assessment</h1>
        <p className="mt-2 text-danger text-sm">{String(result.error)}</p>
        <Link href="/" className="mt-4 inline-block text-primary underline offset-4">
          Back home
        </Link>
      </div>
    );
  }
  const patients = (result as Array<{ id: string; displayId: string }>).map(
    (p) => ({ id: p.id, displayId: p.displayId }),
  );
  return <AssessmentStarter patients={patients} />;
}
