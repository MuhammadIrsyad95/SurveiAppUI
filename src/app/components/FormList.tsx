"use client";

import Link from 'next/link';
import { Form } from '@/types/types';
import { FileText } from 'lucide-react';

interface Props {
  forms: Form[];
}

export default function FormList({ forms }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {forms.map((form) => (
        <div
          key={form.id}
          className="group bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg hover:border-blue-400 transition p-6 flex flex-col justify-between"
        >
          <Link href={`/Forms/${form.id}`} className="block cursor-pointer">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-100 rounded-md text-blue-600 mr-3">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 truncate">
                {form.title}
              </h3>
            </div>

            {form.description && (
              <p className="text-sm text-gray-600 line-clamp-3">{form.description}</p>
            )}
          </Link>
        </div>
      ))}
    </div>
  );
}
