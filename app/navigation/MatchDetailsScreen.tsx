import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Feather, FontAwesome } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { createUnifiedStyles } from '../../constants/styles/unifiedStyles';
import AppLayout from '@/components/AppLayout';
import { ValidationAlert } from '../../components/common/ValidationAlert';

import {
  fetchUserById,
  donorConfirmMatch,
  recipientConfirmMatch,
  fetchDonationByIdWithAccess,
  fetchRequestByIdWithAccess,
  getDonorByUserId,
  getRecipientByUserId,
  fetchMatchHistory,
  fetchDonorHistoryByUser,
  fetchRecipientHistoryByUser,
} from '../api/matchingApi';

interface MatchDetails {
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
  confirmedAt?: string;
  matchedAt: string;
  distance?: number;
}

interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  profileImageUrl?: string;
  phone?: string;
  gender?: string;
}

const MatchDetailsScreen = () => {
  const { colorScheme } = useTheme();
  const { matchData } = useLocalSearchParams();
  const router = useRouter();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  const [match, setMatch] = useState<MatchDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmingMatch, setConfirmingMatch] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);

  const [donorProfile, setDonorProfile] = useState<UserProfile | null>(null);
  const [recipientProfile, setRecipientProfile] = useState<UserProfile | null>(null);

  const [donorData, setDonorData] = useState<any>(null);
  const [recipientData, setRecipientData] = useState<any>(null);

  const [donorHistoryData, setDonorHistoryData] = useState<any>(null);
  const [recipientHistoryData, setRecipientHistoryData] = useState<any>(null);
  const [matchHistory, setMatchHistory] = useState<any>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [yourDetails, setYourDetails] = useState<any>(null);
  const [loadingYourDetails, setLoadingYourDetails] = useState(false);

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

  const getUserRoleInMatch = (): 'donor' | 'recipient' | 'unknown' => {
    if (!match || !currentUserId) return 'unknown';
    if (currentUserId === match.donorUserId) return 'donor';
    if (currentUserId === match.recipientUserId) return 'recipient';
    return 'unknown';
  };

  const loadUserRoles = async () => {
    try {
      const rolesString = await SecureStore.getItemAsync('roles');
      const roles = rolesString ? JSON.parse(rolesString) : [];
      setUserRoles(roles);
    } catch (error) {
      console.log('Could not load user roles:', error);
    }
  };

  const loadMatchHistory = async (matchId: string) => {
    if (!match?.isConfirmed) return;
    
    setLoadingHistory(true);
    try {
      const history = await fetchMatchHistory(matchId);
      setMatchHistory(history);
      console.log('✅ Match history loaded:', history);
      
      if (history.donorHistory && history.donorHistory.length > 0) {
        setDonorHistoryData(history.donorHistory[0]);
      }
      
      if (history.recipientHistory && history.recipientHistory.length > 0) {
        setRecipientHistoryData(history.recipientHistory[0]); 
      }
    } catch (error: any) {
      console.log('Could not fetch match history:', error.message);
      
      try {
        const userRole = getUserRoleInMatch();
        if (userRole === 'donor') {
          const recipientHistory = await fetchRecipientHistoryByUser(match!.recipientUserId);
          if (recipientHistory.length > 0) {
            setRecipientHistoryData(recipientHistory[0]);
          }
        } else if (userRole === 'recipient') {
          const donorHistory = await fetchDonorHistoryByUser(match!.donorUserId);
          if (donorHistory.length > 0) {
            setDonorHistoryData(donorHistory[0]);
          }
        }
      } catch (fallbackError) {
        console.log('Fallback history fetch also failed:', fallbackError);
      }
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    const loadMatchDetails = async () => {
      if (!matchData) return;
      try {
        setLoading(true);
        
        const parsedMatch = JSON.parse(matchData as string);
        setMatch(parsedMatch);

        const userId = await SecureStore.getItemAsync('userId');
        setCurrentUserId(userId);

        await loadUserRoles();

        const [donorProfile, recipientProfile] = await Promise.all([
          fetchUserById(parsedMatch.donorUserId),
          fetchUserById(parsedMatch.recipientUserId)
        ]);
        setDonorProfile(donorProfile);
        setRecipientProfile(recipientProfile);

        if (parsedMatch.isConfirmed) {
          console.log('✅ Match is confirmed, loading history data...');
          await loadMatchHistory(parsedMatch.matchResultId);
        } else {
          console.log('⏳ Match not confirmed, loading current data...');
          try {
            const [donorDetails, recipientDetails] = await Promise.all([
              getDonorByUserId(parsedMatch.donorUserId),
              getRecipientByUserId(parsedMatch.recipientUserId)
            ]);
            setDonorData(donorDetails);
            setRecipientData(recipientDetails);
          } catch (error) {
            console.log('Could not fetch current donor/recipient details:', error);
          }
        }

        await loadYourDetails(parsedMatch, userId);

      } catch (error: any) {
        showAlert('Error', error.message || 'Failed to load match details', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadMatchDetails();
  }, [matchData]);

  useEffect(() => {
    if (match?.isConfirmed && !matchHistory && !loadingHistory) {
      loadMatchHistory(match.matchResultId);
    }
  }, [match?.isConfirmed]);

  const loadYourDetails = async (match: MatchDetails, userId: string | null) => {
    if (!userId) return;
    
    setLoadingYourDetails(true);
    try {
      if (match.donorUserId === userId) {
        const requestDetails = await fetchRequestByIdWithAccess(match.receiveRequestId);
        setYourDetails({ type: 'request', data: requestDetails });
      } else if (match.recipientUserId === userId) {
        const donationDetails = await fetchDonationByIdWithAccess(match.donationId);
        setYourDetails({ type: 'donation', data: donationDetails });
      }
    } catch (error: any) {
      console.log('Could not fetch your details:', error.message);
      setYourDetails(null);
    } finally {
      setLoadingYourDetails(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleConfirmMatch = async () => {
    if (!match || !currentUserId) return;
    setConfirmingMatch(true);
    try {
      let result;
      const userRole = getUserRoleInMatch();
      
      if (userRole === 'donor') {
        result = await donorConfirmMatch(match.matchResultId);
      } else if (userRole === 'recipient') {
        result = await recipientConfirmMatch(match.matchResultId);
      } else {
        throw new Error('You are not authorized to confirm this match');
      }
      
      showAlert('Match Confirmed', result, 'success');
      
      const updatedMatch = { ...match };
      if (userRole === 'donor') {
        updatedMatch.donorConfirmed = true;
        updatedMatch.donorConfirmedAt = new Date().toISOString();
      } else {
        updatedMatch.recipientConfirmed = true;
        updatedMatch.recipientConfirmedAt = new Date().toISOString();
      }
      updatedMatch.isConfirmed = updatedMatch.donorConfirmed && updatedMatch.recipientConfirmed;
      setMatch(updatedMatch);

      if (updatedMatch.isConfirmed) {
        setTimeout(() => {
          loadMatchHistory(match.matchResultId);
        }, 2000);
      }
    } catch (error: any) {
      showAlert('Confirmation Failed', error.message, 'error');
    } finally {
      setConfirmingMatch(false);
    }
  };

  const getCurrentUserRole = (): string => {
    const role = getUserRoleInMatch();
    return role === 'donor' ? 'Donor' : role === 'recipient' ? 'Recipient' : 'Unknown';
  };

  const getCurrentUserStatus = (): boolean => {
    if (!match || !currentUserId) return false;
    const role = getUserRoleInMatch();
    return role === 'donor' ? match.donorConfirmed : match.recipientConfirmed;
  };

  const getOtherPartyStatus = (): boolean => {
    if (!match || !currentUserId) return false;
    const role = getUserRoleInMatch();
    return role === 'donor' ? match.recipientConfirmed : match.donorConfirmed;
  };

  const canConfirmMatch = (): boolean => {
    if (!match || !currentUserId) return false;
    const userConfirmed = getCurrentUserStatus();
    const matchFullyConfirmed = match.isConfirmed;
    
    return !userConfirmed && !matchFullyConfirmed;
  };

  const getConfirmationButtonText = (): string => {
    return `Confirm as ${getCurrentUserRole()}`;
  };

  const getOtherPartyInfo = () => {
    if (!match || !currentUserId) return null;
    
    const userRole = getUserRoleInMatch();
    if (userRole === 'donor') {
      return {
        userId: match.recipientUserId,
        role: 'Recipient',
        profile: recipientProfile,
        data: match.isConfirmed ? recipientHistoryData : recipientData
      };
    } else if (userRole === 'recipient') {
      return {
        userId: match.donorUserId,
        role: 'Donor',
        profile: donorProfile,
        data: match.isConfirmed ? donorHistoryData : donorData
      };
    }
    return null;
  };

  const viewUserProfile = (userId: string, userName: string) => {
    const otherPartyInfo = getOtherPartyInfo();
    const profileType = otherPartyInfo?.role === 'Donor' ? 'donor' : 'recipient';
    router.push({
      pathname: '/navigation/UserProfileScreen',
      params: { 
        userId, 
        userName,
        profileType,
        fromMatch: 'true',
        matchId: match?.matchResultId
      }
    });
  };

  const renderMatchHistory = () => {
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

    if (!matchHistory && !donorHistoryData && !recipientHistoryData) {
      return (
        <View style={[styles.sectionContainer, { paddingHorizontal: 24 }]}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <Feather name="history" size={18} color={theme.primary} />
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
            <Feather name="history" size={18} color={theme.primary} />
          </View>
          <Text style={styles.sectionTitle}>Match History</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={[styles.labelText, { fontWeight: 'bold' }]}>Match Completed:</Text>
          <Text style={[styles.valueText, { color: theme.success }]}>
            ✓ {match.confirmedAt ? formatDate(match.confirmedAt) : 'Recently'}
          </Text>
        </View>

        {donorHistoryData && (
          <View style={{ marginTop: 16 }}>
            <Text style={[styles.labelText, { fontWeight: 'bold', marginBottom: 8 }]}>Donor History:</Text>
            <View style={{ marginLeft: 12 }}>
              {donorHistoryData.donationSnapshot && (
                <>
                  <View style={styles.infoRow}>
                    <Text style={styles.labelText}>Donation Type:</Text>
                    <Text style={styles.valueText}>{donorHistoryData.donationSnapshot.donationType || 'N/A'}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.labelText}>Blood Type:</Text>
                    <Text style={styles.valueText}>{donorHistoryData.donationSnapshot.bloodType || 'N/A'}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.labelText}>Quantity:</Text>
                    <Text style={styles.valueText}>{donorHistoryData.donationSnapshot.quantity || 'N/A'} units</Text>
                  </View>
                </>
              )}
              {donorHistoryData.medicalDetailsSnapshot && (
                <>
                  <View style={styles.infoRow}>
                    <Text style={styles.labelText}>Hemoglobin Level:</Text>
                    <Text style={styles.valueText}>{donorHistoryData.medicalDetailsSnapshot.hemoglobinLevel || 'N/A'}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.labelText}>Overall Health:</Text>
                    <Text style={styles.valueText}>{donorHistoryData.medicalDetailsSnapshot.overallHealthStatus || 'N/A'}</Text>
                  </View>
                </>
              )}
            </View>
          </View>
        )}

        {recipientHistoryData && (
          <View style={{ marginTop: 16 }}>
            <Text style={[styles.labelText, { fontWeight: 'bold', marginBottom: 8 }]}>Recipient History:</Text>
            <View style={{ marginLeft: 12 }}>
              {recipientHistoryData.receiveRequestSnapshot && (
                <>
                  <View style={styles.infoRow}>
                    <Text style={styles.labelText}>Request Type:</Text>
                    <Text style={styles.valueText}>{recipientHistoryData.receiveRequestSnapshot.requestType || 'N/A'}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.labelText}>Blood Type Needed:</Text>
                    <Text style={styles.valueText}>{recipientHistoryData.receiveRequestSnapshot.requestedBloodType || 'N/A'}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.labelText}>Urgency Level:</Text>
                    <Text style={[styles.valueText, { 
                      color: recipientHistoryData.receiveRequestSnapshot.urgencyLevel === 'CRITICAL' ? theme.error : 
                             recipientHistoryData.receiveRequestSnapshot.urgencyLevel === 'HIGH' ? '#FF6B35' : 
                             recipientHistoryData.receiveRequestSnapshot.urgencyLevel === 'MEDIUM' ? '#FFA500' : theme.success 
                    }]}>
                      {recipientHistoryData.receiveRequestSnapshot.urgencyLevel || 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.labelText}>Quantity Needed:</Text>
                    <Text style={styles.valueText}>{recipientHistoryData.receiveRequestSnapshot.quantity || 'N/A'} units</Text>
                  </View>
                </>
              )}
              {recipientHistoryData.medicalDetailsSnapshot && (
                <>
                  <View style={styles.infoRow}>
                    <Text style={styles.labelText}>Diagnosis:</Text>
                    <Text style={styles.valueText}>{recipientHistoryData.medicalDetailsSnapshot.diagnosis || 'N/A'}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.labelText}>Overall Health:</Text>
                    <Text style={styles.valueText}>{recipientHistoryData.medicalDetailsSnapshot.overallHealthStatus || 'N/A'}</Text>
                  </View>
                </>
              )}
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderYourDetails = () => {
    if (loadingYourDetails) {
      return (
        <View style={[styles.sectionContainer, { paddingHorizontal: 24 }]}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <Feather name="clock" size={18} color={theme.primary} />
            </View>
            <Text style={styles.sectionTitle}>Loading Your Details...</Text>
          </View>
          <Text style={styles.loadingText}>Please wait...</Text>
        </View>
      );
    }

    const userRole = getUserRoleInMatch();
    const title = userRole === 'donor' ? 'Your Match Details (Request)' : 'Your Match Details (Donation)';
    const icon = userRole === 'donor' ? 'clipboard' : 'droplet';

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
      <View style={[styles.sectionContainer, { paddingHorizontal: 24 }]}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIconContainer}>
            <Feather name={icon as any} size={18} color={theme.primary} />
          </View>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>

        {userRole === 'donor' ? (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.labelText}>Request Type:</Text>
              <Text style={styles.valueText}>{data.requestType || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.labelText}>Blood Type Needed:</Text>
              <Text style={styles.valueText}>{data.requestedBloodType || 'N/A'}</Text>
            </View>
            {data.requestedOrgan && (
              <View style={styles.infoRow}>
                <Text style={styles.labelText}>Organ Needed:</Text>
                <Text style={styles.valueText}>{data.requestedOrgan}</Text>
              </View>
            )}
            <View style={styles.infoRow}>
              <Text style={styles.labelText}>Urgency Level:</Text>
              <Text style={[styles.valueText, { 
                color: data.urgencyLevel === 'CRITICAL' ? theme.error : 
                       data.urgencyLevel === 'HIGH' ? '#FF6B35' : 
                       data.urgencyLevel === 'MEDIUM' ? '#FFA500' : theme.success 
              }]}>
                {data.urgencyLevel || 'N/A'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.labelText}>Quantity Needed:</Text>
              <Text style={styles.valueText}>{data.quantity || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.labelText}>Status:</Text>
              <Text style={[styles.valueText, { 
                color: data.status === 'FULFILLED' ? theme.success : 
                       data.status === 'PENDING' ? theme.error : theme.text 
              }]}>
                {data.status || 'N/A'}
              </Text>
            </View>
            {data.notes && (
              <View style={styles.infoRow}>
                <Text style={styles.labelText}>Notes:</Text>
                <Text style={styles.valueText}>{data.notes}</Text>
              </View>
            )}
            <View style={[styles.infoRow, styles.lastInfoRow]}>
              <Text style={styles.labelText}>Request Date:</Text>
              <Text style={styles.valueText}>
                {data.requestDate ? new Date(data.requestDate).toLocaleDateString() : 'N/A'}
              </Text>
            </View>
          </>
        ) : (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.labelText}>Donation Type:</Text>
              <Text style={styles.valueText}>{data.donationType || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.labelText}>Blood Type:</Text>
              <Text style={styles.valueText}>{data.bloodType || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.labelText}>Quantity:</Text>
              <Text style={styles.valueText}>{data.quantity || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.labelText}>Status:</Text>
              <Text style={[styles.valueText, { 
                color: data.status === 'COMPLETED' ? theme.success : 
                       data.status === 'PENDING' ? theme.error : theme.text 
              }]}>
                {data.status || 'N/A'}
              </Text>
            </View>
            {data.notes && (
              <View style={styles.infoRow}>
                <Text style={styles.labelText}>Notes:</Text>
                <Text style={styles.valueText}>{data.notes}</Text>
              </View>
            )}
            <View style={[styles.infoRow, styles.lastInfoRow]}>
              <Text style={styles.labelText}>Donation Date:</Text>
              <Text style={styles.valueText}>
                {data.donationDate ? new Date(data.donationDate).toLocaleDateString() : 'N/A'}
              </Text>
            </View>
          </>
        )}
      </View>
    );
  };

  const renderUserProfile = (user: UserProfile, title: string, iconName: string) => (
    <View style={[styles.sectionContainer, { paddingHorizontal: 24 }]}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconContainer}>
          <Feather name={iconName as any} size={18} color={theme.primary} />
        </View>
        <Text style={styles.sectionTitle}>{title} Profile</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        {user.profileImageUrl ? (
          <Image 
            source={{ uri: user.profileImageUrl }} 
            style={{ width: 60, height: 60, borderRadius: 30, marginRight: 16 }}
          />
        ) : (
          <View style={{ 
            width: 60, 
            height: 60, 
            borderRadius: 30, 
            backgroundColor: theme.primary + '20', 
            justifyContent: 'center', 
            alignItems: 'center',
            marginRight: 16
          }}>
            <FontAwesome name="user" size={24} color={theme.primary} />
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { fontSize: 18 }]}>{user.name}</Text>
          <Text style={styles.headerSubtitle}>@{user.username}</Text>
        </View>
        <TouchableOpacity
          style={[styles.locationButton, { paddingHorizontal: 12, paddingVertical: 8 }]}
          onPress={() => viewUserProfile(user.id, user.name)}
        >
          <Feather name="eye" size={14} color="#fff" />
          <Text style={[styles.locationButtonText, { fontSize: 12, marginLeft: 4 }]}>View</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.labelText}>Email:</Text>
        <Text style={styles.valueText}>{user.email}</Text>
      </View>
      {user.phone && (
        <View style={styles.infoRow}>
          <Text style={styles.labelText}>Phone:</Text>
          <Text style={styles.valueText}>{user.phone}</Text>
        </View>
      )}
      {user.gender && (
        <View style={[styles.infoRow, styles.lastInfoRow]}>
          <Text style={styles.labelText}>Gender:</Text>
          <Text style={styles.valueText}>{user.gender}</Text>
        </View>
      )}
    </View>
  );

  const renderOtherPartyMedicalDetails = () => {
    const otherPartyInfo = getOtherPartyInfo();
    if (!otherPartyInfo?.data) return null;

    const isDonor = otherPartyInfo.role === 'Donor';
    
    const isHistoricalData = match?.isConfirmed && (donorHistoryData || recipientHistoryData);
    const dataSource = isHistoricalData ? 'Historical' : 'Current';
    
    return (
      <View style={[styles.sectionContainer, { paddingHorizontal: 24 }]}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIconContainer}>
            <Feather name={isDonor ? "heart" : "user"} size={18} color={theme.primary} />
          </View>
          <Text style={styles.sectionTitle}>
            {otherPartyInfo.role} Medical Details {isHistoricalData && '(Historical)'}
          </Text>
        </View>
        
        {/* Handle historical data structure vs current data structure */}
        {(() => {
          let medicalDetails;
          let eligibilityCriteria;
          
          if (isHistoricalData && otherPartyInfo.data.medicalDetailsSnapshot) {
            medicalDetails = otherPartyInfo.data.medicalDetailsSnapshot;
            eligibilityCriteria = otherPartyInfo.data.eligibilityCriteriaSnapshot;
          } else {
            medicalDetails = otherPartyInfo.data.medicalDetails;
            eligibilityCriteria = otherPartyInfo.data.eligibilityCriteria;
          }
          
          return (
            <>
              {medicalDetails && (
                <>
                  {isDonor ? (
                    <>
                      <View style={styles.infoRow}>
                        <Text style={styles.labelText}>Blood Pressure:</Text>
                        <Text style={styles.valueText}>{medicalDetails.bloodPressure || 'N/A'}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Text style={styles.labelText}>Hemoglobin Level:</Text>
                        <Text style={styles.valueText}>{medicalDetails.hemoglobinLevel || 'N/A'}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Text style={styles.labelText}>Overall Health:</Text>
                        <Text style={styles.valueText}>{medicalDetails.overallHealthStatus || 'N/A'}</Text>
                      </View>
                    </>
                  ) : (
                    <>
                      <View style={styles.infoRow}>
                        <Text style={styles.labelText}>Diagnosis:</Text>
                        <Text style={styles.valueText}>{medicalDetails.diagnosis || 'N/A'}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Text style={styles.labelText}>Overall Health:</Text>
                        <Text style={styles.valueText}>{medicalDetails.overallHealthStatus || 'N/A'}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Text style={styles.labelText}>Hemoglobin Level:</Text>
                        <Text style={styles.valueText}>{medicalDetails.hemoglobinLevel || 'N/A'}</Text>
                      </View>
                    </>
                  )}
                </>
              )}

              {eligibilityCriteria && (
                <>
                  <View style={styles.infoRow}>
                    <Text style={styles.labelText}>Age:</Text>
                    <Text style={styles.valueText}>{eligibilityCriteria.age || 'N/A'}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.labelText}>Weight:</Text>
                    <Text style={styles.valueText}>
                      {eligibilityCriteria.weight ? `${eligibilityCriteria.weight} kg` : 'N/A'}
                    </Text>
                  </View>
                  <View style={[styles.infoRow, styles.lastInfoRow]}>
                    <Text style={styles.labelText}>{isDonor ? 'Body Size' : 'Medical Eligibility'}:</Text>
                    <Text style={[styles.valueText, { 
                      color: isDonor ? theme.text : 
                             (eligibilityCriteria.medicallyEligible ? theme.success : theme.error)
                    }]}>
                      {isDonor 
                        ? (eligibilityCriteria.bodySize || 'N/A')
                        : (eligibilityCriteria.medicallyEligible ? '✓ Eligible' : '⚠ Not Eligible')
                      }
                    </Text>
                  </View>
                </>
              )}
            </>
          );
        })()}
      </View>
    );
  };

  if (loading) {
    return (
      <AppLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>Loading match details...</Text>
        </View>
      </AppLayout>
    );
  }

  if (!match) {
    return (
      <AppLayout>
        <View style={styles.promptContainer}>
          <Text style={styles.promptTitle}>Match Not Found</Text>
          <TouchableOpacity style={styles.registerButton} onPress={() => router.back()}>
            <Feather name="arrow-left" size={16} color="#fff" />
            <Text style={styles.registerButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </AppLayout>
    );
  }

  const otherPartyInfo = getOtherPartyInfo();

  return (
    <AppLayout>
      <View style={styles.container}>
        {/* Header with padding */}
        <View style={[styles.headerContainer, { paddingHorizontal: 24 }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={20} color={theme.text} />
          </TouchableOpacity>

          <View style={styles.headerIconContainer}>
            <Feather name="link" size={28} color={theme.primary} />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Match Details</Text>
            <Text style={styles.headerSubtitle}>#{match.matchResultId.slice(0, 8)}</Text>
          </View>
          <View style={[
            styles.statusBadge,
            { 
              backgroundColor: match.isConfirmed ? theme.success + '20' : theme.error + '20',
              borderColor: match.isConfirmed ? theme.success + '40' : theme.error + '40'
            }
          ]}>
            <Text style={[
              styles.statusText, 
              { color: match.isConfirmed ? theme.success : theme.error }
            ]}>
              {match.isConfirmed ? 'Confirmed' : 'Pending'}
            </Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Match Information */}
          <View style={[styles.sectionContainer, { paddingHorizontal: 24 }]}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconContainer}>
                <Feather name="activity" size={18} color={theme.primary} />
              </View>
              <Text style={styles.sectionTitle}>Match Information</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.labelText}>Your Role:</Text>
              <Text style={styles.valueText}>{getCurrentUserRole()}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.labelText}>Match Type:</Text>
              <Text style={styles.valueText}>{match.matchType || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.labelText}>Type:</Text>
              <Text style={styles.valueText}>{match.donationType || match.requestType || 'N/A'}</Text>
            </View>

            {match.distance !== undefined && (
              <View style={styles.infoRow}>
                <Text style={styles.labelText}>Distance:</Text>
                <Text style={styles.valueText}>{match.distance.toFixed(1)} km</Text>
              </View>
            )}

            <View style={styles.infoRow}>
              <Text style={styles.labelText}>Your Status:</Text>
              <Text style={[styles.valueText, { 
                color: getCurrentUserStatus() ? theme.success : theme.error 
              }]}>
                {getCurrentUserStatus() ? '✓ Confirmed' : '⏳ Pending'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.labelText}>{otherPartyInfo?.role || 'Other Party'} Status:</Text>
              <Text style={[styles.valueText, { 
                color: getOtherPartyStatus() ? theme.success : theme.error 
              }]}>
                {getOtherPartyStatus() ? '✓ Confirmed' : '⏳ Pending'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.labelText}>Matched At:</Text>
              <Text style={styles.valueText}>{formatDate(match.matchedAt)}</Text>
            </View>
            {match.confirmedAt && (
              <View style={styles.infoRow}>
                <Text style={styles.labelText}>Confirmed At:</Text>
                <Text style={styles.valueText}>{formatDate(match.confirmedAt)}</Text>
              </View>
            )}
            <View style={styles.infoRow}>
              <Text style={styles.labelText}>Donation ID:</Text>
              <Text style={styles.valueText}>{match.donationId}</Text>
            </View>
            <View style={[styles.infoRow, styles.lastInfoRow]}>
              <Text style={styles.labelText}>Request ID:</Text>
              <Text style={styles.valueText}>{match.receiveRequestId}</Text>
            </View>
          </View>

          {/* Your Details Section */}
          {renderYourDetails()}

          {/* Other Party Profile */}
          {otherPartyInfo?.profile && renderUserProfile(
            otherPartyInfo.profile, 
            otherPartyInfo.role, 
            otherPartyInfo.role === 'Donor' ? 'heart' : 'user'
          )}

          {/* Other Party Medical Details */}
          {renderOtherPartyMedicalDetails()}

          {/* ✅ Match History Section - Shows historical data for confirmed matches */}
          {renderMatchHistory()}
        </ScrollView>

        {/* Confirm Button */}
        {canConfirmMatch() && (
          <View style={[styles.submitButtonContainer, { paddingHorizontal: 24 }]}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                confirmingMatch ? styles.submitButtonDisabled : null,
              ]}
              onPress={handleConfirmMatch}
              disabled={confirmingMatch}
              activeOpacity={0.8}
            >
              {confirmingMatch ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>{getConfirmationButtonText()}</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

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

export default MatchDetailsScreen;
