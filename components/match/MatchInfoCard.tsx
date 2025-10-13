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

  return (
    <View style={[styles.sectionContainer, { paddingHorizontal: 24 }]}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconContainer}>
          <Feather name="activity" size={18} color={theme.primary} />
        </View>
        <Text style={styles.sectionTitle}>Match Information</Text>
      </View>

      <InfoRow label="Your Role" value={currentUserRole} />
      <InfoRow label="Match Type" value={match.matchType || 'N/A'} />
      <InfoRow label="Type" value={match.donationType || match.requestType || 'N/A'} />

      {match.distance !== undefined && (
        <InfoRow label="Distance" value={`${match.distance.toFixed(1)} km`} />
      )}

      <InfoRow 
        label="Your Status" 
        value={getCurrentUserStatus() ? '✓ Confirmed' : '⏳ Pending'}
        valueColor={getCurrentUserStatus() ? theme.success : theme.error}
      />
      
      <InfoRow 
        label={`${otherPartyRole} Status`}
        value={getOtherPartyStatus() ? '✓ Confirmed' : '⏳ Pending'}
        valueColor={getOtherPartyStatus() ? theme.success : theme.error}
      />

      <InfoRow label="Matched At" value={formatDate(match.matchedAt)} />
      
      {match.confirmedAt && (
        <InfoRow label="Confirmed At" value={formatDate(match.confirmedAt)} />
      )}
      
      <InfoRow label="Donation ID" value={match.donationId} />
      <InfoRow label="Request ID" value={match.receiveRequestId} isLast />
    </View>
  );
};
