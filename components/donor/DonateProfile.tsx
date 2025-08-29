import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { createDonateHubStyles } from '../../constants/styles/donateHubStyles';

interface ModernDonateProfileProps {
  donorData: any;
}

export function DonateProfile({ donorData }: ModernDonateProfileProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createDonateHubStyles(theme);

  const InfoRow = ({ label, value, isLast = false }: { label: string; value: string; isLast?: boolean }) => (
    <View style={[styles.infoRow, isLast && styles.lastInfoRow]}>
      <Text style={styles.labelText}>{label}</Text>
      <Text style={styles.valueText}>{value}</Text>
    </View>
  );

  const SectionCard = ({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) => (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconContainer}>
          <Feather name={icon as any} size={16} color={theme.primary} />
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );

  return (
    <View style={styles.card}>
      <SectionCard icon="user" title="Registration Details">
        <InfoRow 
          label="Registration Date" 
          value={donorData.registrationDate ? new Date(donorData.registrationDate).toLocaleDateString() : "N/A"} 
        />
        <InfoRow 
          label="Status" 
          value={donorData.status || "N/A"} 
          isLast 
        />
      </SectionCard>

      {donorData.medicalDetails && (
        <SectionCard icon="heart" title="Medical Information">
          <InfoRow 
            label="Hemoglobin" 
            value={`${donorData.medicalDetails.hemoglobinLevel || "N/A"} g/dL`} 
          />
          <InfoRow 
            label="Blood Pressure" 
            value={donorData.medicalDetails.bloodPressure || "N/A"} 
          />
          <InfoRow 
            label="Creatinine" 
            value={`${donorData.medicalDetails.creatinineLevel || "N/A"} mg/dL`} 
          />
          <InfoRow 
            label="Cardiac Status" 
            value={donorData.medicalDetails.cardiacStatus || "N/A"} 
          />
          <InfoRow 
            label="Health Status" 
            value={donorData.medicalDetails.overallHealthStatus || "N/A"} 
          />
          <InfoRow 
            label="Taking Medication" 
            value={donorData.medicalDetails.takingMedication ? "Yes" : "No"} 
            isLast 
          />
        </SectionCard>
      )}

      {donorData.eligibilityCriteria && (
        <SectionCard icon="check-circle" title="Eligibility Status">
          <InfoRow 
            label="Age" 
            value={`${donorData.eligibilityCriteria.age || "N/A"} years`} 
          />
          <InfoRow 
            label="Weight" 
            value={`${donorData.eligibilityCriteria.weight || "N/A"} kg`} 
          />
          <InfoRow 
            label="Height" 
            value={`${donorData.eligibilityCriteria.height || "N/A"} cm`} 
          />
          {donorData.eligibilityCriteria.bodyMassIndex && (
            <InfoRow 
              label="BMI" 
              value={donorData.eligibilityCriteria.bodyMassIndex.toString()} 
            />
          )}
          <InfoRow 
            label="Medical Clearance" 
            value={donorData.eligibilityCriteria.medicalClearance ? "✓ Approved" : "Pending"} 
          />
          <InfoRow 
            label="Last Donation" 
            value={donorData.eligibilityCriteria.lastDonationDate ? new Date(donorData.eligibilityCriteria.lastDonationDate).toLocaleDateString() : "Never"} 
            isLast 
          />
        </SectionCard>
      )}

      {donorData.hlaProfile && (
        <SectionCard icon="shield" title="HLA Profile">
          <InfoRow 
            label="HLA-A" 
            value={`${donorData.hlaProfile.hlaA1 || "N/A"}, ${donorData.hlaProfile.hlaA2 || "N/A"}`} 
          />
          <InfoRow 
            label="HLA-B" 
            value={`${donorData.hlaProfile.hlaB1 || "N/A"}, ${donorData.hlaProfile.hlaB2 || "N/A"}`} 
          />
          <InfoRow 
            label="HLA-C" 
            value={`${donorData.hlaProfile.hlaC1 || "N/A"}, ${donorData.hlaProfile.hlaC2 || "N/A"}`} 
          />
          <InfoRow 
            label="HLA-DR" 
            value={`${donorData.hlaProfile.hlaDR1 || "N/A"}, ${donorData.hlaProfile.hlaDR2 || "N/A"}`} 
          />
          <InfoRow 
            label="Testing Date" 
            value={donorData.hlaProfile.testingDate ? new Date(donorData.hlaProfile.testingDate).toLocaleDateString() : "N/A"} 
          />
          <InfoRow 
            label="Laboratory" 
            value={donorData.hlaProfile.laboratoryName || "N/A"} 
          />
          <InfoRow 
            label="Method" 
            value={donorData.hlaProfile.testingMethod || "N/A"} 
          />
          <InfoRow 
            label="Certification" 
            value={donorData.hlaProfile.certificationNumber || "N/A"} 
            isLast 
          />
        </SectionCard>
      )}

      {(donorData.location || donorData.addresses?.length > 0) && (
        <SectionCard icon="map-pin" title="Primary Address">
          {donorData.addresses?.length > 0 ? (
            <View>
              <InfoRow 
                label="Address" 
                value={donorData.addresses[0].addressLine || "N/A"} 
              />
              <InfoRow 
                label="Area" 
                value={donorData.addresses[0].area || "N/A"} 
              />
              <InfoRow 
                label="City, State" 
                value={`${donorData.addresses[0].city || "N/A"}, ${donorData.addresses[0].state || "N/A"}`} 
              />
              <InfoRow 
                label="Pincode" 
                value={donorData.addresses[0].pincode || "N/A"} 
                isLast 
              />
            </View>
          ) : donorData.location && (
            <>
              <InfoRow 
                label="Address" 
                value={donorData.location.addressLine || "N/A"} 
              />
              <InfoRow 
                label="City, State" 
                value={`${donorData.location.city || "N/A"}, ${donorData.location.state || "N/A"}`} 
              />
              <InfoRow 
                label="Pincode" 
                value={donorData.location.pincode || "N/A"} 
                isLast 
              />
            </>
          )}
        </SectionCard>
      )}

      {donorData.consentForm && (
        <SectionCard icon="file-text" title="Consent Details">
          <InfoRow 
            label="Consent Status" 
            value={donorData.consentForm.isConsented ? "✓ Consented" : "Not Consented"} 
          />
          <InfoRow 
            label="Consent Date" 
            value={donorData.consentForm.consentedAt ? new Date(donorData.consentForm.consentedAt).toLocaleDateString() : "N/A"} 
            isLast 
          />
        </SectionCard>
      )}
    </View>
  );
}
