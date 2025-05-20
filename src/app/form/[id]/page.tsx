import { Form } from '@/types/types';
import FormComponent from './FormComponent';
import { fetchWithAgent } from '@/lib/fetch'; // ✅ Import helper

async function getFormById(id: string): Promise<Form> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/Forms/${id}`;
  console.log("hasil url "+ url)
  const res = await fetchWithAgent(url, {
    cache: 'no-store',
  });
  

  if (!res.ok) throw new Error('Failed to fetch form');

  return res.json();
}

export default async function FormPage({ params }: { params: { id: string } }) {
  const form = await getFormById(params.id);
  return (
    <section className="p-6">
      <FormComponent form={form} />
    </section>
  );
}
