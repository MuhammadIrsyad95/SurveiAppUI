// src/app/form/[id]/page.tsx
import { Form } from '@/types/types';
import FormComponent from './FormComponent';
import { fetchWithAgent } from '@/lib/fetch';

export interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<any>;
}

async function getFormById(id: string): Promise<Form> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/Forms/${id}`;
  const res = await fetchWithAgent(url, { cache: 'no-store' });

  if (!res.ok) throw new Error('Failed to fetch form');

  return res.json();
}

export default async function FormPage({ params }: PageProps) {
  const resolvedParams = await params;
  const form = await getFormById(resolvedParams.id);

  return (
    <section className="p-6">
      <FormComponent form={form} />
    </section>
  );
}
