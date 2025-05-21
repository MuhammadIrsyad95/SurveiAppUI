//Form/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Choice = { id: string; text: string };
type Question = {
  id: string;
  text: string;
  type: "text" | "multiple-choice";
  isRequired: boolean;
  choices: Choice[];
};

export default function NewFormPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text: "",
        type: "text",
        isRequired: false,
        choices: [],
      },
    ]);
  };

  const removeQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const addChoice = (questionId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            choices: [...q.choices, { id: crypto.randomUUID(), text: "" }],
          };
        }
        return q;
      })
    );
  };

  const removeChoice = (questionId: string, choiceId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            choices: q.choices.filter((c) => c.id !== choiceId),
          };
        }
        return q;
      })
    );
  };

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

      const res = await fetch(`${apiUrl}/Forms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, questions }),
      });

      if (!res.ok) throw new Error("Failed to create form.");

      const newForm = await res.json();
      router.push(`/form/${newForm.id}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md my-8">
      <h1 className="text-4xl font-semibold mb-8 text-gray-900">Create New Form</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Title & Description */}
        <section>
          <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-2">
            Form Title <span className="text-red-600">*</span>
          </label>
          <input
            id="title"
            type="text"
            placeholder="Enter your form title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </section>

        <section>
          <label htmlFor="description" className="block text-lg font-medium text-gray-700 mb-2">
            Description (optional)
          </label>
          <textarea
            id="description"
            placeholder="Describe your form"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
          />
        </section>

        {/* Questions */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Questions</h2>

          {questions.length === 0 && (
            <p className="text-gray-500 mb-6 italic">No questions added yet.</p>
          )}

          {questions.map((q, i) => (
            <div
              key={q.id}
              className="border border-gray-300 rounded-lg p-6 mb-6 relative bg-gray-50 hover:shadow-lg transition-shadow"
            >
              <button
                type="button"
                onClick={() => removeQuestion(q.id)}
                className="absolute top-3 right-3 text-red-600 text-xl font-bold hover:text-red-800"
                aria-label="Remove question"
              >
                &times;
              </button>

              <label className="block font-medium text-gray-700 mb-2">
                Question #{i + 1} <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                placeholder="Type your question here"
                value={q.text}
                onChange={(e) =>
                  setQuestions((prev) =>
                    prev.map((ques) =>
                      ques.id === q.id ? { ...ques, text: e.target.value } : ques
                    )
                  )
                }
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition mb-4"
              />

              <label className="block font-medium text-gray-700 mb-1">Question Type</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                value={q.type}
                onChange={(e) =>
                  setQuestions((prev) =>
                    prev.map((ques) =>
                      ques.id === q.id
                        ? {
                            ...ques,
                            type: e.target.value as Question["type"],
                            choices:
                              e.target.value === "multiple-choice"
                                ? ques.choices.length > 0
                                  ? ques.choices
                                  : [{ id: crypto.randomUUID(), text: "" }]
                                : [],
                          }
                        : ques
                    )
                  )
                }
              >
                <option value="text">Text</option>
                <option value="multiple-choice">Multiple Choice</option>
              </select>

              <label className="inline-flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={q.isRequired}
                  onChange={(e) =>
                    setQuestions((prev) =>
                      prev.map((ques) =>
                        ques.id === q.id ? { ...ques, isRequired: e.target.checked } : ques
                      )
                    )
                  }
                  className="mr-2"
                />
                <span className="text-gray-700">Required</span>
              </label>

              {/* Choices */}
              {q.type === "multiple-choice" && (
                <div className="pl-4 border-l-4 border-blue-400 bg-blue-50 rounded-md p-4">
                  <label className="block font-semibold mb-3 text-blue-700">
                    Choices
                  </label>
                  {q.choices.map((c, ci) => (
                    <div key={c.id} className="flex items-center space-x-3 mb-3">
                      <input
                        type="text"
                        placeholder={`Choice #${ci + 1}`}
                        value={c.text}
                        onChange={(e) => {
                          const newText = e.target.value;
                          setQuestions((prev) =>
                            prev.map((ques) =>
                              ques.id === q.id
                                ? {
                                    ...ques,
                                    choices: ques.choices.map((choice) =>
                                      choice.id === c.id ? { ...choice, text: newText } : choice
                                    ),
                                  }
                                : ques
                            )
                          );
                        }}
                        required
                        className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                      />
                      <button
                        type="button"
                        onClick={() => removeChoice(q.id, c.id)}
                        className="text-red-600 hover:text-red-800 font-bold text-2xl leading-none"
                        aria-label="Remove choice"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addChoice(q.id)}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    + Add Choice
                  </button>
                </div>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
          >
            + Add Question
          </button>
        </section>

        {/* Error message */}
        {error && (
          <p className="text-red-600 font-semibold bg-red-100 p-3 rounded-md mt-4">
            {error}
          </p>
        )}

        {/* Submit button */}
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
