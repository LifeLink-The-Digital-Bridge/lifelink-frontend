import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

export interface RecipientFormState {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  availability: string;
  setAvailability: (availability: string) => void;

  // Medical Details
  hemoglobinLevel: string;
  setHemoglobinLevel: (hemoglobinLevel: string) => void;
  bloodPressure: string;
  setBloodPressure: (bloodPressure: string) => void;
  diagnosis: string;
  setDiagnosis: (diagnosis: string) => void;
  allergies: string;
  setAllergies: (allergies: string) => void;
  currentMedications: string;
  setCurrentMedications: (currentMedications: string) => void;
  additionalNotes: string;
  setAdditionalNotes: (additionalNotes: string) => void;
  hasInfectiousDiseases: boolean;
  setHasInfectiousDiseases: (hasInfectiousDiseases: boolean) => void;
  infectiousDiseaseDetails: string;
  setInfectiousDiseaseDetails: (infectiousDiseaseDetails: string) => void;
  creatinineLevel: string;
  setCreatinineLevel: (creatinineLevel: string) => void;
  liverFunctionTests: string;
  setLiverFunctionTests: (liverFunctionTests: string) => void;
  cardiacStatus: string;
  setCardiacStatus: (cardiacStatus: string) => void;
  pulmonaryFunction: string;
  setPulmonaryFunction: (pulmonaryFunction: string) => void;
  overallHealthStatus: string;
  setOverallHealthStatus: (overallHealthStatus: string) => void;

  // Eligibility Criteria
  age: string;
  setAge: (age: string) => void;
  weight: string;
  setWeight: (weight: string) => void;
  height: string;
  setHeight: (height: string) => void;
  bodyMassIndex: string;
  setBodyMassIndex: (bodyMassIndex: string) => void;
  bodySize: string;
  setBodySize: (bodySize: string) => void;
  weightEligible: boolean;
  medicallyEligible: boolean;
  setMedicallyEligible: (medicallyEligible: boolean) => void;
  legalClearance: boolean;
  setLegalClearance: (legalClearance: boolean) => void;
  eligibilityNotes: string;
  setEligibilityNotes: (eligibilityNotes: string) => void;
  lastReviewed: string;
  setLastReviewed: (lastReviewed: string) => void;
  dob: string;
  setDob: (dob: string) => void;

  // Location
  addressLine: string;
  setAddressLine: (addressLine: string) => void;
  landmark: string;
  setLandmark: (landmark: string) => void;
  area: string;
  setArea: (area: string) => void;
  city: string;
  setCity: (city: string) => void;
  district: string;
  setDistrict: (district: string) => void;
  stateVal: string;
  setStateVal: (stateVal: string) => void;
  country: string;
  setCountry: (country: string) => void;
  pincode: string;
  setPincode: (pincode: string) => void;
  latitude: number | null;
  setLatitude: (latitude: number | null) => void;
  longitude: number | null;
  setLongitude: (longitude: number | null) => void;

  // Consent - Add missing consentedAt
  isConsented: boolean;
  setIsConsented: (isConsented: boolean) => void;
  consentedAt: string;
  setConsentedAt: (consentedAt: string) => void;

  // HLA Profile
  hlaA1: string;
  setHlaA1: (hlaA1: string) => void;
  hlaA2: string;
  setHlaA2: (hlaA2: string) => void;
  hlaB1: string;
  setHlaB1: (hlaB1: string) => void;
  hlaB2: string;
  setHlaB2: (hlaB2: string) => void;
  hlaC1: string;
  setHlaC1: (hlaC1: string) => void;
  hlaC2: string;
  setHlaC2: (hlaC2: string) => void;
  hlaDR1: string;
  setHlaDR1: (hlaDR1: string) => void;
  hlaDR2: string;
  setHlaDR2: (hlaDR2: string) => void;
  hlaDQ1: string;
  setHlaDQ1: (hlaDQ1: string) => void;
  hlaDQ2: string;
  setHlaDQ2: (hlaDQ2: string) => void;
  hlaDP1: string;
  setHlaDP1: (hlaDP1: string) => void;
  hlaDP2: string;
  setHlaDP2: (hlaDP2: string) => void;
  testingDate: string;
  setTestingDate: (testingDate: string) => void;
  testingMethod: string;
  setTestingMethod: (testingMethod: string) => void;
  laboratoryName: string;
  setLaboratoryName: (laboratoryName: string) => void;
  certificationNumber: string;
  setCertificationNumber: (certificationNumber: string) => void;

  userId: string | null;
  isFormValid: () => boolean;
}

const calculateBMI = (weight: number, height: number): number => {
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
};

const getBodySize = (bmi: number): string => {
  if (bmi < 18.5) return "SMALL";
  if (bmi >= 18.5 && bmi < 25) return "MEDIUM";
  return "LARGE";
};

export function useRecipientFormState(): RecipientFormState {
  const [loading, setLoading] = useState<boolean>(false);
  const [availability, setAvailability] = useState<string>("AVAILABLE");

  // Medical Details
  const [hemoglobinLevel, setHemoglobinLevel] = useState<string>("");
  const [bloodPressure, setBloodPressure] = useState<string>("");
  const [diagnosis, setDiagnosis] = useState<string>("");
  const [allergies, setAllergies] = useState<string>("");
  const [currentMedications, setCurrentMedications] = useState<string>("");
  const [additionalNotes, setAdditionalNotes] = useState<string>("");
  const [hasInfectiousDiseases, setHasInfectiousDiseases] = useState<boolean>(false);
  const [infectiousDiseaseDetails, setInfectiousDiseaseDetails] = useState<string>("");
  const [creatinineLevel, setCreatinineLevel] = useState<string>("");
  const [liverFunctionTests, setLiverFunctionTests] = useState<string>("Normal");
  const [cardiacStatus, setCardiacStatus] = useState<string>("Normal");
  const [pulmonaryFunction, setPulmonaryFunction] = useState<string>("");
  const [overallHealthStatus, setOverallHealthStatus] = useState<string>("");

  // Eligibility Criteria
  const [age, setAge] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [bodyMassIndex, setBodyMassIndex] = useState<string>("");
  const [bodySize, setBodySize] = useState<string>("MEDIUM");
  const [weightEligible, setWeightEligible] = useState<boolean>(false);
  const [medicallyEligible, setMedicallyEligible] = useState<boolean>(true);
  const [legalClearance, setLegalClearance] = useState<boolean>(true);
  const [eligibilityNotes, setEligibilityNotes] = useState<string>("");
  const [lastReviewed, setLastReviewed] = useState<string>("");
  const [dob, setDob] = useState<string>("");

  // Location
  const [addressLine, setAddressLine] = useState<string>("");
  const [landmark, setLandmark] = useState<string>("");
  const [area, setArea] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [stateVal, setStateVal] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [pincode, setPincode] = useState<string>("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  // Consent - Add missing state
  const [isConsented, setIsConsented] = useState<boolean>(false);
  const [consentedAt, setConsentedAt] = useState<string>("");

  // HLA Profile
  const [hlaA1, setHlaA1] = useState<string>("");
  const [hlaA2, setHlaA2] = useState<string>("");
  const [hlaB1, setHlaB1] = useState<string>("");
  const [hlaB2, setHlaB2] = useState<string>("");
  const [hlaC1, setHlaC1] = useState<string>("");
  const [hlaC2, setHlaC2] = useState<string>("");
  const [hlaDR1, setHlaDR1] = useState<string>("");
  const [hlaDR2, setHlaDR2] = useState<string>("");
  const [hlaDQ1, setHlaDQ1] = useState<string>("");
  const [hlaDQ2, setHlaDQ2] = useState<string>("");
  const [hlaDP1, setHlaDP1] = useState<string>("");
  const [hlaDP2, setHlaDP2] = useState<string>("");
  const [testingDate, setTestingDate] = useState<string>("");
  const [testingMethod, setTestingMethod] = useState<string>("NGS_SEQUENCING");
  const [laboratoryName, setLaboratoryName] = useState<string>("");
  const [certificationNumber, setCertificationNumber] = useState<string>("");

  const [userId, setUserId] = useState<string | null>(null);

  // Load data effect
  useEffect(() => {
    const loadData = async () => {
      try {
        const userIdFromStore = await SecureStore.getItemAsync("userId");
        setUserId(userIdFromStore);

        const data = await SecureStore.getItemAsync("recipientData");
        if (data) {
          const recipient = JSON.parse(data);
          setAvailability(recipient.availability || "AVAILABLE");

          if (recipient.medicalDetails) {
            setDiagnosis(recipient.medicalDetails.diagnosis || "");
            setAllergies(recipient.medicalDetails.allergies || "");
            setCurrentMedications(recipient.medicalDetails.currentMedications || "");
            setAdditionalNotes(recipient.medicalDetails.additionalNotes || "");
            setHemoglobinLevel(recipient.medicalDetails.hemoglobinLevel?.toString() || "");
            setBloodPressure(recipient.medicalDetails.bloodPressure || "");
            setCreatinineLevel(recipient.medicalDetails.creatinineLevel?.toString() || "");
            setLiverFunctionTests(recipient.medicalDetails.liverFunctionTests || "Normal");
            setCardiacStatus(recipient.medicalDetails.cardiacStatus || "Normal");
            setPulmonaryFunction(recipient.medicalDetails.pulmonaryFunction?.toString() || "");
            setOverallHealthStatus(recipient.medicalDetails.overallHealthStatus || "");
            setHasInfectiousDiseases(recipient.medicalDetails.hasInfectiousDiseases || false);
            setInfectiousDiseaseDetails(recipient.medicalDetails.infectiousDiseaseDetails || "");
          }

          if (recipient.eligibilityCriteria) {
            setMedicallyEligible(recipient.eligibilityCriteria.medicallyEligible ?? true);
            setLegalClearance(recipient.eligibilityCriteria.legalClearance ?? true);
            setEligibilityNotes(recipient.eligibilityCriteria.notes || "");
            setLastReviewed(recipient.eligibilityCriteria.lastReviewed || "");
            setAge(recipient.eligibilityCriteria.age?.toString() || "");
            setWeight(recipient.eligibilityCriteria.weight?.toString() || "");
            setHeight(recipient.eligibilityCriteria.height?.toString() || "");
            setBodyMassIndex(recipient.eligibilityCriteria.bodyMassIndex?.toString() || "");
            setBodySize(recipient.eligibilityCriteria.bodySize || "MEDIUM");
            setDob(recipient.eligibilityCriteria.dob || "");
          }

          const location = recipient.addresses?.[0] || recipient.location;
          if (location) {
            setAddressLine(location.addressLine || "");
            setLandmark(location.landmark || "");
            setArea(location.area || "");
            setCity(location.city || "");
            setDistrict(location.district || "");
            setStateVal(location.state || "");
            setCountry(location.country || "");
            setPincode(location.pincode || "");
            setLatitude(location.latitude || null);
            setLongitude(location.longitude || null);
          }

          if (recipient.hlaProfile) {
            setHlaA1(recipient.hlaProfile.hlaA1 || "");
            setHlaA2(recipient.hlaProfile.hlaA2 || "");
            setHlaB1(recipient.hlaProfile.hlaB1 || "");
            setHlaB2(recipient.hlaProfile.hlaB2 || "");
            setHlaC1(recipient.hlaProfile.hlaC1 || "");
            setHlaC2(recipient.hlaProfile.hlaC2 || "");
            setHlaDR1(recipient.hlaProfile.hlaDR1 || "");
            setHlaDR2(recipient.hlaProfile.hlaDR2 || "");
            setHlaDQ1(recipient.hlaProfile.hlaDQ1 || "");
            setHlaDQ2(recipient.hlaProfile.hlaDQ2 || "");
            setHlaDP1(recipient.hlaProfile.hlaDP1 || "");
            setHlaDP2(recipient.hlaProfile.hlaDP2 || "");
            setTestingDate(recipient.hlaProfile.testingDate || "");
            setTestingMethod(recipient.hlaProfile.testingMethod || "NGS_SEQUENCING");
            setLaboratoryName(recipient.hlaProfile.laboratoryName || "");
            setCertificationNumber(recipient.hlaProfile.certificationNumber || "");
          }

          // Load consent data
          if (recipient.consentForm) {
            setIsConsented(recipient.consentForm.isConsented || false);
            setConsentedAt(recipient.consentForm.consentedAt || "");
          }
        }
      } catch (e) {
        console.error("Error loading recipient data:", e);
      }
    };
    loadData();
  }, []);

  // BMI calculation effect
  useEffect(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (!isNaN(w) && !isNaN(h) && h > 0) {
      const bmi = calculateBMI(w, h);
      setBodyMassIndex(bmi.toFixed(1));
      setBodySize(getBodySize(bmi));
    }
    setWeightEligible(!isNaN(w) && w >= 45);
  }, [weight, height]);

  // Auto-set consentedAt when isConsented changes to true
  useEffect(() => {
    if (isConsented && !consentedAt) {
      setConsentedAt(new Date().toISOString());
    }
  }, [isConsented, consentedAt]);

  const isFormValid = (): boolean => {
    return !!(
      diagnosis &&
      addressLine &&
      city &&
      stateVal &&
      country &&
      pincode &&
      isConsented &&
      latitude !== null &&
      longitude !== null
    );
  };

  return {
    loading,
    setLoading,
    availability,
    setAvailability,
    hemoglobinLevel,
    setHemoglobinLevel,
    bloodPressure,
    setBloodPressure,
    diagnosis,
    setDiagnosis,
    allergies,
    setAllergies,
    currentMedications,
    setCurrentMedications,
    additionalNotes,
    setAdditionalNotes,
    hasInfectiousDiseases,
    setHasInfectiousDiseases,
    infectiousDiseaseDetails,
    setInfectiousDiseaseDetails,
    creatinineLevel,
    setCreatinineLevel,
    liverFunctionTests,
    setLiverFunctionTests,
    cardiacStatus,
    setCardiacStatus,
    pulmonaryFunction,
    setPulmonaryFunction,
    overallHealthStatus,
    setOverallHealthStatus,
    age,
    setAge,
    weight,
    setWeight,
    height,
    setHeight,
    bodyMassIndex,
    setBodyMassIndex,
    bodySize,
    setBodySize,
    weightEligible,
    medicallyEligible,
    setMedicallyEligible,
    legalClearance,
    setLegalClearance,
    eligibilityNotes,
    setEligibilityNotes,
    lastReviewed,
    setLastReviewed,
    dob,
    setDob,
    addressLine,
    setAddressLine,
    landmark,
    setLandmark,
    area,
    setArea,
    city,
    setCity,
    district,
    setDistrict,
    stateVal,
    setStateVal,
    country,
    setCountry,
    pincode,
    setPincode,
    latitude,
    setLatitude,
    longitude,
    setLongitude,
    hlaA1,
    setHlaA1,
    hlaA2,
    setHlaA2,
    hlaB1,
    setHlaB1,
    hlaB2,
    setHlaB2,
    hlaC1,
    setHlaC1,
    hlaC2,
    setHlaC2,
    hlaDR1,
    setHlaDR1,
    hlaDR2,
    setHlaDR2,
    hlaDQ1,
    setHlaDQ1,
    hlaDQ2,
    setHlaDQ2,
    hlaDP1,
    setHlaDP1,
    hlaDP2,
    setHlaDP2,
    testingDate,
    setTestingDate,
    testingMethod,
    setTestingMethod,
    laboratoryName,
    setLaboratoryName,
    certificationNumber,
    setCertificationNumber,
    isConsented,
    setIsConsented,
    consentedAt,
    setConsentedAt,
    userId,
    isFormValid,
  };
}
