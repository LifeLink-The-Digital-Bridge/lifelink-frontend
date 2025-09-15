import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { createUnifiedStyles } from '../../constants/styles/unifiedStyles';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { InfoRow } from './InfoRow';

interface MedicalDetailsCardProps {
  data: any;
  isDonor: boolean;
  isHistorical: boolean;
}

export const MedicalDetailsCard: React.FC<MedicalDetailsCardProps> = ({ 
  data, 
  isDonor, 
  isHistorical 
}) => {
  const { colorScheme } = useTheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  if (!data) return null;

  let medicalDetails, eligibilityCriteria, donationDetails, requestDetails;
  
  if (isHistorical) {
    medicalDetails = data.medicalDetailsSnapshot;
    eligibilityCriteria = data.eligibilityCriteriaSnapshot;
    donationDetails = data.donationSnapshot;
    requestDetails = data.receiveRequestSnapshot;
  } else {
    medicalDetails = data.medicalDetails;
    eligibilityCriteria = data.eligibilityCriteria;
    donationDetails = data;
    requestDetails = data;
  }

  const formatArrayDate = (dateArray: number[]) => {
    if (!Array.isArray(dateArray) || dateArray.length < 3) return 'N/A';
    const [year, month, day] = dateArray;
    return new Date(year, month - 1, day).toLocaleDateString();
  };

  return (
    <View style={[styles.sectionContainer, { paddingHorizontal: 24 }]}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconContainer}>
          <Feather name={isDonor ? "heart" : "user"} size={18} color={theme.primary} />
        </View>
        <Text style={styles.sectionTitle}>
          {isDonor ? 'Donor' : 'Recipient'} Details 
        </Text>
      </View>
      
      {isHistorical && isDonor && donationDetails && (
        <>
          <InfoRow label="Donation Type" value={donationDetails.donationType || 'N/A'} />
          <InfoRow label="Blood Type" value={donationDetails.bloodType || 'N/A'} />
          {donationDetails.organType && (
            <InfoRow label="Organ Type" value={donationDetails.organType} />
          )}
          <InfoRow label="Status at Match Time" value={donationDetails.status || 'N/A'} />
        </>
      )}
      
      {isHistorical && !isDonor && requestDetails && (
        <>
          <InfoRow label="Request Type" value={requestDetails.requestType || 'N/A'} />
          <InfoRow label="Blood Type Needed" value={requestDetails.requestedBloodType || 'N/A'} />
          {requestDetails.requestedOrgan && (
            <InfoRow label="Organ Needed" value={requestDetails.requestedOrgan} />
          )}
          <InfoRow 
            label="Urgency Level" 
            value={requestDetails.urgencyLevel || 'N/A'} 
            valueColor={
              requestDetails.urgencyLevel === 'CRITICAL' ? theme.error : 
              requestDetails.urgencyLevel === 'HIGH' ? '#FF6B35' : 
              requestDetails.urgencyLevel === 'MEDIUM' ? '#FFA500' : theme.success
            }
          />
          <InfoRow label="Status at Match Time" value={requestDetails.status || 'N/A'} />
        </>
      )}

      {medicalDetails && (
        <>
          <InfoRow label="Hemoglobin Level" value={medicalDetails.hemoglobinLevel || 'N/A'} />
          <InfoRow label="Blood Pressure" value={medicalDetails.bloodPressure || 'N/A'} />
          <InfoRow label="Overall Health" value={medicalDetails.overallHealthStatus || 'N/A'} />
          {isDonor && (
            <>
              <InfoRow 
                label="Last Medical Checkup" 
                value={
                  medicalDetails.lastMedicalCheckup 
                    ? Array.isArray(medicalDetails.lastMedicalCheckup)
                      ? formatArrayDate(medicalDetails.lastMedicalCheckup)
                      : new Date(medicalDetails.lastMedicalCheckup).toLocaleDateString()
                    : 'N/A'
                } 
              />
              <InfoRow label="Medical History" value={medicalDetails.medicalHistory || 'N/A'} />
            </>
          )}
          {!isDonor && (
            <InfoRow label="Diagnosis" value={medicalDetails.diagnosis || 'N/A'} />
          )}
        </>
      )}

      {eligibilityCriteria && (
        <>
          <InfoRow label="Age" value={eligibilityCriteria.age || 'N/A'} />
          <InfoRow label="Weight" value={eligibilityCriteria.weight ? `${eligibilityCriteria.weight} kg` : 'N/A'} />
          <InfoRow label="Height" value={eligibilityCriteria.height ? `${eligibilityCriteria.height} cm` : 'N/A'} />
          <InfoRow label="BMI" value={eligibilityCriteria.bodyMassIndex || 'N/A'} />
          <InfoRow label="Body Size" value={eligibilityCriteria.bodySize || 'N/A'} />
          <InfoRow 
            label={isDonor ? 'Medical Clearance' : 'Medical Eligibility'} 
            value={isDonor 
              ? (eligibilityCriteria.medicalClearance ? '✓ Cleared' : '⚠ Not Cleared')
              : (eligibilityCriteria.medicallyEligible ? '✓ Eligible' : '⚠ Not Eligible')
            }
            valueColor={
              (isDonor ? eligibilityCriteria.medicalClearance : eligibilityCriteria.medicallyEligible) 
                ? theme.success : theme.error
            }
            isLast
          />
        </>
      )}
    </View>
  );
};
