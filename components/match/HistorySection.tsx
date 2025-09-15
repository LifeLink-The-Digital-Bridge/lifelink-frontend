import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { createUnifiedStyles } from '../../constants/styles/unifiedStyles';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { InfoRow } from './InfoRow';

interface HistorySectionProps {
  match: any;
  loadingHistory: boolean;
  matchHistory: any;
  donorHistoryData: any;
  recipientHistoryData: any;
  formatDate: (date: string) => string;
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  match,
  loadingHistory,
  matchHistory,
  donorHistoryData,
  recipientHistoryData,
  formatDate
}) => {
  const { colorScheme } = useTheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  const formatArrayDate = (dateArray: number[]) => {
    if (!Array.isArray(dateArray) || dateArray.length < 6) return 'Recently';
    const [year, month, day, hour, minute, second] = dateArray;
    return new Date(year, month - 1, day, hour, minute, second).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!match?.isConfirmed) {
    return (
      <View style={[styles.sectionContainer, { paddingHorizontal: 24 }]}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIconContainer}>
            <Feather name="clock" size={18} color={theme.primary} />
          </View>
          <Text style={styles.sectionTitle}>Match History</Text>
        </View>
        <Text style={styles.valueText}>
          History will be available after both parties confirm the match.
        </Text>
      </View>
    );
  }

  if (loadingHistory) {
    return (
      <View style={[styles.sectionContainer, { paddingHorizontal: 24 }]}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIconContainer}>
            <Feather name="clock" size={18} color={theme.primary} />
          </View>
          <Text style={styles.sectionTitle}>Loading Match History...</Text>
        </View>
        <ActivityIndicator size="small" color={theme.primary} />
      </View>
    );
  }

  if (!donorHistoryData && !recipientHistoryData) {
    return (
      <View style={[styles.sectionContainer, { paddingHorizontal: 24 }]}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIconContainer}>
            <Feather name="clock" size={18} color={theme.primary} />
          </View>
          <Text style={styles.sectionTitle}>Match History</Text>
        </View>
        <Text style={styles.valueText}>No history available for this match.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.sectionContainer, { paddingHorizontal: 24 }]}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconContainer}>
          <Feather name="clock" size={18} color={theme.primary} />
        </View>
        <Text style={styles.sectionTitle}>Match History</Text>
      </View>
      
      <InfoRow 
        label="Match Completed" 
        value={`✓ ${match.confirmedAt ? formatDate(match.confirmedAt) : 'Recently'}`}
        valueColor={theme.success}
      />

      {(donorHistoryData?.matchedAt || recipientHistoryData?.matchedAt) && (
        <InfoRow 
          label="Originally Matched At" 
          value={
            donorHistoryData?.matchedAt 
              ? Array.isArray(donorHistoryData.matchedAt) 
                ? formatArrayDate(donorHistoryData.matchedAt)
                : formatDate(donorHistoryData.matchedAt)
              : recipientHistoryData?.matchedAt
                ? formatDate(recipientHistoryData.matchedAt)
                : 'N/A'
          }
        />
      )}

      {(donorHistoryData?.completedAt || recipientHistoryData?.completedAt) && (
        <InfoRow 
          label="Completed At" 
          value={
            donorHistoryData?.completedAt 
              ? Array.isArray(donorHistoryData.completedAt)
                ? formatArrayDate(donorHistoryData.completedAt)
                : formatDate(donorHistoryData.completedAt)
              : recipientHistoryData?.completedAt
                ? formatDate(recipientHistoryData.completedAt)
                : 'N/A'
          }
          valueColor={theme.success}
        />
      )}

      {donorHistoryData && (
        <View style={{ marginTop: 16 }}>
          <Text style={[styles.labelText, { fontWeight: 'bold', marginBottom: 8 }]}>Donor History Snapshot:</Text>
          <View style={{ marginLeft: 12 }}>
            {donorHistoryData.donationSnapshot && (
              <>
                <InfoRow label="Donation Type" value={donorHistoryData.donationSnapshot.donationType || 'N/A'} />
                <InfoRow label="Blood Type" value={donorHistoryData.donationSnapshot.bloodType || 'N/A'} />
                {donorHistoryData.donationSnapshot.organType && (
                  <InfoRow label="Organ Type" value={donorHistoryData.donationSnapshot.organType} />
                )}
                <InfoRow label="Status at Match" value={donorHistoryData.donationSnapshot.status || 'N/A'} />
              </>
            )}
            {donorHistoryData.medicalDetailsSnapshot && (
              <>
                <InfoRow label="Hemoglobin Level" value={donorHistoryData.medicalDetailsSnapshot.hemoglobinLevel || 'N/A'} />
                <InfoRow label="Overall Health" value={donorHistoryData.medicalDetailsSnapshot.overallHealthStatus || 'N/A'} />
              </>
            )}
          </View>
        </View>
      )}

      {recipientHistoryData && (
        <View style={{ marginTop: 16 }}>
          <Text style={[styles.labelText, { fontWeight: 'bold', marginBottom: 8 }]}>Recipient History Snapshot:</Text>
          <View style={{ marginLeft: 12 }}>
            {recipientHistoryData.receiveRequestSnapshot && (
              <>
                <InfoRow label="Request Type" value={recipientHistoryData.receiveRequestSnapshot.requestType || 'N/A'} />
                <InfoRow label="Blood Type Needed" value={recipientHistoryData.receiveRequestSnapshot.requestedBloodType || 'N/A'} />
                {recipientHistoryData.receiveRequestSnapshot.requestedOrgan && (
                  <InfoRow label="Organ Needed" value={recipientHistoryData.receiveRequestSnapshot.requestedOrgan} />
                )}
                <InfoRow 
                  label="Urgency Level" 
                  value={recipientHistoryData.receiveRequestSnapshot.urgencyLevel || 'N/A'}
                  valueColor={
                    recipientHistoryData.receiveRequestSnapshot.urgencyLevel === 'CRITICAL' ? theme.error : 
                    recipientHistoryData.receiveRequestSnapshot.urgencyLevel === 'HIGH' ? '#FF6B35' : 
                    recipientHistoryData.receiveRequestSnapshot.urgencyLevel === 'MEDIUM' ? '#FFA500' : theme.success
                  }
                />
                <InfoRow label="Quantity Needed" value={`${recipientHistoryData.receiveRequestSnapshot.quantity || 'N/A'} units`} />
                <InfoRow label="Status at Match" value={recipientHistoryData.receiveRequestSnapshot.status || 'N/A'} />
              </>
            )}
            {recipientHistoryData.medicalDetailsSnapshot && (
              <>
                <InfoRow label="Diagnosis" value={recipientHistoryData.medicalDetailsSnapshot.diagnosis || 'N/A'} />
                <InfoRow label="Overall Health" value={recipientHistoryData.medicalDetailsSnapshot.overallHealthStatus || 'N/A'} />
              </>
            )}
          </View>
        </View>
      )}
    </View>
  );
};
