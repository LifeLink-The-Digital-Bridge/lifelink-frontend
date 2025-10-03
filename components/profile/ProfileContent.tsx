import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { createAuthStyles } from '../../constants/styles/authStyles';

interface MatchHistoryItem {
  matchId: string;
  otherPartyName: string;
  otherPartyRole: 'Donor' | 'Recipient';
  matchType: string;
  matchedAt: string;
  isConfirmed: boolean;
  donationOrRequestType?: string;
}

interface ProfileContentProps {
  activeSegment: string;
  theme: any;
  donationsLoading: boolean;
  receivesLoading: boolean;
  historyLoading?: boolean;
  donations: any[];
  receives: any[];
  matchHistory?: MatchHistoryItem[];
  mockReviews: any[];
  formatDate: (dateStr: string) => string;
}

export const ProfileContent: React.FC<ProfileContentProps> = ({
  activeSegment,
  theme,
  donationsLoading,
  receivesLoading,
  historyLoading = false,
  donations,
  receives,
  matchHistory = [],
  mockReviews,
  formatDate
}) => {
  const router = useRouter();
  const styles = createAuthStyles(theme);

  const renderContent = () => {
    switch (activeSegment) {
      case "donations":
        if (donationsLoading) {
          return (
            <View style={{ padding: 20, alignItems: "center" }}>
              <ActivityIndicator size="small" color={theme.primary} />
              <Text style={{ marginTop: 10, color: theme.textSecondary }}>
                Loading donations...
              </Text>
            </View>
          );
        }
        return (
          <>
            <View style={{ padding: 20, alignItems: "center" }}>
              <Text style={{ color: theme.textSecondary }}>
                View detailed donation status in My Status
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.button, styles.secondary]}
              onPress={() => router.push("/navigation/StatusScreen")}
            >
              <Text style={styles.secondaryText}>View My Status</Text>
            </TouchableOpacity>
          </>
        );

      case "history":
        if (historyLoading) {
          return (
            <View style={{ padding: 20, alignItems: "center" }}>
              <ActivityIndicator size="small" color={theme.primary} />
              <Text style={{ marginTop: 10, color: theme.textSecondary }}>
                Loading match history...
              </Text>
            </View>
          );
        }
        
        if (!matchHistory.length) {
          return (
            <View style={{ padding: 20, alignItems: "center" }}>
              <Feather name="clock" size={48} color={theme.textSecondary} style={{ marginBottom: 12 }} />
              <Text style={{ color: theme.textSecondary, fontSize: 16, textAlign: 'center' }}>
                No match history yet
              </Text>
              <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 8, textAlign: 'center' }}>
                Your confirmed matches will appear here
              </Text>
            </View>
          );
        }

        return (
          <>
            {matchHistory.map((match, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.input,
                  { 
                    marginBottom: 12,
                    borderLeftWidth: 4,
                    borderLeftColor: match.isConfirmed ? theme.success : theme.primary
                  }
                ]}
                onPress={() => {
                  console.log('View match:', match.matchId);
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Feather 
                      name={match.otherPartyRole === 'Donor' ? 'heart' : 'user'} 
                      size={20} 
                      color={theme.primary} 
                      style={{ marginRight: 8 }}
                    />
                    <Text style={{ color: theme.text, fontWeight: "600", fontSize: 16 }}>
                      {match.otherPartyName}
                    </Text>
                  </View>
                  {match.isConfirmed && (
                    <View style={{ 
                      backgroundColor: theme.success + '20',
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 6
                    }}>
                      <Text style={{ color: theme.success, fontSize: 12, fontWeight: '600' }}>
                        ✓ Confirmed
                      </Text>
                    </View>
                  )}
                </View>

                <View style={{ flexDirection: 'row', marginBottom: 4 }}>
                  <Text style={{ color: theme.textSecondary, fontSize: 14 }}>
                    Role: <Text style={{ color: theme.text }}>{match.otherPartyRole}</Text>
                  </Text>
                  <Text style={{ color: theme.textSecondary, fontSize: 14, marginLeft: 16 }}>
                    Type: <Text style={{ color: theme.text }}>{match.matchType}</Text>
                  </Text>
                </View>

                {match.donationOrRequestType && (
                  <Text style={{ color: theme.textSecondary, fontSize: 14, marginBottom: 4 }}>
                    {match.donationOrRequestType}
                  </Text>
                )}

                <Text style={{ color: theme.textSecondary, fontSize: 12 }}>
                  Matched: {formatDate(match.matchedAt)}
                </Text>
              </TouchableOpacity>
            ))}
          </>
        );

      case "reviews":
        return (
          <>
            {mockReviews.map((review) => (
              <View key={review.id} style={[styles.input, { marginBottom: 12 }]}>
                <Text style={{ color: theme.text }}>{review.text}</Text>
                <Text style={{ color: theme.textSecondary, fontSize: 12 }}>
                  {formatDate(review.date)}
                </Text>
              </View>
            ))}
          </>
        );

      case "receives":
        if (receivesLoading) {
          return (
            <View style={{ padding: 20, alignItems: "center" }}>
              <ActivityIndicator size="small" color={theme.primary} />
              <Text style={{ marginTop: 10, color: theme.textSecondary }}>
                Loading requests...
              </Text>
            </View>
          );
        }
        if (!receives.length) {
          return (
            <View style={{ padding: 20, alignItems: "center" }}>
              <Text style={{ color: theme.textSecondary }}>No receive requests found.</Text>
            </View>
          );
        }
        return (
          <>
            {receives.slice(0, 3).map((req, idx) => (
              <View key={idx} style={[styles.input, { marginBottom: 12 }]}>
                <Text style={{ color: theme.text, fontWeight: "600", marginBottom: 4 }}>
                  {req.bloodType || "Unknown Type"}
                </Text>
                <Text style={{ color: theme.textSecondary }}>
                  Date: {formatDate(req.requestDate)}
                </Text>
                <Text style={{ color: theme.textSecondary }}>
                  Status: {req.status}
                </Text>
              </View>
            ))}
          </>
        );

      default:
        return null;
    }
  };

  return <View style={{ paddingHorizontal: 24 }}>{renderContent()}</View>;
};
