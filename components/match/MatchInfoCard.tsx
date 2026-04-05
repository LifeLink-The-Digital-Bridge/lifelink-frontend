import { Feather } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { darkTheme, lightTheme } from '../../constants/styles/authStyles';
import { createUnifiedStyles } from '../../constants/styles/unifiedStyles';
import { useTheme } from '../../utils/theme-context';
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
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const userConfirmed = getCurrentUserStatus();
  const otherPartyConfirmed = getOtherPartyStatus();

  const copyToClipboard = async (id: string, label: string) => {
    try {
      await Clipboard.setStringAsync(id);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      Alert.alert('Error', 'Failed to copy to clipboard');
    }
  };

  const renderCopyableRow = (label: string, id: string, isLast: boolean = false) => {
    const isCopied = copiedId === id;

    return (
      <View
        style={[
          {
            flexDirection: 'row',
            paddingVertical: 12,
            borderBottomWidth: isLast ? 0 : 1,
            borderBottomColor: theme.border,
            alignItems: 'center',
          }
        ]}
      >
        <Text style={[styles.text, { flex: 0.4, color: theme.textSecondary }]}>
          {label}
        </Text>
        <View style={{ flex: 0.6, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
          <Text
            style={[
              styles.text,
              {
                color: theme.text,
                fontWeight: '500',
                marginRight: 8,
              }
            ]}
          >
            {id.slice(0, 8)}...
          </Text>
          <TouchableOpacity
            onPress={() => copyToClipboard(id, label)}
            style={{
              backgroundColor: isCopied ? theme.success + '20' : theme.primary + '20',
              borderRadius: 6,
              padding: 6,
            }}
            activeOpacity={0.7}
          >
            <Feather
              name={isCopied ? 'check' : 'copy'}
              size={14}
              color={isCopied ? theme.success : theme.primary}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderSectionHeader = (title: string, icon: any) => (
    <View style={[styles.sectionHeader, { marginTop: 16, marginBottom: 8 }]}>
      <View style={styles.sectionIconContainer}>
        <Feather name={icon} size={16} color={theme.primary} />
      </View>
      <Text style={[styles.sectionTitle, { fontSize: 16 }]}>{title}</Text>
    </View>
  );

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

      {/* Compatibility Section */}
      {(match.compatibilityScore !== undefined || match.matchReason) && (
        <>
          {renderSectionHeader("Compatibility", "activity")}
          {match.compatibilityScore !== undefined && (
            <InfoRow
              label="Overall Score"
              value={`${(match.compatibilityScore * 100).toFixed(0)}%`}
              valueColor={theme.primary}
            />
          )}
          {match.bloodCompatibilityScore !== undefined && (
            <InfoRow label="Blood Match" value={`${(match.bloodCompatibilityScore * 100).toFixed(0)}%`} />
          )}
          {match.locationCompatibilityScore !== undefined && (
            <InfoRow label="Location Match" value={`${(match.locationCompatibilityScore * 100).toFixed(0)}%`} />
          )}
          {match.medicalCompatibilityScore !== undefined && (
            <InfoRow label="Medical Match" value={`${(match.medicalCompatibilityScore * 100).toFixed(0)}%`} />
          )}
          {match.urgencyPriorityScore !== undefined && (
            <InfoRow label="Urgency Score" value={`${(match.urgencyPriorityScore * 100).toFixed(0)}%`} />
          )}
          {match.matchReason && (
            <View style={{ paddingVertical: 8 }}>
              <Text style={[styles.text, { color: theme.textSecondary, fontSize: 12, marginBottom: 4 }]}>Match Reason</Text>
              <Text style={[styles.text, { color: theme.text }]}>{match.matchReason}</Text>
            </View>
          )}
        </>
      )}

      {/* Status Details Section */}
      {renderSectionHeader("Status Details", "clock")}

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

      {match.confirmationExpiresAt && !match.isConfirmed && !match.withdrawnAt && (
        <InfoRow
          label="Expires At"
          value={formatDate(match.confirmationExpiresAt)}
          valueColor={theme.error}
        />
      )}

      {match.firstConfirmer && (
        <InfoRow
          label="First Confirmed By"
          value={match.firstConfirmer}
        />
      )}

      {match.withdrawnAt && (
        <>
          <InfoRow
            label="Withdrawn At"
            value={formatDate(match.withdrawnAt)}
            valueColor={theme.error}
          />
          {match.withdrawnBy && (
            <InfoRow label="Withdrawn By" value={match.withdrawnBy} />
          )}
          {match.withdrawalReason && (
            <View style={{ paddingVertical: 8 }}>
              <Text style={[styles.text, { color: theme.textSecondary, fontSize: 12, marginBottom: 4 }]}>Withdrawal Reason</Text>
              <Text style={[styles.text, { color: theme.error }]}>{match.withdrawalReason}</Text>
            </View>
          )}
        </>
      )}

      {/* Completion Details Section */}
      {match.status === 'COMPLETED' && (
        <>
          {renderSectionHeader("Completion Details", "check-circle")}
          {match.completedAt && (
            <InfoRow label="Completed At" value={formatDate(match.completedAt)} />
          )}
          {match.hospitalName && (
            <InfoRow label="Hospital" value={match.hospitalName} />
          )}
          {match.receivedDate && (
            <InfoRow label="Received Date" value={match.receivedDate} />
          )}
          {match.recipientRating && (
            <InfoRow label="Rating" value={`${match.recipientRating} / 5`} />
          )}
          {match.completionNotes && (
            <View style={{ paddingVertical: 8 }}>
              <Text style={[styles.text, { color: theme.textSecondary, fontSize: 12, marginBottom: 4 }]}>Notes</Text>
              <Text style={[styles.text, { color: theme.text }]}>{match.completionNotes}</Text>
            </View>
          )}
        </>
      )}

      {/* IDs Section */}
      {renderSectionHeader("IDs", "hash")}
      {renderCopyableRow('Donation ID', match.donationId)}
      {renderCopyableRow('Request ID', match.receiveRequestId, true)}
    </View>
  );
};
