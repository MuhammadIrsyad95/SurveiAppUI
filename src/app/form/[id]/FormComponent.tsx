// src/app/Form/[id]/FormComponent.tsx
'use client';

import React, { useState } from 'react';
import { Form } from '@/types/types';
import { CreateResponseDto, AnswerDto } from '@/types/dto';

interface Props {
  form: Form;
}

export default function FormComponent({ form }: Props) {
  const [answers, setAnswers] = useState<Record<string, string[] | string>>({});
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (questionId: string, value: string, isCheckbox = false) => {
    setAnswers((prev) => {
      if (!isCheckbox) return { ...prev, [questionId]: value };
      const current = (prev[questionId] as string[] | undefined) ?? [];
      const updated = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
      return { ...prev, [questionId]: updated };
    });
  };

  const validate = (): boolean => {
    const missing = form.questions?.filter((q) => q.isRequired && !answers[q.id]?.length).map(q => q.text) ?? [];
    setErrors(missing);
    return missing.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setErrors([]);

    if (!validate()) {
      setMessage('Please fill all required questions.');
      return;
    }

    setSubmitting(true);

    const answersPayload: AnswerDto[] = form.questions?.reduce((acc, q) => {
      const ans = answers[q.id];
      if (!ans) return acc;

      if (q.type === 'checkbox' && Array.isArray(ans)) {
        ans.forEach((choiceId) => acc.push({ questionId: q.id, choiceId, answerText: undefined }));
      } else if (q.type === 'multiple_choice' && typeof ans === 'string') {
        acc.push({ questionId: q.id, choiceId: ans, answerText: undefined });
      } else if (q.type === 'text' && typeof ans === 'string') {
        acc.push({ questionId: q.id, choiceId: null, answerText: ans });
      }
      return acc;
    }, [] as AnswerDto[]) ?? [];

    const payload: CreateResponseDto = {
      formId: form.id,
      respondentName: name,
      answers: answersPayload,
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to submit response');

      setMessage('✅ Thank you for your response!');
      setAnswers({});
      setName('');
    } catch {
      setMessage('❌ Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 shadow-lg rounded-xl p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">{form.title}</h2>
        <p className="text-zinc-600 dark:text-zinc-400">{form.description}</p>
      </div>
      <div>
        <img className="text-3xl font-bold text-zinc-900 dark:text-white">{form.imageUrl}</img>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium mb-1 text-zinc-800 dark:text-zinc-200">Your Name</label>
          <input
            type="text"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-zinc-300 dark:border-zinc-700 rounded px-4 py-2 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {form.questions?.map((q) => (
          <div key={q.id} className="space-y-2">
            <p className="font-semibold text-zinc-800 dark:text-zinc-100">
              {q.text} {q.isRequired && <span className="text-red-500">*</span>}
            </p>

            {q.type === 'text' && (
              <input
                type="text"
                value={(answers[q.id] as string) ?? ''}
                onChange={(e) => handleChange(q.id, e.target.value)}
                required={q.isRequired}
                className="w-full border border-zinc-300 dark:border-zinc-700 rounded px-4 py-2 dark:bg-zinc-800 dark:text-white"
              />
            )}

            {(q.type === 'multiple_choice' || q.type === 'checkbox') && q.choices?.map((choice) => (
              <label key={choice.id} className="flex items-center space-x-2 text-zinc-700 dark:text-zinc-300">
                <input
                  type={q.type === 'multiple_choice' ? 'radio' : 'checkbox'}
                  name={q.id}
                  value={choice.id}
                  checked={
                    q.type === 'multiple_choice'
                      ? answers[q.id] === choice.id
                      : (answers[q.id] as string[] | undefined)?.includes(choice.id) ?? false
                  }
                  onChange={() => handleChange(q.id, choice.id, q.type === 'checkbox')}
                  className="accent-blue-600"
                />
                <span>{choice.text}</span>
              </label>
            ))}

            {errors.includes(q.text) && (
              <p className="text-sm text-red-500">This question is required.</p>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {message && (
        <p className={`text-center font-medium ${message.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
