import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { createUnifiedStyles } from '../../constants/styles/unifiedStyles';
import { getMyMatchesAsDonor, getMyMatchesAsRecipient } from '../api/matchingApi';
import * as SecureStore from 'expo-secure-store';
import { ValidationAlert } from '../../components/common/ValidationAlert';
import AppLayout from '../../components/AppLayout';

interface MatchResult {
  matchResultId: string;
  donationId: string;
  receiveRequestId: string;
  donorUserId: string;
  recipientUserId: string;
  donationType?: string;
  requestType?: string;
  bloodType?: string;
  matchType: string;
  isConfirmed: boolean;
  donorConfirmed: boolean;
  recipientConfirmed: boolean;
  donorConfirmedAt?: string;
  recipientConfirmedAt?: string;
  matchedAt: string;
  distance?: number;
}

const MatchResultsScreen = () => {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);
  const router = useRouter();

  const [donorMatches, setDonorMatches] = useState<MatchResult[]>([]);
  const [recipientMatches, setRecipientMatches] = useState<MatchResult[]>([]);
  const [activeTab, setActiveTab] = useState<'donor' | 'recipient'>('donor');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [isDonor, setIsDonor] = useState(false);
  const [isRecipient, setIsRecipient] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('info');

  const showAlert = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  const loadMatches = async () => {
    try {
      const userId = await SecureStore.getItemAsync('userId');
      const rolesString = await SecureStore.getItemAsync('roles');
      const roles = rolesString ? JSON.parse(rolesString) : [];
      
      setCurrentUserId(userId);
      setUserRoles(roles);
      
      let donorData: MatchResult[] = [];
      let recipientData: MatchResult[] = [];
      let hasDonorRole = false;
      let hasRecipientRole = false;
      
      if (roles.includes('DONOR')) {
        try {
          donorData = await getMyMatchesAsDonor();
          hasDonorRole = true;
        } catch (error: any) {
          if (error.message === 'NOT_REGISTERED_AS_DONOR') {
            console.log('User not registered as donor');
          } else {
            throw error;
          }
        }
      }
      
      if (roles.includes('RECIPIENT')) {
        try {
          recipientData = await getMyMatchesAsRecipient();
          hasRecipientRole = true;
        } catch (error: any) {
          if (error.message === 'NOT_REGISTERED_AS_RECIPIENT') {
            console.log('User not registered as recipient');
          } else {
            throw error;
          }
        }
      }
      
      setIsDonor(hasDonorRole);
      setIsRecipient(hasRecipientRole);
      setDonorMatches(donorData);
      setRecipientMatches(recipientData);
      
      if (hasDonorRole && !hasRecipientRole) {
        setActiveTab('donor');
      } else if (!hasDonorRole && hasRecipientRole) {
        setActiveTab('recipient');
      } else if (hasDonorRole && hasRecipientRole) {
        setActiveTab('donor');
      }
      
      if (!hasDonorRole && !hasRecipientRole) {
        showAlert('No Role', 'You need to register as a donor or recipient to view matches', 'warning');
      }
      
    } catch (error: any) {
      console.error('Error loading matches:', error);
      showAlert('Error', error.message || 'Failed to load matches', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadMatches();
  };

  const handleMatchPress = (match: MatchResult) => {
    router.push({
      pathname: '/navigation/MatchDetailsScreen',
      params: { matchData: JSON.stringify(match) }
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (match: MatchResult) => {
    const isConfirmed = match.isConfirmed;
    return isConfirmed ? theme.success : theme.error;
  };

  const getStatusText = (match: MatchResult) => {
    const isConfirmed = match.isConfirmed;
    if (isConfirmed) return 'Fully Confirmed';
    if (match.donorConfirmed && match.recipientConfirmed) return 'Both Confirmed';
    if (match.donorConfirmed || match.recipientConfirmed) return 'Partially Confirmed';
    return 'Pending';
  };

  const getUserRoleInMatch = (match: MatchResult) => {
    if (currentUserId === match.donorUserId) return 'donor';
    if (currentUserId === match.recipientUserId) return 'recipient';
    return 'unknown';
  };

  const getOtherPartyRole = (match: MatchResult) => {
    const userRole = getUserRoleInMatch(match);
    if (userRole === 'donor') return 'Recipient';
    if (userRole === 'recipient') return 'Donor';
    return 'Other Party';
  };

  const getMyStatus = (match: MatchResult) => {
    const userRole = getUserRoleInMatch(match);
    if (userRole === 'donor') return match.donorConfirmed;
    if (userRole === 'recipient') return match.recipientConfirmed;
    return false;
  };

  const getOtherPartyStatus = (match: MatchResult) => {
    const userRole = getUserRoleInMatch(match);
    if (userRole === 'donor') return match.recipientConfirmed;
    if (userRole === 'recipient') return match.donorConfirmed;
    return false;
  };

  const getCurrentMatches = () => {
    return activeTab === 'donor' ? donorMatches : recipientMatches;
  };

  const getTotalMatchCount = () => {
    return donorMatches.length + recipientMatches.length;
  };

  if (loading) {
    return (
      <AppLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>Loading matches...</Text>
        </View>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={20} color={theme.text} />
          </TouchableOpacity>

          <View style={styles.headerIconContainer}>
            <Feather name="activity" size={28} color={theme.primary} />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Match Results</Text>
            <Text style={styles.headerSubtitle}>View all donation matches</Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{getTotalMatchCount()} Matches</Text>
          </View>
        </View>

        {(isDonor || isRecipient) && (
          <View style={{ flexDirection: 'row', marginHorizontal: 20, marginBottom: 16, backgroundColor: theme.card, borderRadius: 12, padding: 4 }}>
            {isDonor && (
              <TouchableOpacity
                style={[
                  { flex: 1, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, alignItems: 'center' },
                  activeTab === 'donor' ? { backgroundColor: theme.primary } : {}
                ]}
                onPress={() => setActiveTab('donor')}
              >
                <Text style={[
                  { fontSize: 14, fontWeight: '600' },
                  activeTab === 'donor' ? { color: '#fff' } : { color: theme.text }
                ]}>
                  As Donor ({donorMatches.length})
                </Text>
              </TouchableOpacity>
            )}
            {isRecipient && (
              <TouchableOpacity
                style={[
                  { flex: 1, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, alignItems: 'center' },
                  activeTab === 'recipient' ? { backgroundColor: theme.primary } : {}
                ]}
                onPress={() => setActiveTab('recipient')}
              >
                <Text style={[
                  { fontSize: 14, fontWeight: '600' },
                  activeTab === 'recipient' ? { color: '#fff' } : { color: theme.text }
                ]}>
                  As Recipient ({recipientMatches.length})
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {getCurrentMatches().length === 0 ? (
            <View style={styles.promptContainer}>
              <View style={styles.promptIconContainer}>
                <Feather name="search" size={40} color={theme.textSecondary} />
              </View>
              <Text style={styles.promptTitle}>Still Searching for Matches</Text>
              <Text style={styles.promptSubtitle}>
                We're actively looking for compatible matches for you. Check back regularly for updates.
              </Text>
            </View>
          ) : (
            getCurrentMatches().map((match, index) => (
              <TouchableOpacity
                key={match.matchResultId || index}
                style={styles.card}
                onPress={() => handleMatchPress(match)}
                activeOpacity={0.7}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.headerTitle}>Match with {getOtherPartyRole(match)}</Text>
                    <Text style={styles.headerSubtitle}>{match.donationType || match.requestType || 'Unknown'} • {match.bloodType || 'Unknown Blood Type'}</Text>
                  </View>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(match) + '20', borderColor: getStatusColor(match) + '40' }
                  ]}>
                    <Text style={[styles.statusText, { color: getStatusColor(match) }]}>
                      {getStatusText(match)}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.labelText}>Your Role:</Text>
                  <Text style={styles.valueText}>{getUserRoleInMatch(match) === 'donor' ? 'Donor' : 'Recipient'}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.labelText}>Distance:</Text>
                  <Text style={styles.valueText}>{match.distance ? `${match.distance.toFixed(1)} km` : 'N/A'}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.labelText}>Your Status:</Text>
                  <Text style={[styles.valueText, { color: getMyStatus(match) ? theme.success : theme.error }]}>
                    {getMyStatus(match) ? '✓ Confirmed' : '⏳ Pending'}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.labelText}>{getOtherPartyRole(match)} Status:</Text>
                  <Text style={[styles.valueText, { color: getOtherPartyStatus(match) ? theme.success : theme.error }]}>
                    {getOtherPartyStatus(match) ? '✓ Confirmed' : '⏳ Pending'}
                  </Text>
                </View>

                <View style={[styles.infoRow, styles.lastInfoRow]}>
                  <Text style={styles.labelText}>Matched At:</Text>
                  <Text style={styles.valueText}>{match.matchedAt ? formatDate(match.matchedAt) : 'N/A'}</Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: theme.border + '30' }}>
                  <Feather name="eye" size={16} color={theme.primary} />
                  <Text style={[styles.labelText, { marginLeft: 8, color: theme.primary }]}>
                    Tap to view details
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        <ValidationAlert
          visible={alertVisible}
          title={alertTitle}
          message={alertMessage}
          type={alertType}
          onClose={() => setAlertVisible(false)}
        />
      </View>
    </AppLayout>
  );
};

export default MatchResultsScreen;
