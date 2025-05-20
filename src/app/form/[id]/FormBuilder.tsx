'use client';

import React, { useState } from 'react';
import { Form, Question, Choice } from '@/types/types';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  initialForm: Form;
  onSave: (form: Form) => Promise<void>;
}

export default function FormBuilder({ initialForm, onSave }: Props) {
  const [form, setForm] = useState<Form>(initialForm);
  const [saving, setSaving] = useState(false);

  // Update form title or description
  const updateFormField = (field: 'title' | 'description', value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  // Add new question
  const addQuestion = () => {
    const newQuestion: Question = {
      id: uuidv4(),
      formId: form.id,
      text: '',
      type: 'text',
      isRequired: false,
      choices: [],
    };
    setForm((f) => ({ ...f, questions: [...(f.questions ?? []), newQuestion] }));
  };

  // Update question field
  const updateQuestion = (questionId: string, field: keyof Question, value: any) => {
    setForm((f) => ({
      ...f,
      questions: f.questions?.map((q) =>
        q.id === questionId ? { ...q, [field]: value } : q
      ),
    }));
  };

  // Delete question
  const deleteQuestion = (questionId: string) => {
    setForm((f) => ({
      ...f,
      questions: f.questions?.filter((q) => q.id !== questionId),
    }));
  };

  // TODO: add update choices logic later

  const handleSave = async () => {
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Edit Form</h1>

      <div>
        <label className="block font-semibold mb-1">Title</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => updateFormField('title', e.target.value)}
          className="border p-2 w-full rounded"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Description</label>
        <textarea
          value={form.description ?? ''}
          onChange={(e) => updateFormField('description', e.target.value)}
          className="border p-2 w-full rounded"
          rows={3}
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Questions</h2>

        {(form.questions ?? []).map((q, i) => (
          <div key={q.id} className="border p-3 rounded mb-4">
            <div className="flex justify-between mb-2">
              <input
                type="text"
                placeholder={`Question ${i + 1} text`}
                value={q.text}
                onChange={(e) => updateQuestion(q.id, 'text', e.target.value)}
                className="border p-1 flex-grow rounded"
              />

              <button
                onClick={() => deleteQuestion(q.id)}
                className="ml-2 text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>

            <div className="flex items-center space-x-4 mb-2">
              <select
                value={q.type}
                onChange={(e) => updateQuestion(q.id, 'type', e.target.value)}
                className="border p-1 rounded"
              >
                <option value="text">Text</option>
                <option value="multiple_choice">Multiple Choice (Single)</option>
                <option value="checkbox">Checkboxes (Multiple)</option>
              </select>

              <label className="flex items-center space-x-1">
                <input
                  type="checkbox"
                  checked={q.isRequired}
                  onChange={(e) => updateQuestion(q.id, 'isRequired', e.target.checked)}
                />
                <span>Required</span>
              </label>
            </div>

            {/* TODO: Choices editor if multiple_choice or checkbox */}

          </div>
        ))}

        <button
          onClick={addQuestion}
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        >
          + Add Question
        </button>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Form'}
      </button>
    </div>
  );
}
