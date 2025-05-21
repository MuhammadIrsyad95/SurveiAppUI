// src/app/Form/[id]/FormBuilder.tsx
'use client';

import React, { useState } from 'react';
import { Form, Question } from '@/types/types';
import { QuestionType } from '@/types/enums';

interface Props {
  form: Form;
}

export default function FormBuilder({ form }: Props) {
  const [questions, setQuestions] = useState<Question[]>(form.questions || []);
  const [title, setTitle] = useState(form.title);
  const [description, setDescription] = useState(form.description || '');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value);

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: `${Date.now()}`,
      formId: form.id,
      text: '',
      type: QuestionType.Text,
      isRequired: false,
      choices: [],
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleDelete = (index: number) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const handleQuestionChange = (index: number, key: keyof Question, value: any) => {
    const updated = [...questions];
    updated[index][key] = value;

    // Reset choices if type changed to text
    if (key === 'type' && value === QuestionType.Text) {
      updated[index].choices = [];
    }

    setQuestions(updated);
  };

  const handleChoiceChange = (index: number, choiceIndex: number, value: string) => {
    const updated = [...questions];
    if (!updated[index].choices) updated[index].choices = [];
    updated[index].choices![choiceIndex].text = value;
    setQuestions(updated);
  };

  const handleAddChoice = (index: number) => {
    const updated = [...questions];
    if (!updated[index].choices) updated[index].choices = [];
    updated[index].choices!.push({ id: `${Date.now()}`, questionId: updated[index].id, text: '' });
    setQuestions(updated);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-white dark:bg-zinc-900 rounded-lg shadow">
      <div>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          className="w-full text-3xl font-bold text-zinc-900 dark:text-white bg-transparent border-none focus:ring-0 focus:outline-none"
          placeholder="Form Title"
        />
        <textarea
          value={description}
          onChange={handleDescChange}
          rows={2}
          className="w-full text-zinc-700 dark:text-zinc-300 mt-2 bg-transparent border-none focus:ring-0 focus:outline-none"
          placeholder="Form description..."
        />
      </div>

      {questions.map((q, index) => (
        <div key={q.id} className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-5 space-y-4 shadow-sm border border-zinc-200 dark:border-zinc-700">
          <div className="flex justify-between items-center">
            <input
              type="text"
              value={q.text}
              onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
              className="w-full text-lg font-medium text-zinc-800 dark:text-zinc-100 bg-transparent border-b focus:outline-none focus:ring-0"
              placeholder={`Question ${index + 1}`}
            />
            <button
              onClick={() => handleDelete(index)}
              className="text-red-500 hover:text-red-700 ml-4"
              type="button"
            >
              Delete
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              <input
                type="checkbox"
                checked={q.isRequired}
                onChange={(e) => handleQuestionChange(index, 'isRequired', e.target.checked)}
              />
              Required
            </label>

            <select
              value={q.type}
              onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}
              className="text-sm border border-zinc-300 dark:border-zinc-600 rounded px-2 py-1 dark:bg-zinc-700 dark:text-white"
            >
              <option value={QuestionType.Text}>Text</option>
              <option value={QuestionType.MultipleChoice}>Multiple Choice</option>
              <option value={QuestionType.Checkbox}>Checkbox</option>
            </select>
          </div>

          {(q.type === QuestionType.MultipleChoice || q.type === QuestionType.Checkbox) && (
            <div className="space-y-2">
              {q.choices?.map((choice, choiceIndex) => (
                <input
                  key={choice.id}
                  type="text"
                  value={choice.text}
                  onChange={(e) => handleChoiceChange(index, choiceIndex, e.target.value)}
                  placeholder={`Choice ${choiceIndex + 1}`}
                  className="w-full border border-zinc-300 dark:border-zinc-600 rounded px-3 py-1 text-sm dark:bg-zinc-800 dark:text-white"
                />
              ))}
              <button
                type="button"
                onClick={() => handleAddChoice(index)}
                className="text-blue-600 hover:underline text-sm"
              >
                + Add choice
              </button>
            </div>
          )}
        </div>
      ))}

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={handleAddQuestion}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 font-semibold transition"
        >
          + Add Question
        </button>

        <button
          type="button"
          onClick={() => alert('💾 Simpan ke backend belum diimplementasikan')}
          className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 font-semibold transition"
        >
          Save Form
        </button>
      </div>
    </div>
  );
}
