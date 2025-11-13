export interface FieldError {
  [key: string]: string;
}

export interface TouchedFields {
  [key: string]: boolean;
}

export const validateRequired = (value: string, fieldName: string): string => {
  if (!value || value.trim() === '') {
    return `${fieldName} is required`;
  }
  return '';
};

export const handleBlur = (
  fieldName: string,
  value: string,
  touched: TouchedFields,
  setTouched: (touched: TouchedFields) => void,
  validator?: (value: string) => { isValid: boolean; message: string }
): void => {
  setTouched({ ...touched, [fieldName]: true });
};
