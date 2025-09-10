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
  fetchDonationById,
  fetchRequestById,
  fetchDonationStatus,
  fetchRequestStatus,
  getDonorByUserId,
  getRecipientByUserId,
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

  // User profiles
  const [donorProfile, setDonorProfile] = useState<UserProfile | null>(null);
  const [recipientProfile, setRecipientProfile] = useState<UserProfile | null>(null);

  // Medical data
  const [donorData, setDonorData] = useState<any>(null);
  const [recipientData, setRecipientData] = useState<any>(null);

  // Donation/Request details
  const [donationDetails, setDonationDetails] = useState<any>(null);
  const [requestDetails, setRequestDetails] = useState<any>(null);
  const [donationStatus, setDonationStatus] = useState<string>('');
  const [requestStatus, setRequestStatus] = useState<string>('');

  // Alert state
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

  useEffect(() => {
    const loadMatchDetails = async () => {
      if (!matchData) return;
      try {
        setLoading(true);
        
        const parsedMatch = JSON.parse(matchData as string);
        setMatch(parsedMatch);

        const userId = await SecureStore.getItemAsync('userId');
        setCurrentUserId(userId);

        // Load user profiles
        const [donorProfile, recipientProfile] = await Promise.all([
          fetchUserById(parsedMatch.donorUserId),
          fetchUserById(parsedMatch.recipientUserId)
        ]);
        setDonorProfile(donorProfile);
        setRecipientProfile(recipientProfile);

        // Load medical data
        try {
          const [donorDetails, recipientDetails] = await Promise.all([
            getDonorByUserId(parsedMatch.donorUserId),
            getRecipientByUserId(parsedMatch.recipientUserId)
          ]);
          setDonorData(donorDetails);
          setRecipientData(recipientDetails);
        } catch (error) {
          console.log('Could not fetch donor/recipient details:', error);
        }

        // Load donation/request details and status
        try {
          const [donationData, requestData, donationStat, requestStat] = await Promise.all([
            fetchDonationById(parsedMatch.donationId),
            fetchRequestById(parsedMatch.receiveRequestId),
            fetchDonationStatus(parsedMatch.donationId),
            fetchRequestStatus(parsedMatch.receiveRequestId)
          ]);
          setDonationDetails(donationData);
          setRequestDetails(requestData);
          setDonationStatus(donationStat);
          setRequestStatus(requestStat);
        } catch (error) {
          console.log('Could not fetch donation/request details:', error);
        }
      } catch (error: any) {
        showAlert('Error', error.message || 'Failed to load match details', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadMatchDetails();
  }, [matchData]);

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
      if (match.donorUserId === currentUserId) {
        result = await donorConfirmMatch(match.matchResultId);
      } else if (match.recipientUserId === currentUserId) {
        result = await recipientConfirmMatch(match.matchResultId);
      } else {
        throw new Error('You are not authorized to confirm this match');
      }
      
      showAlert('Match Confirmed', result, 'success');
      
      const updatedMatch = { ...match };
      if (match.donorUserId === currentUserId) {
        updatedMatch.donorConfirmed = true;
        updatedMatch.donorConfirmedAt = new Date().toISOString();
      } else {
        updatedMatch.recipientConfirmed = true;
        updatedMatch.recipientConfirmedAt = new Date().toISOString();
      }
      updatedMatch.isConfirmed = updatedMatch.donorConfirmed && updatedMatch.recipientConfirmed;
      setMatch(updatedMatch);
    } catch (error: any) {
      showAlert('Confirmation Failed', error.message, 'error');
    } finally {
      setConfirmingMatch(false);
    }
  };

  const getUserRoleInMatch = () => {
    if (!match || !currentUserId) return 'unknown';
    if (currentUserId === match.donorUserId) return 'donor';
    if (currentUserId === match.recipientUserId) return 'recipient';
    return 'unknown';
  };

  const getCurrentUserRole = () => {
    if (!match || !currentUserId) return 'Unknown';
    if (currentUserId === match.donorUserId) return 'Donor';
    if (currentUserId === match.recipientUserId) return 'Recipient';
    return 'Unknown';
  };

  const getCurrentUserStatus = () => {
    if (!match || !currentUserId) return false;
    if (currentUserId === match.donorUserId) return match.donorConfirmed;
    if (currentUserId === match.recipientUserId) return match.recipientConfirmed;
    return false;
  };

  const getOtherPartyStatus = () => {
    if (!match || !currentUserId) return false;
    if (currentUserId === match.donorUserId) return match.recipientConfirmed;
    if (currentUserId === match.recipientUserId) return match.donorConfirmed;
    return false;
  };

  const canConfirmMatch = () => {
    if (!match || !currentUserId) return false;
    const isPending = donationStatus === 'PENDING' && requestStatus === 'PENDING';
    const notConfirmed = !getCurrentUserStatus();
    return isPending && notConfirmed;
  };

  const getConfirmationButtonText = () => {
    if (!match || !currentUserId) return 'Confirm Match';
    return `Confirm as ${getCurrentUserRole()}`;
  };

  const getOtherPartyInfo = () => {
    if (!match || !currentUserId) return null;
    
    if (currentUserId === match.donorUserId) {
      return {
        userId: match.recipientUserId,
        role: 'Recipient',
        profile: recipientProfile,
        data: recipientData
      };
    } else if (currentUserId === match.recipientUserId) {
      return {
        userId: match.donorUserId,
        role: 'Donor',
        profile: donorProfile,
        data: donorData
      };
    }
    return null;
  };

  const getCurrentUserInfo = () => {
    if (!match || !currentUserId) return null;
    
    if (currentUserId === match.donorUserId) {
      return {
        userId: match.donorUserId,
        role: 'Donor',
        profile: donorProfile,
        data: donorData
      };
    } else if (currentUserId === match.recipientUserId) {
      return {
        userId: match.recipientUserId,
        role: 'Recipient',
        profile: recipientProfile,
        data: recipientData
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
        donationStatus,
        requestStatus,
        matchId: match?.matchResultId
      }
    });
  };

  const renderUserProfile = (user: UserProfile, title: string, iconName: string, isCurrentUser = false) => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconContainer}>
          <Feather name={iconName as any} size={18} color={theme.primary} />
        </View>
        <Text style={styles.sectionTitle}>
          {isCurrentUser ? `Your Profile (${title})` : `${title} Profile`}
        </Text>
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
          <Text style={[styles.headerTitle, { fontSize: 18 }]}>
            {isCurrentUser ? `${user.name} (You)` : user.name}
          </Text>
          <Text style={styles.headerSubtitle}>@{user.username}</Text>
        </View>
        {!isCurrentUser && (
          <TouchableOpacity
            style={[styles.locationButton, { paddingHorizontal: 12, paddingVertical: 8 }]}
            onPress={() => viewUserProfile(user.id, user.name)}
          >
            <Feather name="eye" size={14} color="#fff" />
            <Text style={[styles.locationButtonText, { fontSize: 12, marginLeft: 4 }]}>View</Text>
          </TouchableOpacity>
        )}
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

  const renderDonorDetails = (donor: any, isCurrentUser = false) => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconContainer}>
          <Feather name="heart" size={18} color={theme.primary} />
        </View>
        <Text style={styles.sectionTitle}>
          {isCurrentUser ? 'Your Donor Details' : 'Donor Details'}
        </Text>
      </View>
      
      {donor?.medicalDetails && (
        <>
          <View style={styles.infoRow}>
            <Text style={styles.labelText}>Blood Type:</Text>
            <Text style={styles.valueText}>{donor.medicalDetails.bloodPressure || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.labelText}>Hemoglobin Level:</Text>
            <Text style={styles.valueText}>{donor.medicalDetails.hemoglobinLevel || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.labelText}>Overall Health:</Text>
            <Text style={styles.valueText}>{donor.medicalDetails.overallHealthStatus || 'N/A'}</Text>
          </View>
        </>
      )}

      {donor?.eligibilityCriteria && (
        <>
          <View style={styles.infoRow}>
            <Text style={styles.labelText}>Age:</Text>
            <Text style={styles.valueText}>{donor.eligibilityCriteria.age || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.labelText}>Weight:</Text>
            <Text style={styles.valueText}>{donor.eligibilityCriteria.weight ? `${donor.eligibilityCriteria.weight} kg` : 'N/A'}</Text>
          </View>
          <View style={[styles.infoRow, styles.lastInfoRow]}>
            <Text style={styles.labelText}>Body Size:</Text>
            <Text style={styles.valueText}>{donor.eligibilityCriteria.bodySize || 'N/A'}</Text>
          </View>
        </>
      )}
    </View>
  );

  const renderRecipientDetails = (recipient: any, isCurrentUser = false) => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconContainer}>
          <Feather name="user" size={18} color={theme.primary} />
        </View>
        <Text style={styles.sectionTitle}>
          {isCurrentUser ? 'Your Recipient Details' : 'Recipient Details'}
        </Text>
      </View>
      
      {recipient?.medicalDetails && (
        <>
          <View style={styles.infoRow}>
            <Text style={styles.labelText}>Diagnosis:</Text>
            <Text style={styles.valueText}>{recipient.medicalDetails.diagnosis || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.labelText}>Overall Health:</Text>
            <Text style={styles.valueText}>{recipient.medicalDetails.overallHealthStatus || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.labelText}>Hemoglobin Level:</Text>
            <Text style={styles.valueText}>{recipient.medicalDetails.hemoglobinLevel || 'N/A'}</Text>
          </View>
        </>
      )}

      {recipient?.eligibilityCriteria && (
        <>
          <View style={styles.infoRow}>
            <Text style={styles.labelText}>Age:</Text>
            <Text style={styles.valueText}>{recipient.eligibilityCriteria.age || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.labelText}>Weight:</Text>
            <Text style={styles.valueText}>{recipient.eligibilityCriteria.weight ? `${recipient.eligibilityCriteria.weight} kg` : 'N/A'}</Text>
          </View>
          <View style={[styles.infoRow, styles.lastInfoRow]}>
            <Text style={styles.labelText}>Medical Eligibility:</Text>
            <Text style={[styles.valueText, { 
              color: recipient.eligibilityCriteria.medicallyEligible ? theme.success : theme.error 
            }]}>
              {recipient.eligibilityCriteria.medicallyEligible ? '✓ Eligible' : '⚠ Not Eligible'}
            </Text>
          </View>
        </>
      )}
    </View>
  );

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

  const currentUserInfo = getCurrentUserInfo();
  const otherPartyInfo = getOtherPartyInfo();

  return (
    <AppLayout>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
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
          <View style={styles.sectionContainer}>
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
              <Text style={styles.labelText}>Type:</Text>
              <Text style={styles.valueText}>{match.donationType || match.requestType || 'N/A'}</Text>
            </View>

            {match.distance && (
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

          {/* Current User Profile */}
          {currentUserInfo?.profile && renderUserProfile(
            currentUserInfo.profile, 
            currentUserInfo.role, 
            currentUserInfo.role === 'Donor' ? 'heart' : 'user',
            true
          )}

          {/* Other Party Profile */}
          {otherPartyInfo?.profile && renderUserProfile(
            otherPartyInfo.profile, 
            otherPartyInfo.role, 
            otherPartyInfo.role === 'Donor' ? 'heart' : 'user',
            false
          )}

          {/* Current User Medical Details */}
          {currentUserInfo?.role === 'Donor' && currentUserInfo?.data && 
            renderDonorDetails(currentUserInfo.data, true)}
          
          {currentUserInfo?.role === 'Recipient' && currentUserInfo?.data && 
            renderRecipientDetails(currentUserInfo.data, true)}

          {/* Other Party Medical Details */}
          {otherPartyInfo?.role === 'Donor' && otherPartyInfo?.data && 
            renderDonorDetails(otherPartyInfo.data, false)}
          
          {otherPartyInfo?.role === 'Recipient' && otherPartyInfo?.data && 
            renderRecipientDetails(otherPartyInfo.data, false)}

          {/* Donation Details */}
          {donationDetails && (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconContainer}>
                  <Feather name="droplet" size={18} color={theme.primary} />
                </View>
                <Text style={styles.sectionTitle}>Donation Details</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.labelText}>Type:</Text>
                <Text style={styles.valueText}>{String(donationDetails.donationType || 'N/A')}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.labelText}>Blood Type:</Text>
                <Text style={styles.valueText}>{String(donationDetails.bloodType || 'N/A')}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.labelText}>Quantity:</Text>
                <Text style={styles.valueText}>{String(donationDetails.quantity || 'N/A')}</Text>
              </View>

              <View style={[styles.infoRow, styles.lastInfoRow]}>
                <Text style={styles.labelText}>Status:</Text>
                <Text style={[styles.valueText, { 
                  color: donationStatus === 'COMPLETED' ? theme.success : 
                         donationStatus === 'PENDING' ? theme.error : theme.text 
                }]}>
                  {String(donationStatus || 'N/A')}
                </Text>
              </View>
            </View>
          )}

          {/* Request Details */}
          {requestDetails && (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconContainer}>
                  <Feather name="clipboard" size={18} color={theme.primary} />
                </View>
                <Text style={styles.sectionTitle}>Request Details</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.labelText}>Type:</Text>
                <Text style={styles.valueText}>{String(requestDetails.requestType || 'N/A')}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.labelText}>Blood Type:</Text>
                <Text style={styles.valueText}>{String(requestDetails.requestedBloodType || 'N/A')}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.labelText}>Urgency:</Text>
                <Text style={styles.valueText}>{String(requestDetails.urgencyLevel || 'N/A')}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.labelText}>Quantity:</Text>
                <Text style={styles.valueText}>{String(requestDetails.quantity || 'N/A')}</Text>
              </View>
              <View style={[styles.infoRow, styles.lastInfoRow]}>
                <Text style={styles.labelText}>Status:</Text>
                <Text style={[styles.valueText, { 
                  color: requestStatus === 'FULFILLED' ? theme.success : 
                         requestStatus === 'PENDING' ? theme.error : theme.text 
                }]}>
                  {String(requestStatus || 'N/A')}
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Confirm Button - Fixed */}
        {canConfirmMatch() && (
          <View style={styles.submitButtonContainer}>
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
