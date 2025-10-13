// utils/validation.ts
export const VALIDATION_MESSAGES = {
  REQUIRED: (field: string) => `${field} is required`,
  INVALID_EMAIL: 'Invalid email format',
  INVALID_PHONE: 'Phone must be 10 digits',
  INVALID_DATE: 'Date must be in YYYY-MM-DD format',
  MIN_LENGTH: (field: string, length: number) => 
    `${field} must be at least ${length} characters`,
} as const;

export const GENDER_OPTIONS = [
  { label: 'Select Gender', value: '' },
  { label: 'Male', value: 'MALE' },
  { label: 'Female', value: 'FEMALE' },
  { label: 'Other', value: 'OTHER' },
] as const;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{10}$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

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
    return VALIDATION_MESSAGES.REQUIRED(fieldName);
  }

  if (typeof value === 'string') {
    if (rules.pattern && !rules.pattern.test(value)) {
      return `Invalid ${fieldName.toLowerCase()} format`;
    }

    if (rules.minLength && value.length < rules.minLength) {
      return VALIDATION_MESSAGES.MIN_LENGTH(fieldName, rules.minLength);
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
    pattern: EMAIL_REGEX,
  },
  phone: {
    required: true,
    pattern: PHONE_REGEX,
  },
  date: {
    required: true,
    pattern: DATE_REGEX,
  },
  password: {
    required: true,
    minLength: 8,
  },
  identifier: {
    required: true,
  },
} as const;

export function getLoginType(identifier: string): "username" | "email" {
  return EMAIL_REGEX.test(identifier) ? "email" : "username";
}

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export function isValidPhone(phone: string): boolean {
  return PHONE_REGEX.test(phone);
}

export function isValidDateFormat(date: string): boolean {
  return DATE_REGEX.test(date);
}

export function capitalize(str: string): string {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatPhoneNumber(phone: string): string {
  if (phone.length !== 10) return phone;
  return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
}

export function generateRandomId(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
