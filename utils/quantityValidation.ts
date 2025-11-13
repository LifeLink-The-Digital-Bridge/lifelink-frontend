export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export const validateBloodQuantity = (value: string): ValidationResult => {
  const num = parseFloat(value);
  if (isNaN(num)) return { isValid: false, message: 'Please enter a valid number' };
  if (num <= 0) return { isValid: false, message: 'Quantity must be greater than 0' };
  if (num > 0.5) return { isValid: false, message: 'Blood donation limit is 0.5 liters per session' };
  return { isValid: true, message: '' };
};

export const validateOrganWeight = (value: string, organType: string): ValidationResult => {
  const num = parseFloat(value);
  if (isNaN(num)) return { isValid: false, message: 'Please enter a valid number' };
  if (num <= 0) return { isValid: false, message: 'Weight must be greater than 0' };
  
  const limits: { [key: string]: { min: number; max: number } } = {
    HEART: { min: 200, max: 500 },
    LIVER: { min: 1000, max: 2000 },
    KIDNEY: { min: 120, max: 200 },
    LUNG: { min: 400, max: 1000 },
    PANCREAS: { min: 70, max: 150 },
    INTESTINE: { min: 800, max: 1500 }
  };
  
  const limit = limits[organType];
  if (limit && (num < limit.min || num > limit.max)) {
    return { isValid: false, message: `${organType.toLowerCase()} weight should be ${limit.min}-${limit.max}g` };
  }
  return { isValid: true, message: '' };
};

export const validateTissueQuantity = (value: string, tissueType: string): ValidationResult => {
  const num = parseFloat(value);
  if (isNaN(num)) return { isValid: false, message: 'Please enter a valid number' };
  if (num <= 0) return { isValid: false, message: 'Quantity must be greater than 0' };
  
  const limits: { [key: string]: { max: number; unit: string } } = {
    BONE: { max: 500, unit: 'grams' },
    SKIN: { max: 2000, unit: 'cm²' },
    CORNEA: { max: 2, unit: 'units' },
    VEIN: { max: 100, unit: 'cm' },
    TENDON: { max: 50, unit: 'cm' },
    LIGAMENT: { max: 30, unit: 'cm' }
  };
  
  const limit = limits[tissueType];
  if (limit && num > limit.max) {
    return { isValid: false, message: `Max ${limit.max} ${limit.unit} for ${tissueType.toLowerCase()}` };
  }
  return { isValid: true, message: '' };
};

export const validateStemCellQuantity = (value: string): ValidationResult => {
  const num = parseFloat(value);
  if (isNaN(num)) return { isValid: false, message: 'Please enter a valid number' };
  if (num <= 0) return { isValid: false, message: 'Quantity must be greater than 0' };
  if (num < 2) return { isValid: false, message: 'Minimum 2 million cells required' };
  if (num > 10) return { isValid: false, message: 'Maximum 10 million cells per donation' };
  return { isValid: true, message: '' };
};
