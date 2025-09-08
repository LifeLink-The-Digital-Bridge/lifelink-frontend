import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { createAuthStyles } from '../../constants/styles/authStyles';

interface ProfileContentProps {
  activeSegment: string;
  theme: any;
  donationsLoading: boolean;
  receivesLoading: boolean;
  donations: any[];
  receives: any[];
  mockReviews: any[];
  formatDate: (dateStr: string) => string;
}

export const ProfileContent: React.FC<ProfileContentProps> = ({
  activeSegment,
  theme,
  donationsLoading,
  receivesLoading,
  donations,
  receives,
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