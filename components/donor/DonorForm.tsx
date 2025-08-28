import React from 'react';
import { ScrollView } from 'react-native';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { createDonorStyles } from '../../constants/styles/donorStyles';

import { MedicalDetails } from './MedicalDetails';
import { EligibilityCriteria } from './EligibilityCriteria';
import { ConsentForm } from './ConsentForm';
import { LocationDetails } from './LocationDetails';

interface DonorFormProps {
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
}

export function DonorForm(props: DonorFormProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createDonorStyles(theme);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
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

      <ConsentForm
        isConsented={props.isConsented}
        setIsConsented={props.setIsConsented}
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
    </ScrollView>
  );
}
