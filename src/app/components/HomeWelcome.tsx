// src/app/components/HomeWelcome.tsx
'use client';

import Link from 'next/link';
import { PlusIcon } from 'lucide-react';
import NewFormButton from '@/app/components/NewFormButton';

export default function HomeWelcome() {
  return (
    <div className="text-center mb-12 max-w-xl mx-auto px-4">
      <h1 className="text-5xl font-extrabold mb-4 text-gray-900">Create, Share & Analyze Your Surveys</h1>
      <p className="text-lg text-gray-600 mb-8">
        Quickly build custom forms and get insights from responses with ease.
      </p>
      <NewFormButton />
    </div>
  );
}
