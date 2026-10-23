"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  listPatientsAction,
  deletePatientAction,
} from "@/server/actions/patients";

export default function PatientList() {
  const router = useRouter();
  const [patients, setPatients] = useState<{ id: string; displayId: string; age: number; gender: string; createdAt: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const load = useCallback(async () => {
    const result = await listPatientsAction();
    if ("error" in result) {
      setError(String(result.error));
      return;
    }
    setPatients((result as unknown as typeof patients));
    setError(null);
  }, []);

  const handleDelete = async (id: string) => {
    setDeleteConfirm(null);
    await deletePatientAction(id);
    startTransition(load);
  };

  const filtered = patients.filter(
    (p) =>
      p.displayId.toLowerCase().includes(query.toLowerCase()) ||
      p.gender.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-foreground">Patients</h1>
        <button
          onClick={() => router.push("/patients/create")}
          className="rounded-md border border-primary bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
        >
          Add patient
        </button>
      </div>

      {error && (
        <div className="rounded-md border border-danger bg-danger-subtle p-3 text-danger text-sm">
          {error}
        </div>
      )}

      <div className="relative">
        <input
          type="search"
          placeholder="Search by patient reference or gender…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-md border border-border bg-background px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
        />
      </div>

      <div className="mt-4">
        {isLoading ? (
          <p className="text-muted">Loading…</p>
        ) : filtered.length === 0 ? (
          <div className="rounded-md border border-border bg-muted-subtle p-6 text-center text-muted">
            No patients found.
          </div>
        ) : (
          <table className="w-full rounded-md border border-border bg-background">
            <thead>
              <tr className="border-b border-border bg-muted-subtle">
                <th className="text-left px-4 py-2 text-sm font-semibold text-muted">Reference</th>
                <th className="text-left px-4 py-2 text-sm font-semibold text-muted">Age</th>
                <th className="text-left px-4 py-2 text-sm font-semibold text-muted">Gender</th>
                <th className="text-left px-4 py-2 text-sm font-semibold text-muted">Created</th>
                <th className="text-right px-4 py-2 text-sm font-semibold text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-sm text-foreground">
                    <a
                      href={`/patients/${p.id}`}
                      className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      {p.displayId}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted">{p.age}</td>
                  <td className="px-4 py-3 text-sm text-muted">{p.gender}</td>
                  <td className="px-4 py-3 text-sm text-muted">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    {deleteConfirm === p.id ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="rounded-md border border-danger bg-danger px-3 py-1.5 text-xs font-medium text-white hover:bg-danger/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger transition-colors"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="ml-2 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted hover:bg-muted-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(p.id)}
                        className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted hover:bg-muted-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
