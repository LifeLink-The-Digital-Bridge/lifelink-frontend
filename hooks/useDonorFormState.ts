import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { useLocalSearchParams } from "expo-router";

const calculateAge = (dobString: string): number => {
  const today = new Date();
  const dob = new Date(dobString);
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};

const calculateBMI = (weight: number, height: number): number => {
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
};

const getBodySize = (bmi: number): string => {
  if (bmi < 18.5) return "SMALL";
  if (bmi >= 18.5 && bmi < 25) return "MEDIUM";
  return "LARGE";
};

export function useDonorFormState() {
  const params = useLocalSearchParams();

  const [hemoglobinLevel, setHemoglobinLevel] = useState<string>("");
  const [bloodPressure, setBloodPressure] = useState<string>("");
  const [bloodGlucoseLevel, setBloodGlucoseLevel] = useState<string>('');
  const [hasDiabetes, setHasDiabetes] = useState<boolean>(false);

  const [hasDiseases, setHasDiseases] = useState<boolean>(false);
  const [diseaseDescription, setDiseaseDescription] = useState<string>("");
  const [takingMedication, setTakingMedication] = useState<boolean>(false);
  const [currentMedications, setCurrentMedications] = useState<string>("");
  const [lastMedicalCheckup, setLastMedicalCheckup] = useState<string>("");
  const [medicalHistory, setMedicalHistory] = useState<string>(
    "No significant medical history"
  );
  const [hasInfectiousDiseases, setHasInfectiousDiseases] =
    useState<boolean>(false);
  const [infectiousDiseaseDetails, setInfectiousDiseaseDetails] =
    useState<string>("");
  const [creatinineLevel, setCreatinineLevel] = useState<string>("");
  const [liverFunctionTests, setLiverFunctionTests] =
    useState<string>("Normal");
  const [cardiacStatus, setCardiacStatus] = useState<string>("Normal");
  const [pulmonaryFunction, setPulmonaryFunction] = useState<string>("");
  const [overallHealthStatus, setOverallHealthStatus] =
    useState<string>("Excellent");

  const [dob, setDob] = useState<string>("");
  const [age, setAge] = useState<number | null>(null);
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [bodyMassIndex, setBodyMassIndex] = useState<string>("");
  const [bodySize, setBodySize] = useState<string>("MEDIUM");
  const [isLivingDonor, setIsLivingDonor] = useState<boolean>(true);
  const [weightEligible, setWeightEligible] = useState<boolean>(false);
  const [medicalClearance, setMedicalClearance] = useState<boolean>(false);
  const [recentTattooOrPiercing, setRecentTattooOrPiercing] =
    useState<boolean>(false);
  const [recentTravelDetails, setRecentTravelDetails] =
    useState<string>("No recent travel");
  const [recentVaccination, setRecentVaccination] = useState<boolean>(false);
  const [recentSurgery, setRecentSurgery] = useState<boolean>(false);
  const [chronicDiseases, setChronicDiseases] = useState<string>("");
  const [allergies, setAllergies] = useState<string>("");
  const [lastDonationDate, setLastDonationDate] = useState<string>("");

  const [isConsented, setIsConsented] = useState<boolean>(false);

  const [addressLine, setAddressLine] = useState<string>("");
  const [landmark, setLandmark] = useState<string>("");
  const [area, setArea] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [stateVal, setStateVal] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [pincode, setPincode] = useState<string>("");
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [gender, setGender] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
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
  const [addressId, setAddressId] = useState<string | null>(null);

  useEffect(() => {
    const loadDonorData = async () => {
      try {
        const storedData = await SecureStore.getItemAsync("donorData");
        const hasManualLocation = location !== null;
        const hasFormData = addressLine || hemoglobinLevel || bloodPressure || bloodGlucoseLevel || hasDiabetes;
        if (storedData && !hasManualLocation && !hasFormData) {
          console.log("📂 Loading existing donor data from storage");
          const donor = JSON.parse(storedData);
          if (donor.medicalDetails) {
            setHemoglobinLevel(
              donor.medicalDetails.hemoglobinLevel?.toString() || ""
            );
            setBloodGlucoseLevel(donor.medicalDetails.bloodGlucoseLevel?.toString() || "");
            setHasDiabetes(donor.medicalDetails.hasDiabetes || false);
            setBloodPressure(donor.medicalDetails.bloodPressure || "");
            setHasDiseases(donor.medicalDetails.hasDiseases || false);
            setDiseaseDescription(
              donor.medicalDetails.diseaseDescription || ""
            );
            setTakingMedication(donor.medicalDetails.takingMedication || false);
            setCurrentMedications(
              donor.medicalDetails.currentMedications || ""
            );
            setLastMedicalCheckup(
              donor.medicalDetails.lastMedicalCheckup || ""
            );
            setMedicalHistory(
              donor.medicalDetails.medicalHistory ||
              "No significant medical history"
            );
            setHasInfectiousDiseases(
              donor.medicalDetails.hasInfectiousDiseases || false
            );
            setInfectiousDiseaseDetails(
              donor.medicalDetails.infectiousDiseaseDetails || ""
            );
            setCreatinineLevel(
              donor.medicalDetails.creatinineLevel?.toString() || ""
            );
            setLiverFunctionTests(
              donor.medicalDetails.liverFunctionTests || "Normal"
            );
            setCardiacStatus(donor.medicalDetails.cardiacStatus || "Normal");
            setPulmonaryFunction(
              donor.medicalDetails.pulmonaryFunction?.toString() || ""
            );
            setOverallHealthStatus(
              donor.medicalDetails.overallHealthStatus || "Excellent"
            );
          }
          if (donor.eligibilityCriteria) {
            setWeight(donor.eligibilityCriteria.weight?.toString() || "");
            setHeight(donor.eligibilityCriteria.height?.toString() || "");
            setBodyMassIndex(
              donor.eligibilityCriteria.bodyMassIndex?.toString() || ""
            );
            setBodySize(donor.eligibilityCriteria.bodySize || "MEDIUM");
            setIsLivingDonor(donor.eligibilityCriteria.isLivingDonor ?? true);
            setMedicalClearance(
              donor.eligibilityCriteria.medicalClearance || false
            );
            setRecentTattooOrPiercing(
              donor.eligibilityCriteria.recentTattooOrPiercing || false
            );
            setRecentTravelDetails(
              donor.eligibilityCriteria.recentTravelDetails ||
              "No recent travel"
            );
            setRecentVaccination(
              donor.eligibilityCriteria.recentVaccination || false
            );
            setRecentSurgery(donor.eligibilityCriteria.recentSurgery || false);
            setChronicDiseases(donor.eligibilityCriteria.chronicDiseases || "");
            setAllergies(donor.eligibilityCriteria.allergies || "");
            setLastDonationDate(
              donor.eligibilityCriteria.lastDonationDate || ""
            );
          }
          if (donor.consentForm) {
            setIsConsented(donor.consentForm.isConsented || false);
          }
          if (donor.addresses?.length > 0) {
            const address = donor.addresses[0];
            setAddressId(address.id);
            setAddressLine(address.addressLine || "");
            setLandmark(address.landmark || "");
            setArea(address.area || "");
            setDistrict(address.district || "");
            setCity(address.city || "");
            setStateVal(address.state || "");
            setCountry(address.country || "");
            setPincode(address.pincode || "");
            if (address.latitude && address.longitude) {
              setLocation({
                latitude: address.latitude,
                longitude: address.longitude,
              });
            }
          } else if (donor.location) {
            setAddressLine(donor.location.addressLine || "");
            setLandmark(donor.location.landmark || "");
            setArea(donor.location.area || "");
            setDistrict(donor.location.district || "");
            setCity(donor.location.city || "");
            setStateVal(donor.location.state || "");
            setCountry(donor.location.country || "");
            setPincode(donor.location.pincode || "");
            if (donor.location.latitude && donor.location.longitude) {
              setLocation({
                latitude: donor.location.latitude,
                longitude: donor.location.longitude,
              });
            }
          }
          if (donor.hlaProfile) {
            setHlaA1(donor.hlaProfile.hlaA1 || "");
            setHlaA2(donor.hlaProfile.hlaA2 || "");
            setHlaB1(donor.hlaProfile.hlaB1 || "");
            setHlaB2(donor.hlaProfile.hlaB2 || "");
            setHlaC1(donor.hlaProfile.hlaC1 || "");
            setHlaC2(donor.hlaProfile.hlaC2 || "");
            setHlaDR1(donor.hlaProfile.hlaDR1 || "");
            setHlaDR2(donor.hlaProfile.hlaDR2 || "");
            setHlaDQ1(donor.hlaProfile.hlaDQ1 || "");
            setHlaDQ2(donor.hlaProfile.hlaDQ2 || "");
            setHlaDP1(donor.hlaProfile.hlaDP1 || "");
            setHlaDP2(donor.hlaProfile.hlaDP2 || "");
            setTestingDate(donor.hlaProfile.testingDate || "");
            setTestingMethod(
              donor.hlaProfile.testingMethod || "NGS_SEQUENCING"
            );
            setLaboratoryName(donor.hlaProfile.laboratoryName || "");
            setCertificationNumber(donor.hlaProfile.certificationNumber || "");
          }
        } else {
          console.log(
            "⚠️ DONOR: Database load SKIPPED - manual location or form data exists"
          );
        }
      } catch (error) {
        console.error("Error loading donor data:", error);
      }
    };
    loadDonorData();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [storedGender, storedUserId] = await Promise.all([
          SecureStore.getItemAsync("gender"),
          SecureStore.getItemAsync("userId"),
        ]);
        if (storedGender) setGender(storedGender);
        if (storedUserId) setUserId(storedUserId);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchDob = async () => {
      try {
        const storedDob = await SecureStore.getItemAsync("dob");
        if (storedDob) {
          setDob(storedDob);
          setAge(calculateAge(storedDob));
        }
      } catch (error) {
        console.error("Error fetching DOB:", error);
      }
    };
    fetchDob();
  }, []);

  useEffect(() => {
    if (params.latitude && params.longitude) {
      setLocation({
        latitude: Number(params.latitude),
        longitude: Number(params.longitude),
      });
    }
  }, [params.latitude, params.longitude]);

  useEffect(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (!isNaN(w) && !isNaN(h) && h > 0) {
      const bmi = calculateBMI(w, h);
      setBodyMassIndex(bmi.toFixed(1));
      setBodySize(getBodySize(bmi));
    }
    setWeightEligible(!isNaN(w) && w >= 50);
  }, [weight, height]);

  const isFormValid = (): boolean => {
    return !!(
      hemoglobinLevel &&
      bloodPressure &&
      bloodGlucoseLevel &&
      weight &&
      height &&
      creatinineLevel &&
      liverFunctionTests &&
      cardiacStatus &&
      pulmonaryFunction &&
      overallHealthStatus &&
      lastMedicalCheckup &&
      medicalHistory &&
      isConsented &&
      addressLine &&
      landmark &&
      area &&
      district &&
      city &&
      stateVal &&
      country &&
      pincode
    );
  };

  return {
    hemoglobinLevel,
    setHemoglobinLevel,
    bloodPressure,
    setBloodPressure,
    bloodGlucoseLevel,
    setBloodGlucoseLevel,
    hasDiabetes,
    setHasDiabetes,
    hasDiseases,
    setHasDiseases,
    diseaseDescription,
    setDiseaseDescription,
    takingMedication,
    setTakingMedication,
    currentMedications,
    setCurrentMedications,
    lastMedicalCheckup,
    setLastMedicalCheckup,
    medicalHistory,
    setMedicalHistory,
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

    dob,
    age,
    weight,
    setWeight,
    weightEligible,
    height,
    setHeight,
    bodyMassIndex,
    bodySize,
    setBodySize,
    isLivingDonor,
    setIsLivingDonor,
    medicalClearance,
    setMedicalClearance,
    recentTattooOrPiercing,
    setRecentTattooOrPiercing,
    recentTravelDetails,
    setRecentTravelDetails,
    recentVaccination,
    setRecentVaccination,
    recentSurgery,
    setRecentSurgery,
    chronicDiseases,
    setChronicDiseases,
    allergies,
    setAllergies,
    lastDonationDate,
    setLastDonationDate,

    isConsented,
    setIsConsented,

    addressId,
    setAddressId,
    addressLine,
    setAddressLine,
    landmark,
    setLandmark,
    area,
    setArea,
    district,
    setDistrict,
    city,
    setCity,
    stateVal,
    setStateVal,
    country,
    setCountry,
    pincode,
    setPincode,
    location,
    setLocation,

    gender,
    userId,
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
    isFormValid,
  };
}
