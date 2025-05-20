// src/components/FormItem.tsx
import React from 'react';
import Link from 'next/link';

interface FormItemProps {
  id: string;
  title: string;
  description: string;
}

const FormItem: React.FC<FormItemProps> = ({ id, title, description }) => {
  return (
    <li>
      <Link href={`/form/${id}`}>
        <strong>{title}</strong> - {description}
      </Link>
    </li>
  );
};

export default FormItem;
