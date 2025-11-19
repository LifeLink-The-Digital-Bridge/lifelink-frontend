export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export const validateHLA = (value: string): ValidationResult => {
  if (!value || value.trim() === '') return { isValid: true, message: '' };
  const hlaPattern = /^[A-Z]\*\d{2}:\d{2}$/;
  if (!hlaPattern.test(value)) {
    return { isValid: false, message: 'Invalid HLA format. Use format like A*02:01' };
  }
  return { isValid: true, message: '' };
};

export const validateHemoglobin = (value: string, gender: string = 'MALE'): ValidationResult => {
  const num = parseFloat(value);
  if (isNaN(num)) return { isValid: false, message: 'Please enter a valid number' };
  if (num < 5 || num > 20) return { isValid: false, message: 'Value seems unusual. Normal range is 12-18 g/dL' };
  return { isValid: true, message: '' };
};

export const validateWeight = (value: string): ValidationResult => {
  const num = parseFloat(value);
  if (isNaN(num)) return { isValid: false, message: 'Please enter a valid number' };
  if (num < 20 || num > 300) return { isValid: false, message: 'Weight seems unusual. Please verify (20-300 kg)' };
  return { isValid: true, message: '' };
};

export const validateHeight = (value: string): ValidationResult => {
  const num = parseFloat(value);
  if (isNaN(num)) return { isValid: false, message: 'Please enter a valid number' };
  if (num < 100 || num > 250) return { isValid: false, message: 'Height seems unusual. Please verify (100-250 cm)' };
  return { isValid: true, message: '' };
};

export const validateAge = (value: string): ValidationResult => {
  const num = parseInt(value);
  if (isNaN(num)) return { isValid: false, message: 'Please enter a valid number' };
  if (num < 0 || num > 120) return { isValid: false, message: 'Age seems unusual. Please verify (0-120 years)' };
  return { isValid: true, message: '' };
};

export const validateBloodGlucose = (value: string): ValidationResult => {
  const num = parseFloat(value);
  if (isNaN(num)) return { isValid: false, message: 'Please enter a valid number' };
  if (num < 60 || num > 500) return { isValid: false, message: 'Value seems unusual. Normal range is 60-125 mg/dL' };
  return { isValid: true, message: '' };
};

export const validateCreatinine = (value: string): ValidationResult => {
  const num = parseFloat(value);
  if (isNaN(num)) return { isValid: false, message: 'Please enter a valid number' };
  if (num < 0.1 || num > 2.0) return { isValid: false, message: 'Value seems unusual. Normal range is 0.6-1.3 mg/dL' };
  return { isValid: true, message: '' };
};

export const validatePulmonaryFunction = (value: string): ValidationResult => {
  const num = parseFloat(value);
  if (isNaN(num)) return { isValid: false, message: 'Please enter a valid number' };
  if (num < 0 || num > 150) return { isValid: false, message: 'Value seems unusual. Normal range is 80-120%' };
  return { isValid: true, message: '' };
};
