import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../utils/theme-context";
import { lightTheme, darkTheme } from "../../constants/styles/authStyles";
import { createUnifiedStyles } from "../../constants/styles/unifiedStyles";

interface RecipientProfileProps {
  recipient: any;
}

export function RecipientProfile({ recipient }: RecipientProfileProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  const InfoRow = ({
    label,
    value,
    isLast = false,
  }: {
    label: string;
    value: string;
    isLast?: boolean;
  }) => (
    <View style={[styles.infoRow, isLast && styles.lastInfoRow]}>
      <Text style={styles.labelText}>{label}</Text>
      <Text style={styles.valueText}>{value}</Text>
    </View>
  );

  const SectionCard = ({
    icon,
    title,
    children,
  }: {
    icon: string;
    title: string;
    children: React.ReactNode;
  }) => (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconContainer}>
          <Feather name={icon as any} size={18} color={theme.primary} />
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );

  return (
    <View style={styles.card}>
      <SectionCard icon="user" title="Status Information">
        <InfoRow
          label="Availability Status"
          value={recipient.availability || "N/A"}
          isLast
        />
      </SectionCard>

      {recipient.medicalDetails && (
        <SectionCard icon="heart" title="Medical Information">
          <InfoRow
            label="Diagnosis"
            value={recipient.medicalDetails.diagnosis || "N/A"}
          />
          <InfoRow
            label="Allergies"
            value={recipient.medicalDetails.allergies || "None"}
          />
          <InfoRow
            label="Current Medications"
            value={recipient.medicalDetails.currentMedications || "N/A"}
          />
          {recipient.medicalDetails.hemoglobinLevel && (
            <InfoRow
              label="Hemoglobin"
              value={`${recipient.medicalDetails.hemoglobinLevel} g/dL`}
            />
          )}
          {recipient.medicalDetails.bloodPressure && (
            <InfoRow
              label="Blood Pressure"
              value={recipient.medicalDetails.bloodPressure}
            />
          )}
          {recipient.medicalDetails.creatinineLevel && (
            <InfoRow
              label="Creatinine"
              value={`${recipient.medicalDetails.creatinineLevel} mg/dL`}
            />
          )}
          <InfoRow
            label="Health Status"
            value={recipient.medicalDetails.overallHealthStatus || "N/A"}
            isLast
          />
        </SectionCard>
      )}

      {recipient.eligibilityCriteria && (
        <SectionCard icon="check-circle" title="Eligibility Status">
          <InfoRow
            label="Medically Eligible"
            value={
              recipient.eligibilityCriteria.medicallyEligible ? "✓ Yes" : "✗ No"
            }
          />
          <InfoRow
            label="Legal Clearance"
            value={
              recipient.eligibilityCriteria.legalClearance ? "✓ Yes" : "✗ No"
            }
          />
          {recipient.eligibilityCriteria.age && (
            <InfoRow
              label="Age"
              value={`${recipient.eligibilityCriteria.age} years`}
            />
          )}
          {recipient.eligibilityCriteria.weight && (
            <InfoRow
              label="Weight"
              value={`${recipient.eligibilityCriteria.weight} kg`}
            />
          )}
          {recipient.eligibilityCriteria.height && (
            <InfoRow
              label="Height"
              value={`${recipient.eligibilityCriteria.height} cm`}
            />
          )}
          {recipient.eligibilityCriteria.bodyMassIndex && (
            <InfoRow
              label="BMI"
              value={recipient.eligibilityCriteria.bodyMassIndex.toString()}
            />
          )}
          <InfoRow
            label="Last Reviewed"
            value={
              recipient.eligibilityCriteria.lastReviewed
                ? new Date(
                    recipient.eligibilityCriteria.lastReviewed
                  ).toLocaleDateString()
                : "N/A"
            }
            isLast
          />
        </SectionCard>
      )}

      {recipient.hlaProfile && (
        <SectionCard icon="shield" title="HLA Profile">
          <InfoRow
            label="HLA-A"
            value={`${recipient.hlaProfile.hlaA1 || "N/A"}, ${
              recipient.hlaProfile.hlaA2 || "N/A"
            }`}
          />
          <InfoRow
            label="HLA-B"
            value={`${recipient.hlaProfile.hlaB1 || "N/A"}, ${
              recipient.hlaProfile.hlaB2 || "N/A"
            }`}
          />
          <InfoRow
            label="HLA-C"
            value={`${recipient.hlaProfile.hlaC1 || "N/A"}, ${
              recipient.hlaProfile.hlaC2 || "N/A"
            }`}
          />
          <InfoRow
            label="HLA-DR"
            value={`${recipient.hlaProfile.hlaDR1 || "N/A"}, ${
              recipient.hlaProfile.hlaDR2 || "N/A"
            }`}
          />
          <InfoRow
            label="Testing Date"
            value={
              recipient.hlaProfile.testingDate
                ? new Date(
                    recipient.hlaProfile.testingDate
                  ).toLocaleDateString()
                : "N/A"
            }
          />
          <InfoRow
            label="Laboratory"
            value={recipient.hlaProfile.laboratoryName || "N/A"}
          />
          <InfoRow
            label="Method"
            value={recipient.hlaProfile.testingMethod || "N/A"}
          />
          <InfoRow
            label="Certification"
            value={recipient.hlaProfile.certificationNumber || "N/A"}
            isLast
          />
        </SectionCard>
      )}

      {recipient.addresses?.length > 0 && (
        <SectionCard icon="map-pin" title="Primary Address">
          <InfoRow
            label="Address"
            value={recipient.addresses[0].addressLine || "N/A"}
          />
          <InfoRow label="Area" value={recipient.addresses[0].area || "N/A"} />
          <InfoRow
            label="City, State"
            value={`${recipient.addresses[0].city || "N/A"}, ${
              recipient.addresses[0].state || "N/A"
            }`}
          />
          <InfoRow
            label="Pincode"
            value={recipient.addresses[0].pincode || "N/A"}
            isLast
          />
        </SectionCard>
      )}

      {recipient.consentForm && (
        <SectionCard icon="file-text" title="Consent Details">
          <InfoRow
            label="Consent Status"
            value={
              recipient.consentForm.isConsented
                ? "✓ Consented"
                : "Not Consented"
            }
          />
          <InfoRow
            label="Consent Date"
            value={
              recipient.consentForm.consentedAt
                ? new Date(
                    recipient.consentForm.consentedAt
                  ).toLocaleDateString()
                : "N/A"
            }
            isLast
          />
        </SectionCard>
      )}
    </View>
  );
}
