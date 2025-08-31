import React from "react";
import { View } from "react-native";
import { MedicalDetails } from "./MedicalDetails";
import { EligibilityCriteria } from "./EligibilityCriteria";
import { LocationDetails } from "./LocationDetails";
import { HlaProfile } from "./HlaProfile";
import { ConsentForm } from "./ConsentForm";
import { RecipientFormState } from "../../hooks/useRecipientFormState";

interface RecipientFormProps extends RecipientFormState {
  onLocationPress: () => void;
}

export function RecipientForm(props: RecipientFormProps) {
  return (
    <View>
      <MedicalDetails
        diagnosis={props.diagnosis}
        setDiagnosis={props.setDiagnosis}
        allergies={props.allergies}
        setAllergies={props.setAllergies}
        currentMedications={props.currentMedications}
        setCurrentMedications={props.setCurrentMedications}
        additionalNotes={props.additionalNotes}
        setAdditionalNotes={props.setAdditionalNotes}
        hemoglobinLevel={props.hemoglobinLevel}
        setHemoglobinLevel={props.setHemoglobinLevel}
        bloodPressure={props.bloodPressure}
        setBloodPressure={props.setBloodPressure}
        creatinineLevel={props.creatinineLevel}
        setCreatinineLevel={props.setCreatinineLevel}
        overallHealthStatus={props.overallHealthStatus}
        setOverallHealthStatus={props.setOverallHealthStatus}
      />

      <EligibilityCriteria
        medicallyEligible={props.medicallyEligible}
        setMedicallyEligible={props.setMedicallyEligible}
        legalClearance={props.legalClearance}
        setLegalClearance={props.setLegalClearance}
        eligibilityNotes={props.eligibilityNotes}
        setEligibilityNotes={props.setEligibilityNotes}
        lastReviewed={props.lastReviewed}
        setLastReviewed={props.setLastReviewed}
        age={props.age}
        setAge={props.setAge}
        weight={props.weight}
        setWeight={props.setWeight}
        height={props.height}
        setHeight={props.setHeight}
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
    </View>
  );
}
