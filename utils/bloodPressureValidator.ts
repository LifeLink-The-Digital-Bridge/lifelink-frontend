export const validateBloodPressure = (bloodPressure: string): { 
  isValid: boolean; 
  message: string;
  systolic?: number;
  diastolic?: number;
} => {
  if (!bloodPressure || bloodPressure.trim() === '') {
    return { 
      isValid: false, 
      message: 'Blood pressure is required' 
    };
  }

  const bpPattern = /^\d{1,3}\/\d{1,3}$/;
  
  if (!bpPattern.test(bloodPressure.trim())) {
    return { 
      isValid: false, 
      message: 'Format must be systolic/diastolic (e.g., 120/80)' 
    };
  }

  const parts = bloodPressure.trim().split('/');
  const systolic = parseInt(parts[0], 10);
  const diastolic = parseInt(parts[1], 10);

  if (isNaN(systolic) || isNaN(diastolic)) {
    return { 
      isValid: false, 
      message: 'Blood pressure values must be valid numbers' 
    };
  }

  if (systolic < 70 || systolic > 250) {
    return { 
      isValid: false, 
      message: 'Systolic must be between 70-250 mmHg',
      systolic,
      diastolic
    };
  }

  if (diastolic < 40 || diastolic > 150) {
    return { 
      isValid: false, 
      message: 'Diastolic must be between 40-150 mmHg',
      systolic,
      diastolic
    };
  }

  if (systolic <= diastolic) {
    return { 
      isValid: false, 
      message: 'Systolic must be greater than diastolic',
      systolic,
      diastolic
    };
  }

  const pulsePressure = systolic - diastolic;
  if (pulsePressure < 20) {
    return { 
      isValid: false, 
      message: 'Pulse pressure too narrow (difference should be at least 20 mmHg)',
      systolic,
      diastolic
    };
  }

  if (pulsePressure > 100) {
    return { 
      isValid: false, 
      message: 'Pulse pressure too wide (difference should not exceed 100 mmHg)',
      systolic,
      diastolic
    };
  }

  return { 
    isValid: true, 
    message: 'Valid blood pressure',
    systolic,
    diastolic
  };
};

export const getBloodPressureCategory = (systolic: number, diastolic: number): string => {
  if (systolic > 180 || diastolic > 120) {
    return 'Hypertensive Crisis';
  }
  
  if (systolic >= 140 || diastolic >= 90) {
    return 'Hypertension Stage 2';
  }
  
  if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
    return 'Hypertension Stage 1';
  }
  
  if (systolic >= 120 && systolic <= 129 && diastolic < 80) {
    return 'Elevated';
  }
  
  if (systolic < 120 && diastolic < 80) {
    if (systolic < 90 || diastolic < 60) {
      return 'Low';
    }
    return 'Normal';
  }
  
  return 'Normal';
};

export const getBloodPressureCategoryWithColor = (systolic: number, diastolic: number): {
  category: string;
  color: string;
  severity: 'low' | 'normal' | 'elevated' | 'high' | 'critical';
  recommendation: string;
} => {
  if (systolic > 180 || diastolic > 120) {
    return {
      category: 'Hypertensive Crisis',
      color: '#8B0000',
      severity: 'critical',
      recommendation: 'Seek immediate medical attention'
    };
  }
  
  if (systolic >= 140 || diastolic >= 90) {
    return {
      category: 'Hypertension Stage 2',
      color: '#DC143C',
      severity: 'high',
      recommendation: 'Consult your doctor about medication'
    };
  }
  
  if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
    return {
      category: 'Hypertension Stage 1',
      color: '#FF6347',
      severity: 'high',
      recommendation: 'Lifestyle changes and possible medication'
    };
  }
  
  if (systolic >= 120 && systolic <= 129 && diastolic < 80) {
    return {
      category: 'Elevated',
      color: '#FFA500',
      severity: 'elevated',
      recommendation: 'Adopt healthier lifestyle habits'
    };
  }
  
  if (systolic < 90 || diastolic < 60) {
    return {
      category: 'Low',
      color: '#4682B4',
      severity: 'low',
      recommendation: 'May cause dizziness. Consult doctor if symptomatic'
    };
  }
  
  if (systolic < 120 && diastolic < 80) {
    return {
      category: 'Normal',
      color: '#228B22',
      severity: 'normal',
      recommendation: 'Maintain healthy lifestyle'
    };
  }
  
  return {
    category: 'Normal',
    color: '#228B22',
    severity: 'normal',
    recommendation: 'Maintain healthy lifestyle'
  };
};
