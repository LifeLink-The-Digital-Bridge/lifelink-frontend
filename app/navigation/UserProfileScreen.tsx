import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { createUnifiedStyles } from '../../constants/styles/unifiedStyles';
import { fetchUserById, getDonorByUserId, getRecipientByUserId, fetchDonorHistory, fetchRecipientHistory } from '../api/matchingApi';
import { formatDonorDetails, formatRecipientDetails } from '../../utils/detailsFormatter';
import { DetailsView } from '../../components/common/DetailsView';
import { ValidationAlert } from '../../components/common/ValidationAlert';
import AppLayout from '../../components/AppLayout';
import * as SecureStore from "expo-secure-store";


interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  profileImageUrl?: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  roles?: string[];
}

const UserProfileScreen = () => {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);
  const router = useRouter();
  const { userId, userName, profileType, fromMatch, donationStatus, requestStatus, matchId } = useLocalSearchParams();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [donorData, setDonorData] = useState<any>(null);
  const [recipientData, setRecipientData] = useState<any>(null);
  const [donorHistory, setDonorHistory] = useState<any[]>([]);
  const [recipientHistory, setRecipientHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
    const loadUserProfile = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const profileData = await fetchUserById(userId as string);
        setProfile(profileData);
        
        if (fromMatch === 'true' && profileType) {
          if (profileType === 'donor') {
            if (donationStatus === 'COMPLETED') {
              const currentUserId = await SecureStore.getItemAsync('userId');
              const history = await fetchRecipientHistory(currentUserId!);
              const matchHistory = history.find((h: any) => h.matchId === matchId);
              if (matchHistory?.donorSnapshot) {
                setDonorData(matchHistory.donorSnapshot);
              }
            } else {
              const donorDetails = await getDonorByUserId(userId as string);
              setDonorData(donorDetails);
            }
          } else if (profileType === 'recipient') {
            if (requestStatus === 'FULFILLED') {
              const currentUserId = await SecureStore.getItemAsync('userId');
              const history = await fetchDonorHistory(currentUserId!);
              const matchHistory = history.find((h: any) => h.matchId === matchId);
              if (matchHistory?.recipientSnapshot) {
                setRecipientData(matchHistory.recipientSnapshot);
              }
            } else {
              const recipientDetails = await getRecipientByUserId(userId as string);
              setRecipientData(recipientDetails);
            }
          }
        }
      } catch (error: any) {
        showAlert('Error', error.message || 'Failed to load user profile', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [userId, userName]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <AppLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </AppLayout>
    );
  }

  if (!profile) {
    return (
      <AppLayout>
        <View style={styles.promptContainer}>
          <Text style={styles.promptTitle}>Profile Not Found</Text>
          <TouchableOpacity style={styles.registerButton} onPress={() => router.back()}>
            <Feather name="arrow-left" size={16} color="#fff" />
            <Text style={styles.registerButtonText}>Go Back</Text>
          </TouchableOpacity>
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
            <Feather name="user" size={28} color={theme.primary} />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>{profileType === 'donor' ? 'Donor' : profileType === 'recipient' ? 'Recipient' : 'User'} Profile</Text>
            <Text style={styles.headerSubtitle}>{profile.name}</Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {profileType?.toUpperCase() || profile.roles?.join(', ') || 'User'}
            </Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Profile Header */}
          <View style={styles.sectionContainer}>
            <View style={{ alignItems: 'center', marginBottom: 24 }}>
              {profile.profileImageUrl ? (
                <Image 
                  source={{ uri: profile.profileImageUrl }} 
                  style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 16 }}
                />
              ) : (
                <View style={{ 
                  width: 100, 
                  height: 100, 
                  borderRadius: 50, 
                  backgroundColor: theme.primary + '20', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  marginBottom: 16
                }}>
                  <FontAwesome name="user" size={40} color={theme.primary} />
                </View>
              )}
              <Text style={[styles.headerTitle, { fontSize: 24, textAlign: 'center' }]}>
                {profile.name}
              </Text>
              <Text style={[styles.headerSubtitle, { textAlign: 'center' }]}>
                @{profile.username}
              </Text>
            </View>
          </View>

          {/* Basic Information */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconContainer}>
                <Feather name="info" size={18} color={theme.primary} />
              </View>
              <Text style={styles.sectionTitle}>Basic Information</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.labelText}>Email:</Text>
              <Text style={styles.valueText}>{profile.email}</Text>
            </View>

            {profile.phone && (
              <View style={styles.infoRow}>
                <Text style={styles.labelText}>Phone:</Text>
                <Text style={styles.valueText}>{profile.phone}</Text>
              </View>
            )}

            {profile.gender && (
              <View style={styles.infoRow}>
                <Text style={styles.labelText}>Gender:</Text>
                <Text style={styles.valueText}>{profile.gender}</Text>
              </View>
            )}

            {profile.dateOfBirth && (
              <View style={styles.infoRow}>
                <Text style={styles.labelText}>Date of Birth:</Text>
                <Text style={styles.valueText}>{formatDate(profile.dateOfBirth)}</Text>
              </View>
            )}

            {profile.roles && profile.roles.length > 0 && (
              <View style={[styles.infoRow, styles.lastInfoRow]}>
                <Text style={styles.labelText}>Roles:</Text>
                <Text style={styles.valueText}>{profile.roles.join(', ')}</Text>
              </View>
            )}
          </View>

          {/* Donor/Recipient Details */}
          {fromMatch === 'true' && donorData && (
            <DetailsView sections={formatDonorDetails(donorData)} />
          )}
          
          {fromMatch === 'true' && recipientData && (
            <DetailsView sections={formatRecipientDetails(recipientData)} />
          )}



          {/* Contact Actions */}
          {fromMatch === 'true' && (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconContainer}>
                  <Feather name="message-circle" size={18} color={theme.primary} />
                </View>
                <Text style={styles.sectionTitle}>Contact Options</Text>
              </View>

              <Text style={[styles.headerSubtitle, { textAlign: 'center', marginTop: 16 }]}>
                Contact information is available for matched users only. 
                Please coordinate through the LifeLink platform for safety and privacy.
              </Text>
            </View>
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

export default UserProfileScreen;