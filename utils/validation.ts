export interface ValidationRule<T> {
  required?: boolean;
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  custom?: (value: T) => string | undefined;
}

export function validateField<T>(
  value: T,
  rules: ValidationRule<T>,
  fieldName: string
): string | undefined {
  if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
    return `${fieldName} is required`;
  }

  if (typeof value === 'string') {
    if (rules.pattern && !rules.pattern.test(value)) {
      return `Invalid ${fieldName.toLowerCase()} format`;
    }

    if (rules.minLength && value.length < rules.minLength) {
      return `${fieldName} must be at least ${rules.minLength} characters`;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return `${fieldName} must be less than ${rules.maxLength} characters`;
    }
  }

  if (rules.custom) {
    return rules.custom(value);
  }

  return undefined;
}

export const validationRules = {
  email: {
    required: true,
    pattern: /^\S+@\S+\.\S+$/,
  },
  phone: {
    required: true,
    pattern: /^\d{10}$/,
  },
  date: {
    required: true,
    pattern: /^\d{4}-\d{2}-\d{2}$/,
  },
  password: {
    required: true,
    minLength: 6,
  },
} as const;
