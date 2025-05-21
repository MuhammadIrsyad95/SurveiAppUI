"use client";

import { useEffect, useState } from "react";
import HomeWelcome from "./components/HomeWelcome";
import FormList from "./components/FormList";
import { Form } from "@/types/types";

async function fetchForms(): Promise<Form[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error("Missing NEXT_PUBLIC_API_URL environment variable");

  const res = await fetch(`${apiUrl}/Forms`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch forms: ${res.status}`);

  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;

  throw new Error("Unexpected API response format");
}

export default function HomePage() {
  const [forms, setForms] = useState<Form[]>([]);
  const [error, setError] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

  useEffect(() => {
    fetchForms()
      .then(setForms)
      .catch((err) => {
        console.error("Error fetching forms:", err);
        setError(true);
      });
  }, []);

  function handleDelete(id: string) {
    setForms((prev) => prev.filter((f) => f.id !== id));
  }

  return (
    <section className="p-6 max-w-5xl mx-auto">
      <HomeWelcome />

      {error ? (
        <p className="text-red-500 text-center">
          Failed to load forms. Please try again later.
        </p>
      ) : forms.length === 0 ? (
        <p className="text-center text-gray-500">No forms available.</p>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-4">Available Templates</h2>
          <FormList forms={forms} onDelete={handleDelete} apiUrl={apiUrl} />
        </>
      )}
    </section>
  );
}
