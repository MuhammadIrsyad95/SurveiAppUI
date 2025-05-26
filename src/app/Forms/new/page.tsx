"use client";
import NewForm from "@/app/components/newForm/NewForm";


export default function NewFormPage() {
  return (
    <div className="max-w-4xl mx-auto mt-12 px-4">
      <h1 className="text-4xl font-bold text-left text-blue-700 mb-6">
        🚀 Create a New Form
      </h1>

      <NewForm />
    </div>
  );
}

