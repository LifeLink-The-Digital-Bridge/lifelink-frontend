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
