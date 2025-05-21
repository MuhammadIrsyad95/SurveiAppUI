"use client";

import { Form } from "@/types/types";
import FormCard from "./FormCard";

interface Props {
  forms: Form[];
  onDelete: (id: string) => void;  // callback setelah delete
  apiUrl: string;
}

export default function FormList({ forms, onDelete, apiUrl }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-center">
      {forms.map((form) => (
        <FormCard key={form.id} form={form} onDeleted={onDelete} apiUrl={apiUrl} />
      ))}
    </div>
  );
}
