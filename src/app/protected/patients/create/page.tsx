"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPatientAction } from "@/server/actions/patients";
import Link from "next/link";

export default function CreatePatient() {
  const router = useRouter();
  const [error, setError] = useState<{ message: string; field?: string } | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    const result = await createPatientAction(formData);
    if ("error" in result) {
      setError({ message: result.error as string, field: result.field });
      return;
    }
    router.push(`/patients/${String((result as { patient: { id: string } }).patient.id)}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-foreground">Create patient</h1>
        <Link href="/patients" className="text-sm text-muted underline offset-4 hover:text-primary">
          Back to list
        </Link>
      </div>

      <form action={handleSubmit} className="space-y-4 max-w-md" noValidate>
        {error && (
          <div className="rounded-md border border-danger bg-danger-subtle p-3 text-danger text-sm">
            {error.message}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground">Patient reference</label>
            <input
              name="displayId"
              type="text"
              placeholder="e.g. P-1003"
              className="rounded-md border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              required
            />
            {error?.field === "displayId" && (
              <p className="text-xs text-danger">Invalid patient reference.</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground">Age</label>
            <input
              name="age"
              type="number"
              placeholder="e.g. 68"
              className="rounded-md border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              required
            />
            {error?.field === "age" && (
              <p className="text-xs text-danger">Age must be 0–120.</p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-foreground">Gender</label>
          <select
            name="gender"
            className="rounded-md border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
          {error?.field === "gender" && (
            <p className="text-xs text-danger">Invalid gender.</p>
          )}
        </div>
        <button
          className="rounded-md border border-primary bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
        >
          Create patient
        </button>
        <p className="text-xs text-muted">
          Synthetic demo data only — not a real patient record.
        </p>
      </form>
    </div>
  );
}
