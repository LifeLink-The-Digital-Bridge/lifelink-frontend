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

  const title = userRole === 'donor' 
    ? 'Your Donation Details' 
    : 'Your Request Details';
  const icon = userRole === 'donor' ? 'droplet' : 'clipboard';

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
    return null;
  }

  const isDonation = yourDetails.type === 'donation';
  const data = yourDetails.data;

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
            value={data.donationType || 'N/A'}
          />
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
          <InfoRow
            label="Quantity"
            value={data.quantity ? `${data.quantity} units` : 'N/A'}
          />
          <InfoRow label="Status" value={data.status || 'N/A'} />
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
                value={`${data.location.city || ''}, ${data.location.state || ''}`.trim()}
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
          <InfoRow label="Request Type" value={data.requestType || 'N/A'} />
          <InfoRow
            label="Blood Type Needed"
            value={data.requestedBloodType || 'N/A'}
          />
          {data.requestedOrgan && (
            <InfoRow label="Organ Needed" value={data.requestedOrgan} />
          )}
          {data.requestedTissue && (
            <InfoRow label="Tissue Needed" value={data.requestedTissue} />
          )}
          {data.requestedStemCellType && (
            <InfoRow
              label="Stem Cell Type Needed"
              value={data.requestedStemCellType}
            />
          )}
          <InfoRow
            label="Urgency Level"
            value={data.urgencyLevel || 'N/A'}
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
          <InfoRow label="Status" value={data.status || 'N/A'} />
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
                value={`${data.location.city || ''}, ${data.location.state || ''}`.trim()}
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
