import { useState } from 'react';

export function useForm<T extends Record<string, any>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const setValue = (key: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: undefined }));
    }
  };

  const setError = (key: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [key]: error }));
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    setValue,
    setError,
    setErrors,
    reset,
  };
}
