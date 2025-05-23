"use client";

import Link from "next/link";
import { Form } from "@/types/types";
import { FileText, Edit3, Trash2 } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

interface Props {
  form: Form;
  onDeleted: (id: string) => void;
  apiUrl: string;
}

export default function FormCard({ form, onDeleted, apiUrl }: Props) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    const result = await MySwal.fire({
      title: `Delete "${form.title}"?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    setDeleting(true);
    setError(null);

    try {
      const res = await fetch(`${apiUrl}/Forms/${form.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete form");

      MySwal.fire({
        icon: "success",
        title: "Deleted!",
        text: `"${form.title}" has been deleted.`,
        timer: 1500,
        showConfirmButton: false,
      });

      onDeleted(form.id);
    } catch (e: any) {
      setError(e.message || "Error deleting form");
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: e.message || "Error deleting form",
      });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-blue-400 transition-all p-5 flex flex-col justify-between h-full max-w-md w-full mx-auto">
      
      <Link href={`/Forms/${form.id}`} className="flex-grow block mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-blue-100 rounded-md text-blue-600">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 break-words">
            {form.title}
          </h3>
        </div>

        {form.imageUrl && (
        <div className="mb-4">
          <img
            src={`${process.env.NEXT_PUBLIC_API_BASE}${form.imageUrl}`}
            alt={form.title}
            className="w-full h-48 object-cover rounded-lg border border-gray-200"
          />
        </div>
      )}

        {form.description && (
          <p className="text-sm text-gray-600 whitespace-pre-wrap break-words">
            {form.description}
          </p>
        )}
      </Link>

      <div className="flex items-center justify-end space-x-4 pt-3 border-t border-gray-100 mt-4">
        <Link
          href={`/Forms/edit/${form.id}`}
          className="hover:text-blue-600"
          aria-label={`Edit form ${form.title}`}
        >
          <Edit3 className="w-5 h-5 text-yellow-600" />
        </Link>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="hover:text-red-600 disabled:opacity-50"
          aria-label={`Delete form ${form.title}`}
        >
          <Trash2 className="w-5 h-5 text-red-600" />
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
