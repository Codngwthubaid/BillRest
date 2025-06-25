import * as React from 'react';

interface FormErrorProps {
  message?: string;
}

const FormError: React.FC<FormErrorProps> = ({ message }) => {
  if (!message) return null;
  return <p className="text-sm text-red-500">{message}</p>;
};

export { FormError };