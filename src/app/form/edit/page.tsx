// /src/app/form/[id]/edit/page.tsx
import React from 'react';
import FormBuilder from './FormBuilder';
import { Form } from '@/types/types';
import { fetchWithAgent } from '@/lib/fetch';

async function getFormById(id: string): Promise<Form> {
  const res = await fetchWithAgent(`${process.env.NEXT_PUBLIC_API_URL}/Forms/${id}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch form');
  return res.json();
}

export default async function EditFormPage({ params }: { params: { id: string } }) {
  const form = await getFormById(params.id);

  async function saveForm(updatedForm: Form) {
    // POST atau PUT ke API untuk simpan perubahan
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Forms/${updatedForm.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedForm),
    });
  }

  return <FormBuilder initialForm={form} onSave={saveForm} />;
}
