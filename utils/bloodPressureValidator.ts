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

  if (systolic < 60 || systolic > 250) {
    return { 
      isValid: false, 
      message: 'Systolic must be between 60-250 mmHg',
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

  return { 
    isValid: true, 
    message: 'Valid blood pressure',
    systolic,
    diastolic
  };
};

export const getBloodPressureCategory = (systolic: number, diastolic: number): string => {
  if (systolic < 90 || diastolic < 60) {
    return 'Low';
  } else if (systolic < 120 && diastolic < 80) {
    return 'Normal';
  } else if (systolic >= 120 && systolic < 130 && diastolic < 80) {
    return 'Elevated';
  } else if ((systolic >= 130 && systolic < 140) || (diastolic >= 80 && diastolic < 90)) {
    return 'Hypertension Stage 1';
  } else if (systolic >= 140 || diastolic >= 90) {
    return 'Hypertension Stage 2';
  } else if (systolic > 180 || diastolic > 120) {
    return 'Hypertensive Crisis';
  }
  return 'Normal';
};
