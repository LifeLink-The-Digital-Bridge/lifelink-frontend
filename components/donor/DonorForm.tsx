import React from 'react';
import { ScrollView } from 'react-native';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { createUnifiedStyles } from '../../constants/styles/unifiedStyles';

import { MedicalDetails } from './MedicalDetails';
import { EligibilityCriteria } from './EligibilityCriteria';
import { ConsentForm } from './ConsentForm';
import { LocationDetails } from './LocationDetails';
import { HlaProfile } from "./HlaProfile";

export interface DonorFormProps {
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
  
  hemoglobinLevel: string;
  setHemoglobinLevel: (value: string) => void;
  bloodPressure: string;
  setBloodPressure: (value: string) => void;
  hasDiseases: boolean;
  setHasDiseases: (value: boolean) => void;
  diseaseDescription: string;
  setDiseaseDescription: (value: string) => void;
  takingMedication: boolean;
  setTakingMedication: (value: boolean) => void;
  currentMedications: string;
  setCurrentMedications: (value: string) => void;
  lastMedicalCheckup: string;
  setLastMedicalCheckup: (value: string) => void;
  medicalHistory: string;
  setMedicalHistory: (value: string) => void;
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
  gender: string;

  dob: string;
  age: number | null;
  weight: string;
  setWeight: (value: string) => void;
  weightEligible: boolean;
  height: string;
  setHeight: (value: string) => void;
  bodyMassIndex: string;
  bodySize: string;
  setBodySize: (value: string) => void;
  isLivingDonor: boolean;
  setIsLivingDonor: (value: boolean) => void;
  medicalClearance: boolean;
  setMedicalClearance: (value: boolean) => void;
  recentTattooOrPiercing: boolean;
  setRecentTattooOrPiercing: (value: boolean) => void;
  recentTravelDetails: string;
  setRecentTravelDetails: (value: string) => void;
  recentVaccination: boolean;
  setRecentVaccination: (value: boolean) => void;
  recentSurgery: boolean;
  setRecentSurgery: (value: boolean) => void;
  chronicDiseases: string;
  setChronicDiseases: (value: string) => void;
  allergies: string;
  setAllergies: (value: string) => void;
  lastDonationDate: string;
  setLastDonationDate: (value: string) => void;

  isConsented: boolean;
  setIsConsented: (value: boolean) => void;

  addressLine: string;
  setAddressLine: (value: string) => void;
  landmark: string;
  setLandmark: (value: string) => void;
  area: string;
  setArea: (value: string) => void;
  district: string;
  setDistrict: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  stateVal: string;
  setStateVal: (value: string) => void;
  country: string;
  setCountry: (value: string) => void;
  pincode: string;
  setPincode: (value: string) => void;
  location: { latitude: number; longitude: number } | null;
  onLocationPress: () => void;

  userId?: string;
  isFormValid: () => boolean;
}

export const DonorForm: React.FC<DonorFormProps> = (props) => {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  return (
    <>
      <MedicalDetails
        hemoglobinLevel={props.hemoglobinLevel}
        setHemoglobinLevel={props.setHemoglobinLevel}
        bloodPressure={props.bloodPressure}
        setBloodPressure={props.setBloodPressure}
        hasDiseases={props.hasDiseases}
        setHasDiseases={props.setHasDiseases}
        diseaseDescription={props.diseaseDescription}
        setDiseaseDescription={props.setDiseaseDescription}
        takingMedication={props.takingMedication}
        setTakingMedication={props.setTakingMedication}
        currentMedications={props.currentMedications}
        setCurrentMedications={props.setCurrentMedications}
        lastMedicalCheckup={props.lastMedicalCheckup}
        setLastMedicalCheckup={props.setLastMedicalCheckup}
        medicalHistory={props.medicalHistory}
        setMedicalHistory={props.setMedicalHistory}
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
        gender={props.gender}
      />

      <EligibilityCriteria
        dob={props.dob}
        age={props.age}
        weight={props.weight}
        setWeight={props.setWeight}
        weightEligible={props.weightEligible}
        height={props.height}
        setHeight={props.setHeight}
        bodyMassIndex={props.bodyMassIndex}
        bodySize={props.bodySize}
        setBodySize={props.setBodySize}
        isLivingDonor={props.isLivingDonor}
        setIsLivingDonor={props.setIsLivingDonor}
        medicalClearance={props.medicalClearance}
        setMedicalClearance={props.setMedicalClearance}
        recentTattooOrPiercing={props.recentTattooOrPiercing}
        setRecentTattooOrPiercing={props.setRecentTattooOrPiercing}
        recentTravelDetails={props.recentTravelDetails}
        setRecentTravelDetails={props.setRecentTravelDetails}
        recentVaccination={props.recentVaccination}
        setRecentVaccination={props.setRecentVaccination}
        recentSurgery={props.recentSurgery}
        setRecentSurgery={props.setRecentSurgery}
        chronicDiseases={props.chronicDiseases}
        setChronicDiseases={props.setChronicDiseases}
        allergies={props.allergies}
        setAllergies={props.setAllergies}
        lastDonationDate={props.lastDonationDate}
        setLastDonationDate={props.setLastDonationDate}
      />

      <LocationDetails
        addressLine={props.addressLine}
        setAddressLine={props.setAddressLine}
        landmark={props.landmark}
        setLandmark={props.setLandmark}
        area={props.area}
        setArea={props.setArea}
        district={props.district}
        setDistrict={props.setDistrict}
        city={props.city}
        setCity={props.setCity}
        stateVal={props.stateVal}
        setStateVal={props.setStateVal}
        country={props.country}
        setCountry={props.setCountry}
        pincode={props.pincode}
        setPincode={props.setPincode}
        location={props.location}
        onLocationPress={props.onLocationPress}
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
      />
    </>
  );
};
