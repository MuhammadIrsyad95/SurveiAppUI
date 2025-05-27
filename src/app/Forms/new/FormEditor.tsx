// src/app/Forms/FormEditor.tsx
"use client";

import React, { useState, useEffect } from "react";

export type Choice = { id: string; text: string };
export type Question = {
  id: string;
  text: string;
  type: "text" | "multiple-choice";
  isRequired: boolean;
  choices: Choice[];
};
export type FormData = {
  id?: string;
  title: string;
  description: string;
    imageFile?: File | null;     
  questions: Question[];
};

interface FormEditorProps {
  initialData?: FormData;
  onChange?: (form: FormData) => void;
}

export default function FormEditor({ initialData, onChange }: FormEditorProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [questions, setQuestions] = useState<Question[]>(initialData?.questions || []);

 useEffect(() => {
  if (!onChange) return;

  const timeout = setTimeout(() => {
    onChange({ id: initialData?.id, title, description, questions });
  }, 300); // delay 300ms

  return () => clearTimeout(timeout); // cleanup
}, [title, description, questions, initialData?.id, onChange]);

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

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updates } : q))
    );
  };

  const addChoice = (questionId: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? { ...q, choices: [...q.choices, { id: crypto.randomUUID(), text: "" }] }
          : q
      )
    );
  };

  const removeChoice = (questionId: string, choiceId: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? { ...q, choices: q.choices.filter((c) => c.id !== choiceId) }
          : q
      )
    );
  };

  const updateChoiceText = (questionId: string, choiceId: string, text: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              choices: q.choices.map((c) =>
                c.id === choiceId ? { ...c, text } : c
              ),
            }
          : q
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
      {/* Form Title */}
      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">
          Form Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter form title"
          className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      {/* Form Description */}
      <div className="mb-8">
        <label className="block text-md font-semibold mb-2 text-gray-700">
          Description
        </label>
        <textarea
          placeholder="Describe your form..."
          className="w-full border border-gray-300 rounded-md px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition min-h-[80px]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Questions Section */}
      <div>
        <h2 className="text-2xl font-bold mb-5 text-gray-800">Questions</h2>

        {questions.length === 0 && (
          <p className="mb-6 text-gray-500 italic">No questions added yet.</p>
        )}

        {questions.map((q, idx) => (
          <div
            key={q.id}
            className="border border-gray-300 rounded-lg p-6 mb-6 relative bg-gray-50 shadow-sm hover:shadow-md transition"
          >
            {/* Remove Question Button */}
            <button
              type="button"
              onClick={() => removeQuestion(q.id)}
              title="Remove question"
              className="absolute top-4 right-4 text-red-600 hover:text-red-800 font-extrabold text-xl leading-none select-none"
            >
              &times;
            </button>

            {/* Question Label and Input */}
            <label className="block font-semibold text-gray-900 mb-2">
              Question #{idx + 1} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Type your question here"
              className="w-full rounded-md border border-gray-300 px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={q.text}
              onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
              required
            />

            {/* Question Type Selector */}
            <label className="block font-semibold mb-1 text-gray-800">
              Question Type
            </label>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={q.type}
              onChange={(e) => {
                const newType = e.target.value as Question["type"];
                updateQuestion(q.id, {
                  type: newType,
                  choices:
                    newType === "multiple-choice"
                      ? q.choices.length > 0
                        ? q.choices
                        : [{ id: crypto.randomUUID(), text: "" }]
                      : [],
                });
              }}
            >
              <option value="text">Text</option>
              <option value="multiple-choice">Multiple Choice</option>
            </select>

            {/* Required Checkbox */}
            <label className="inline-flex items-center cursor-pointer mb-4 select-none">
              <input
                type="checkbox"
                checked={q.isRequired}
                onChange={(e) =>
                  updateQuestion(q.id, { isRequired: e.target.checked })
                }
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-gray-800 font-medium">Required</span>
            </label>

            {/* Multiple Choice Options */}
            {q.type === "multiple-choice" && (
              <div className="pl-5 border-l-4 border-blue-400">
                <label className="block font-semibold mb-3 text-gray-700">
                  Choices
                </label>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {q.choices.map((choice, ci) => (
                    <div
                      key={choice.id}
                      className="flex items-center space-x-3"
                    >
                      <input
                        type="text"
                        placeholder={`Choice #${ci + 1}`}
                        className="flex-grow rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        value={choice.text}
                        onChange={(e) =>
                          updateChoiceText(q.id, choice.id, e.target.value)
                        }
                        required
                      />
                      <button
                        type="button"
                        onClick={() => removeChoice(q.id, choice.id)}
                        title="Remove choice"
                        className="text-red-600 hover:text-red-800 font-bold text-xl leading-none select-none"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => addChoice(q.id)}
                  className="mt-3 inline-block text-blue-600 hover:text-blue-800 font-semibold transition"
                >
                  + Add Choice
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Add Question Button */}
        <button
          type="button"
          onClick={addQuestion}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md shadow-md transition"
        >
          + Add Question
        </button>
      </div>
    </div>
  );
}
