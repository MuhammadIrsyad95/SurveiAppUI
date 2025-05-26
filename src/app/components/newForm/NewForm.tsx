"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "./ImageUpload";

import FormHeader from "./FormHeader";
import QuestionsList from "./QuestionsList";

export type Choice = { id: string; text: string };
export type Question = {
  id: string;
  text: string;
  type: "text" | "multiple-choice";
  isRequired: boolean;
  choices: Choice[];
};

export default function NewForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (questions.length === 0) {
      setError("Please add at least one question.");
      setLoading(false);
      return;
    }

    for (const q of questions) {
      if (!q.text.trim()) {
        setError("All questions must have text.");
        setLoading(false);
        return;
      }
      if (q.type === "multiple-choice") {
        if (q.choices.length === 0) {
          setError("Multiple choice questions must have at least one choice.");
          setLoading(false);
          return;
        }
        for (const c of q.choices) {
          if (!c.text.trim()) {
            setError("All choices must have text.");
            setLoading(false);
            return;
          }
        }
      }
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) throw new Error("Missing API URL");

      let imageUrl = "";
      if (image) {
        const formData = new FormData();
        formData.append("file", image);

        const uploadRes = await fetch(`${apiUrl}/Uploads/image`, {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) throw new Error("Failed to upload image.");
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      }

      const res = await fetch(`${apiUrl}/Forms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, questions, imageUrl }),
      });

      if (!res.ok) throw new Error("Failed to create form.");

      const newForm = await res.json();
      router.push(`/Forms/${newForm.id}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md my-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        <section>
          <ImageUpload onImageChange={(file, url) => {
            setImage(file);
            setPreviewUrl(url);
          }} />
          {previewUrl && (
            <img src={previewUrl} alt="Preview" className="mt-2 max-h-40 rounded shadow" />
          )}
        </section>

        <FormHeader
          title={title}
          description={description}
          setTitle={setTitle}
          setDescription={setDescription}
        />

        <QuestionsList questions={questions} setQuestions={setQuestions} />

        {error && (
          <p className="text-red-600 font-semibold bg-red-100 p-3 rounded-md mt-4">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 text-white font-semibold rounded-lg transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? (
            <span className="flex justify-center items-center space-x-2">
              <svg
                className="animate-spin h-5 w-5 text-white mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 010 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                ></path>
              </svg>
              Creating...
            </span>
          ) : (
            "Create Form"
          )}
        </button>
      </form>
    </main>
  );
}
