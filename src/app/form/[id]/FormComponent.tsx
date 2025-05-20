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
      if (!isCheckbox) {
        return { ...prev, [questionId]: value };
      }
      const current = (prev[questionId] as string[] | undefined) ?? [];
      let updated: string[];
      if (current.includes(value)) {
        updated = current.filter((v) => v !== value);
      } else {
        updated = [...current, value];
      }
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

    // Buat answers payload dengan reduce agar tipe jelas
    const answersPayload: AnswerDto[] = form.questions?.reduce((acc, q) => {
      const ans = answers[q.id];
      if (!ans) return acc;

      if (q.type === 'checkbox' && Array.isArray(ans)) {
        ans.forEach((choiceId) => {
          acc.push({
            questionId: q.id,
            choiceId,
            answerText: undefined,
          });
        });
      } else if (q.type === 'multiple_choice' && typeof ans === 'string') {
        acc.push({
          questionId: q.id,
          choiceId: ans,
          answerText: undefined,
        });
      } else if (q.type === 'text' && typeof ans === 'string') {
        acc.push({
          questionId: q.id,
          choiceId: null,
          answerText: ans,
        });
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

      setMessage('Thank you for your response!');
      setAnswers({});
      setName('');
    } catch {
      setMessage('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold">{form.title}</h2>
      <p className="mb-6">{form.description}</p>

      <form onSubmit={handleSubmit}>
        <label className="block mb-4">
          Your Name:
          <input
            type="text"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            className="border p-2 w-full"
          />
        </label>

        {form.questions?.map((q) => (
          <div key={q.id} className="mb-6">
            <p className="font-semibold">
              {q.text} {q.isRequired && <span className="text-red-500">*</span>}
            </p>

            {q.type === 'text' && (
              <input
                type="text"
                required={q.isRequired}
                value={(answers[q.id] as string) ?? ''}
                onChange={(e) => handleChange(q.id, e.target.value)}
                className="border p-2 w-full"
              />
            )}

            {(q.type === 'multiple_choice' || q.type === 'checkbox') && q.choices?.map((choice) => (
              <label key={choice.id} className="block">
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
                  className="mr-2"
                />
                {choice.text}
              </label>
            ))}

            {errors.includes(q.text) && (
              <p className="text-red-500 text-sm">This question is required.</p>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}
