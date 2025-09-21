import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { createUnifiedStyles } from '../../constants/styles/unifiedStyles';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { InfoRow } from './InfoRow';
import { LocationDetails } from './LocationDetails';

interface YourDetailsCardProps {
  yourDetails: any;
  loadingYourDetails: boolean;
  userRole: 'donor' | 'recipient' | 'unknown';
}

export const YourDetailsCard: React.FC<YourDetailsCardProps> = ({
  yourDetails,
  loadingYourDetails,
  userRole
}) => {
  const { colorScheme } = useTheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  const title = userRole === 'donor' 
    ? 'Other Party Details (Request)' 
    : 'Other Party Details (Donation)';
  const icon = userRole === 'donor' ? 'clipboard' : 'droplet';

  if (loadingYourDetails) {
    return (
      <View style={[styles.sectionContainer, { paddingHorizontal: 24 }]}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIconContainer}>
            <Feather name="clock" size={18} color={theme.primary} />
          </View>
          <Text style={styles.sectionTitle}>Loading Other Party Details...</Text>
        </View>
        <Text style={styles.loadingText}>Please wait...</Text>
      </View>
    );
  }

  if (!yourDetails?.data) {
    return (
      <View style={[styles.sectionContainer, { paddingHorizontal: 24 }]}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIconContainer}>
            <Feather name={icon as any} size={18} color={theme.primary} />
          </View>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.valueText}>
            {userRole === 'donor' 
              ? 'Request details not available or access denied' 
              : 'Donation details not available or access denied'
            }
          </Text>
        </View>
      </View>
    );
  }

  const data = yourDetails.data;

  return (
    <>
      <View style={[styles.sectionContainer, { paddingHorizontal: 24 }]}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIconContainer}>
            <Feather name={icon as any} size={18} color={theme.primary} />
          </View>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>

        {userRole === 'donor' ? (
          <>
            <InfoRow label="Request Type" value={data.requestType || 'N/A'} />
            <InfoRow label="Blood Type Needed" value={data.requestedBloodType || 'N/A'} />
            {data.requestedOrgan && (
              <InfoRow label="Organ Needed" value={data.requestedOrgan} />
            )}
            {data.requestedTissue && (
              <InfoRow label="Tissue Needed" value={data.requestedTissue} />
            )}
            {data.requestedStemCellType && (
              <InfoRow label="Stem Cell Type Needed" value={data.requestedStemCellType} />
            )}
            <InfoRow 
              label="Urgency Level" 
              value={data.urgencyLevel || 'N/A'}
              valueColor={
                data.urgencyLevel === 'CRITICAL' ? theme.error : 
                data.urgencyLevel === 'HIGH' ? '#FF6B35' : 
                data.urgencyLevel === 'MEDIUM' ? '#FFA500' : theme.success
              }
            />
            <InfoRow label="Quantity Needed" value={data.quantity?.toString() || 'N/A'} />
            <InfoRow 
              label="Status" 
              value={data.status || 'N/A'}
              valueColor={
                data.status === 'FULFILLED' ? theme.success : 
                data.status === 'PENDING' ? theme.error : theme.text
              }
            />
            {data.notes && <InfoRow label="Notes" value={data.notes} />}
            <InfoRow 
              label="Request Date" 
              value={data.requestDate ? new Date(data.requestDate).toLocaleDateString() : 'N/A'}
              isLast
            />
          </>
        ) : (
          <>
            <InfoRow label="Donation Type" value={data.donationType || 'N/A'} />
            <InfoRow label="Blood Type" value={data.bloodType || 'N/A'} />
            {data.organType && (
              <InfoRow label="Organ Type" value={data.organType} />
            )}
            {data.tissueType && (
              <InfoRow label="Tissue Type" value={data.tissueType} />
            )}
            {data.stemCellType && (
              <InfoRow label="Stem Cell Type" value={data.stemCellType} />
            )}
            <InfoRow label="Quantity" value={data.quantity?.toString() || 'N/A'} />
            <InfoRow 
              label="Status" 
              value={data.status || 'N/A'}
              valueColor={
                data.status === 'COMPLETED' ? theme.success : 
                data.status === 'AVAILABLE' ? theme.primary : theme.text
              }
            />
            {data.organQuality && (
              <InfoRow label="Organ Quality" value={data.organQuality} />
            )}
            {data.organWeight && (
              <InfoRow label="Organ Weight" value={`${data.organWeight}g`} />
            )}
            <InfoRow 
              label="Donation Date" 
              value={data.donationDate ? new Date(data.donationDate).toLocaleDateString() : 'N/A'}
              isLast
            />
          </>
        )}
      </View>

      <LocationDetails data={data} />
    </>
  );
};
