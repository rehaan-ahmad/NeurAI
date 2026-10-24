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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/50 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Patient Registry</h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Tenant-isolated clinical cohort. Synthetic profiles with zero external PII.
          </p>
        </div>
        <button
          onClick={() => router.push("/patients/create")}
          className="rounded-xl bg-primary hover:bg-primary-hover text-white px-4 py-2 text-sm font-semibold transition-all duration-150 shadow-md shadow-primary/20 flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Patient
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-danger/40 bg-danger-subtle p-4 text-danger text-sm flex items-center gap-3">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      <div className="relative">
        <svg className="absolute left-3.5 top-3 w-4 h-4 text-muted pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          placeholder="Filter by patient reference or gender…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-border/70 bg-card px-4 py-2.5 pl-10 text-sm text-foreground placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        />
      </div>

      <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center text-muted">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent mb-2" />
            <p className="text-sm">Refreshing patient records…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-muted">
            <p className="text-sm font-medium">No patient records found.</p>
            <p className="text-xs text-muted/80 mt-1">Create a synthetic patient profile to begin screening workflows.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/60 bg-muted-subtle/40 text-xs font-semibold text-muted uppercase font-mono tracking-wider">
                  <th className="px-5 py-3.5">Reference ID</th>
                  <th className="px-5 py-3.5">Age</th>
                  <th className="px-5 py-3.5">Gender</th>
                  <th className="px-5 py-3.5">Created</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-sm">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-muted-subtle/30 transition-colors">
                    <td className="px-5 py-4 font-mono font-medium text-foreground">
                      <a
                        href={`/patients/${p.id}`}
                        className="text-primary hover:text-primary-hover hover:underline inline-flex items-center gap-1.5"
                      >
                        {p.displayId}
                        <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </td>
                    <td className="px-5 py-4 text-foreground">{p.age} yrs</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize bg-muted-subtle text-muted border border-border/50">
                        {p.gender}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted text-xs">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {deleteConfirm === p.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="rounded-lg bg-danger px-3 py-1 text-xs font-medium text-white hover:bg-danger/90 transition-colors"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="rounded-lg border border-border bg-muted-subtle px-3 py-1 text-xs font-medium text-muted hover:text-foreground transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(p.id)}
                          className="rounded-lg border border-border/60 px-3 py-1 text-xs font-medium text-muted hover:text-danger hover:border-danger/40 transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
