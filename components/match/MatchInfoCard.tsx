import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { createUnifiedStyles } from '../../constants/styles/unifiedStyles';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { InfoRow } from './InfoRow';

interface MatchInfoCardProps {
  match: any;
  currentUserRole: string;
  getCurrentUserStatus: () => boolean;
  getOtherPartyStatus: () => boolean;
  otherPartyRole: string;
  formatDate: (date: string) => string;
}

export const MatchInfoCard: React.FC<MatchInfoCardProps> = ({
  match,
  currentUserRole,
  getCurrentUserStatus,
  getOtherPartyStatus,
  otherPartyRole,
  formatDate
}) => {
  const { colorScheme } = useTheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  const userConfirmed = getCurrentUserStatus();
  const otherPartyConfirmed = getOtherPartyStatus();

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconContainer}>
          <Feather name="info" size={18} color={theme.primary} />
        </View>
        <Text style={styles.sectionTitle}>Match Information</Text>
      </View>

      <InfoRow label="Your Role" value={currentUserRole} />
      <InfoRow label="Match Type" value={match.matchType || 'N/A'} />
      
      {match.donationType && (
        <InfoRow label="Donation Type" value={match.donationType} />
      )}
      {match.requestType && (
        <InfoRow label="Request Type" value={match.requestType} />
      )}
      {match.bloodType && (
        <InfoRow label="Blood Type" value={match.bloodType} />
      )}
      {match.distance && (
        <InfoRow
          label="Distance"
          value={`${match.distance.toFixed(2)} km`}
        />
      )}

      <InfoRow
        label="Your Status"
        value={userConfirmed ? '✓ Confirmed' : '⏳ Pending'}
        valueColor={userConfirmed ? theme.success : theme.error}
      />
      <InfoRow
        label={`${otherPartyRole} Status`}
        value={otherPartyConfirmed ? '✓ Confirmed' : '⏳ Pending'}
        valueColor={otherPartyConfirmed ? theme.success : theme.error}
      />

      {userConfirmed && match.donorConfirmedAt && currentUserRole === 'Donor' && (
        <InfoRow
          label="You Confirmed At"
          value={formatDate(match.donorConfirmedAt)}
        />
      )}
      {userConfirmed && match.recipientConfirmedAt && currentUserRole === 'Recipient' && (
        <InfoRow
          label="You Confirmed At"
          value={formatDate(match.recipientConfirmedAt)}
        />
      )}

      <InfoRow
        label="Matched At"
        value={formatDate(match.matchedAt)}
      />

      <InfoRow
        label="Donation ID"
        value={match.donationId.slice(0, 8) + '...'}
      />
      <InfoRow
        label="Request ID"
        value={match.receiveRequestId.slice(0, 8) + '...'}
        isLast
      />
    </View>
  );
};
