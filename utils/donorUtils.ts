// utils/donorUtils.ts
export const calculateAge = (dobString: string): number => {
  const today = new Date();
  const dob = new Date(dobString);
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};

export const calculateBMI = (weight: number, height: number): number => {
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
};

export const getBodySize = (bmi: number): string => {
  if (bmi < 18.5) return "SMALL";
  if (bmi >= 18.5 && bmi < 25) return "MEDIUM";
  return "LARGE";
};
