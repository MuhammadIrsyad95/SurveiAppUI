// src/app/Forms/edit/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Form } from "@/types/types";
import FormEditor, { FormData } from "@/app/Forms/new/FormEditor";

export default function EditFormPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };

  const [form, setForm] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!apiUrl) return;

    async function fetchForm() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${apiUrl}/Forms/${id}`);
        if (!res.ok) throw new Error(`Failed to fetch form (status ${res.status})`);
        const data = await res.json();
        setForm(data);
      } catch (e: any) {
        setError(e.message || "Failed to load form");
      } finally {
        setLoading(false);
      }
    }

    fetchForm();
  }, [apiUrl, id]);

  async function handleSave() {
    if (!form || !apiUrl) return;

    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`${apiUrl}/Forms/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to save form (status ${res.status})`);
      }

      router.push(`/form/${id}`);
    } catch (e: any) {
      setError(e.message || "Failed to save form");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-center py-10 text-gray-600">Loading form...</div>;

  if (error)
    return (
      <div className="max-w-xl mx-auto p-6 text-center text-red-600 font-semibold">
        Error: {error}
      </div>
    );

  if (!form) return <div className="text-center py-10">Form not found</div>;

  return (
    <section className="max-w-3xl mx-auto p-8 bg-white rounded shadow-md">
      <h1 className="text-3xl font-semibold mb-8 text-gray-800">Edit Form</h1>

      <FormEditor initialData={form} onChange={(updated) => setForm(updated)} />

      <div className="flex items-center gap-4 mt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-2 rounded transition"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        <button
          onClick={() => router.push("/")}
          disabled={saving}
          className="px-6 py-2 border border-gray-400 rounded hover:bg-gray-100 transition"
        >
          Cancel
        </button>
      </div>

      {error && <p className="mt-4 text-red-600 font-medium">{error}</p>}
    </section>
  );
}
