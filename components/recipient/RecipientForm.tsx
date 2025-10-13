import React from "react";
import { ScrollView } from "react-native";
import { useTheme } from "../../utils/theme-context";
import { lightTheme, darkTheme } from "../../constants/styles/authStyles";
import { createUnifiedStyles } from "../../constants/styles/unifiedStyles";

import { MedicalDetails } from "./MedicalDetails";
import { EligibilityCriteria } from "./EligibilityCriteria";
import { LocationDetails } from "./LocationDetails";
import { HlaProfile } from "./HlaProfile";
import { ConsentForm } from "./ConsentForm";

export interface RecipientFormProps {
  hemoglobinLevel: string;
  setHemoglobinLevel: (value: string) => void;
  bloodPressure: string;
  setBloodPressure: (value: string) => void;
  diagnosis: string;
  setDiagnosis: (value: string) => void;
  allergies: string;
  setAllergies: (value: string) => void;
  currentMedications: string;
  setCurrentMedications: (value: string) => void;
  additionalNotes: string;
  setAdditionalNotes: (value: string) => void;
  hasInfectiousDiseases: boolean;
  setHasInfectiousDiseases: (value: boolean) => void;
  infectiousDiseaseDetails: string;
  setInfectiousDiseaseDetails: (value: string) => void;
  creatinineLevel: string;
  setCreatinineLevel: (value: string) => void;
  liverFunctionTests: string;
  setLiverFunctionTests: (value: string) => void;
  cardiacStatus: string;
  setCardiacStatus: (value: string) => void;
  pulmonaryFunction: string;
  setPulmonaryFunction: (value: string) => void;
  overallHealthStatus: string;
  setOverallHealthStatus: (value: string) => void;

  age: string;
  setAge: (value: string) => void;
  weight: string;
  setWeight: (value: string) => void;
  height: string;
  setHeight: (value: string) => void;
  bodyMassIndex: string;
  setBodyMassIndex: (value: string) => void;
  bodySize: string;
  setBodySize: (value: string) => void;
  weightEligible: boolean;
  medicallyEligible: boolean;
  setMedicallyEligible: (value: boolean) => void;
  legalClearance: boolean;
  setLegalClearance: (value: boolean) => void;
  eligibilityNotes: string;
  setEligibilityNotes: (value: string) => void;
  lastReviewed: string;
  setLastReviewed: (value: string) => void;

  isConsented: boolean;
  setIsConsented: (value: boolean) => void;
  consentedAt: string;
  setConsentedAt: (consentedAt: string) => void;

  addressLine: string;
  setAddressLine: (value: string) => void;
  landmark: string;
  setLandmark: (value: string) => void;
  area: string;
  setArea: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  district: string;
  setDistrict: (value: string) => void;
  stateVal: string;
  setStateVal: (value: string) => void;
  country: string;
  setCountry: (value: string) => void;
  pincode: string;
  setPincode: (value: string) => void;
  latitude: number | null;
  longitude: number | null;
  onLocationPress: () => void;
  onResetLocation?: () => void;
  manualLocationSet?: boolean;

  hlaA1: string;
  setHlaA1: (value: string) => void;
  hlaA2: string;
  setHlaA2: (value: string) => void;
  hlaB1: string;
  setHlaB1: (value: string) => void;
  hlaB2: string;
  setHlaB2: (value: string) => void;
  hlaC1: string;
  setHlaC1: (value: string) => void;
  hlaC2: string;
  setHlaC2: (value: string) => void;
  hlaDR1: string;
  setHlaDR1: (value: string) => void;
  hlaDR2: string;
  setHlaDR2: (value: string) => void;
  hlaDQ1: string;
  setHlaDQ1: (value: string) => void;
  hlaDQ2: string;
  setHlaDQ2: (value: string) => void;
  hlaDP1: string;
  setHlaDP1: (value: string) => void;
  hlaDP2: string;
  setHlaDP2: (value: string) => void;
  testingDate: string;
  setTestingDate: (value: string) => void;
  testingMethod: string;
  setTestingMethod: (value: string) => void;
  laboratoryName: string;
  setLaboratoryName: (value: string) => void;
  certificationNumber: string;
  setCertificationNumber: (value: string) => void;

  isFormValid: () => boolean;
}

export const RecipientForm: React.FC<RecipientFormProps> = (props) => {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  return (
    <>
      <MedicalDetails
        hemoglobinLevel={props.hemoglobinLevel}
        setHemoglobinLevel={props.setHemoglobinLevel}
        bloodPressure={props.bloodPressure}
        setBloodPressure={props.setBloodPressure}
        diagnosis={props.diagnosis}
        setDiagnosis={props.setDiagnosis}
        allergies={props.allergies}
        setAllergies={props.setAllergies}
        currentMedications={props.currentMedications}
        setCurrentMedications={props.setCurrentMedications}
        additionalNotes={props.additionalNotes}
        setAdditionalNotes={props.setAdditionalNotes}
        hasInfectiousDiseases={props.hasInfectiousDiseases}
        setHasInfectiousDiseases={props.setHasInfectiousDiseases}
        infectiousDiseaseDetails={props.infectiousDiseaseDetails}
        setInfectiousDiseaseDetails={props.setInfectiousDiseaseDetails}
        creatinineLevel={props.creatinineLevel}
        setCreatinineLevel={props.setCreatinineLevel}
        liverFunctionTests={props.liverFunctionTests}
        setLiverFunctionTests={props.setLiverFunctionTests}
        cardiacStatus={props.cardiacStatus}
        setCardiacStatus={props.setCardiacStatus}
        pulmonaryFunction={props.pulmonaryFunction}
        setPulmonaryFunction={props.setPulmonaryFunction}
        overallHealthStatus={props.overallHealthStatus}
        setOverallHealthStatus={props.setOverallHealthStatus}
      />

      <EligibilityCriteria
        age={props.age}
        setAge={props.setAge}
        weight={props.weight}
        setWeight={props.setWeight}
        height={props.height}
        setHeight={props.setHeight}
        bodyMassIndex={props.bodyMassIndex}
        bodySize={props.bodySize}
        setBodySize={props.setBodySize}
        weightEligible={props.weightEligible}
        medicallyEligible={props.medicallyEligible}
        setMedicallyEligible={props.setMedicallyEligible}
        legalClearance={props.legalClearance}
        setLegalClearance={props.setLegalClearance}
        eligibilityNotes={props.eligibilityNotes}
        setEligibilityNotes={props.setEligibilityNotes}
        lastReviewed={props.lastReviewed}
        setLastReviewed={props.setLastReviewed}
      />

      <LocationDetails
        addressLine={props.addressLine}
        setAddressLine={props.setAddressLine}
        landmark={props.landmark}
        setLandmark={props.setLandmark}
        area={props.area}
        setArea={props.setArea}
        city={props.city}
        setCity={props.setCity}
        district={props.district}
        setDistrict={props.setDistrict}
        stateVal={props.stateVal}
        setStateVal={props.setStateVal}
        country={props.country}
        setCountry={props.setCountry}
        pincode={props.pincode}
        setPincode={props.setPincode}
        latitude={props.latitude}
        longitude={props.longitude}
        onLocationPress={props.onLocationPress}
        onResetLocation={props.onResetLocation}
        manualLocationSet={props.manualLocationSet}
      />

      <HlaProfile
        hlaA1={props.hlaA1}
        setHlaA1={props.setHlaA1}
        hlaA2={props.hlaA2}
        setHlaA2={props.setHlaA2}
        hlaB1={props.hlaB1}
        setHlaB1={props.setHlaB1}
        hlaB2={props.hlaB2}
        setHlaB2={props.setHlaB2}
        hlaC1={props.hlaC1}
        setHlaC1={props.setHlaC1}
        hlaC2={props.hlaC2}
        setHlaC2={props.setHlaC2}
        hlaDR1={props.hlaDR1}
        setHlaDR1={props.setHlaDR1}
        hlaDR2={props.hlaDR2}
        setHlaDR2={props.setHlaDR2}
        hlaDQ1={props.hlaDQ1}
        setHlaDQ1={props.setHlaDQ1}
        hlaDQ2={props.hlaDQ2}
        setHlaDQ2={props.setHlaDQ2}
        hlaDP1={props.hlaDP1}
        setHlaDP1={props.setHlaDP1}
        hlaDP2={props.hlaDP2}
        setHlaDP2={props.setHlaDP2}
        testingDate={props.testingDate}
        setTestingDate={props.setTestingDate}
        testingMethod={props.testingMethod}
        setTestingMethod={props.setTestingMethod}
        laboratoryName={props.laboratoryName}
        setLaboratoryName={props.setLaboratoryName}
        certificationNumber={props.certificationNumber}
        setCertificationNumber={props.setCertificationNumber}
      />

      <ConsentForm
        isConsented={props.isConsented}
        setIsConsented={props.setIsConsented}
        consentedAt={props.consentedAt}
        setConsentedAt={props.setConsentedAt}
      />
    </>
  );
};
