//File: src/app/components/NewFormButton.tsx

'use client';

import { useRouter } from 'next/navigation';

export default function NewFormButton() {
  const router = useRouter();

  function handleNewForm() {
    router.push('/Forms/new');
  }

  return (
    <button
      onClick={handleNewForm}
      className="mt-6 mb-8 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold shadow-md hover:bg-blue-700 transition duration-200"
    >
      + Create New Form
    </button>
  );
}
