import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { createUnifiedStyles } from '../../constants/styles/unifiedStyles';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { InfoRow } from './InfoRow';

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

  if (loadingYourDetails) {
    return (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIconContainer}>
            <Feather
              name={userRole === 'donor' ? 'heart' : 'clipboard'}
              size={18}
              color={theme.primary}
            />
          </View>
          <Text style={styles.sectionTitle}>
            Your {userRole === 'donor' ? 'Donation' : 'Request'} Details
          </Text>
        </View>
        <View style={{ padding: 20, alignItems: 'center' }}>
          <Text style={[styles.valueText, { marginTop: 8 }]}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (!yourDetails?.data) {
    return (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIconContainer}>
            <Feather
              name={userRole === 'donor' ? 'heart' : 'clipboard'}
              size={18}
              color={theme.primary}
            />
          </View>
          <Text style={styles.sectionTitle}>
            Your {userRole === 'donor' ? 'Donation' : 'Request'} Details
          </Text>
        </View>
        <View style={{ padding: 20, alignItems: 'center' }}>
          <Text style={[styles.valueText, { marginTop: 8, color: theme.textSecondary }]}>
            No details available
          </Text>
        </View>
      </View>
    );
  }

  const isDonation = yourDetails.type === 'donation';
  const data = yourDetails.data;

  const formatEnumValue = (value: string | undefined | null): string => {
    if (!value) return 'N/A';
    return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconContainer}>
          <Feather
            name={isDonation ? 'heart' : 'clipboard'}
            size={18}
            color={theme.primary}
          />
        </View>
        <Text style={styles.sectionTitle}>
          Your {isDonation ? 'Donation' : 'Request'} Details
        </Text>
      </View>

      {isDonation ? (
        <>
          <InfoRow
            label="Donation Type"
            value={formatEnumValue(data.donationType)}
          />
          <InfoRow 
            label="Blood Type" 
            value={formatEnumValue(data.bloodType)} 
          />
          {data.organType && (
            <InfoRow 
              label="Organ Type" 
              value={formatEnumValue(data.organType)} 
            />
          )}
          {data.tissueType && (
            <InfoRow 
              label="Tissue Type" 
              value={formatEnumValue(data.tissueType)} 
            />
          )}
          {data.stemCellType && (
            <InfoRow 
              label="Stem Cell Type" 
              value={formatEnumValue(data.stemCellType)} 
            />
          )}
          <InfoRow
            label="Quantity"
            value={data.quantity ? `${data.quantity} units` : 'N/A'}
          />
          <InfoRow 
            label="Status" 
            value={formatEnumValue(data.status)} 
          />
          <InfoRow
            label="Donation Date"
            value={
              data.donationDate
                ? new Date(data.donationDate).toLocaleDateString()
                : 'N/A'
            }
          />
          {data.organQuality && (
            <InfoRow label="Organ Quality" value={data.organQuality} />
          )}
          {data.organViabilityExpiry && (
            <InfoRow
              label="Organ Viability Expiry"
              value={new Date(data.organViabilityExpiry).toLocaleString()}
            />
          )}
          {data.coldIschemiaTime && (
            <InfoRow
              label="Cold Ischemia Time"
              value={`${data.coldIschemiaTime} hours`}
            />
          )}
          {data.location && (
            <>
              <InfoRow
                label="Location"
                value={`${data.location.city || ''}, ${data.location.state || ''}`.trim() || 'N/A'}
              />
              <InfoRow
                label="Address"
                value={data.location.addressLine || 'N/A'}
                isLast
              />
            </>
          )}
        </>
      ) : (
        <>
          <InfoRow 
            label="Request Type" 
            value={formatEnumValue(data.requestType)} 
          />
          <InfoRow
            label="Blood Type Needed"
            value={formatEnumValue(data.requestedBloodType)}
          />
          {data.requestedOrgan && (
            <InfoRow 
              label="Organ Needed" 
              value={formatEnumValue(data.requestedOrgan)} 
            />
          )}
          {data.requestedTissue && (
            <InfoRow 
              label="Tissue Needed" 
              value={formatEnumValue(data.requestedTissue)} 
            />
          )}
          {data.requestedStemCellType && (
            <InfoRow
              label="Stem Cell Type Needed"
              value={formatEnumValue(data.requestedStemCellType)}
            />
          )}
          <InfoRow
            label="Urgency Level"
            value={formatEnumValue(data.urgencyLevel)}
            valueColor={
              data.urgencyLevel === 'CRITICAL'
                ? theme.error
                : data.urgencyLevel === 'HIGH'
                ? '#FF6B35'
                : data.urgencyLevel === 'MEDIUM'
                ? '#FFA500'
                : theme.success
            }
          />
          <InfoRow
            label="Quantity Needed"
            value={data.quantity ? `${data.quantity} units` : 'N/A'}
          />
          <InfoRow 
            label="Status" 
            value={formatEnumValue(data.status)} 
          />
          <InfoRow
            label="Request Date"
            value={
              data.requestDate
                ? new Date(data.requestDate).toLocaleDateString()
                : 'N/A'
            }
          />
          {data.notes && <InfoRow label="Notes" value={data.notes} />}
          {data.location && (
            <>
              <InfoRow
                label="Location"
                value={`${data.location.city || ''}, ${data.location.state || ''}`.trim() || 'N/A'}
              />
              <InfoRow
                label="Address"
                value={data.location.addressLine || 'N/A'}
                isLast
              />
            </>
          )}
        </>
      )}
    </View>
  );
};
