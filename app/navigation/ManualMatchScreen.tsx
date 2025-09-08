import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { createUnifiedStyles } from '../../constants/styles/unifiedStyles';
import { manualMatch, ManualMatchRequest, fetchUserById } from '../api/matchingApi';
import { ValidationAlert } from '../../components/common/ValidationAlert';
import AppLayout from '../../components/AppLayout';

const ManualMatchScreen = () => {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);
  const router = useRouter();

  const [formData, setFormData] = useState<ManualMatchRequest>({
    donationId: 'abe2c518-ce8f-4709-88a1-2720749b9f0b',
    receiveRequestId: '2b6b6a5c-f285-4e1f-b185-1794e9ac1922',
    donorLocationId: '6ac7b976-710e-480c-92cf-36924ec04626',
    recipientLocationId: '459c7874-1ee0-4700-9332-883e9e733ca7'
  });

  const [donorInfo, setDonorInfo] = useState<any>(null);
  const [recipientInfo, setRecipientInfo] = useState<any>(null);

  const [loading, setLoading] = useState(false);
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

  const handleInputChange = (field: keyof ManualMatchRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return Object.values(formData).every(value => value.trim() !== '');
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      showAlert('Validation Error', 'Please fill in all fields', 'warning');
      return;
    }

    setLoading(true);
    try {
      const response = await manualMatch(formData);
      showAlert('Match Created', `${response.message}\n\nTap "View Results" to see all matches.`, 'success');
      
    } catch (error: any) {
      showAlert('Match Failed', error.message || 'Failed to create manual match', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Feather name="arrow-left" size={20} color={theme.text} />
            </TouchableOpacity>

            <View style={styles.headerIconContainer}>
              <Feather name="link" size={28} color={theme.primary} />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Manual Match</Text>
              <Text style={styles.headerSubtitle}>Connect donor with recipient</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {isFormValid() ? '✓ Ready' : 'In Progress'}
              </Text>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconContainer}>
                <Feather name="user" size={18} color={theme.primary} />
              </View>
              <Text style={styles.sectionTitle}>Match Details</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Donation ID *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter donation ID"
                placeholderTextColor={theme.textSecondary}
                value={formData.donationId}
                onChangeText={(value) => handleInputChange('donationId', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Receive Request ID *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter receive request ID"
                placeholderTextColor={theme.textSecondary}
                value={formData.receiveRequestId}
                onChangeText={(value) => handleInputChange('receiveRequestId', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Donor Location ID *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter donor location ID"
                placeholderTextColor={theme.textSecondary}
                value={formData.donorLocationId}
                onChangeText={(value) => handleInputChange('donorLocationId', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Recipient Location ID *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter recipient location ID"
                placeholderTextColor={theme.textSecondary}
                value={formData.recipientLocationId}
                onChangeText={(value) => handleInputChange('recipientLocationId', value)}
              />
            </View>

            {/* Quick Actions */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Quick Actions</Text>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity
                  style={[styles.locationButton, { flex: 1 }]}
                  onPress={() => {
                    setFormData({
                      donationId: 'abe2c518-ce8f-4709-88a1-2720749b9f0b',
                      receiveRequestId: '2b6b6a5c-f285-4e1f-b185-1794e9ac1922',
                      donorLocationId: '6ac7b976-710e-480c-92cf-36924ec04626',
                      recipientLocationId: '459c7874-1ee0-4700-9332-883e9e733ca7'
                    });
                  }}
                >
                  <Feather name="refresh-cw" size={16} color="#fff" />
                  <Text style={styles.locationButtonText}>Load Test Data</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.locationButton, { flex: 1, backgroundColor: theme.success }]}
                  onPress={() => {
                    setFormData({
                      donationId: '',
                      receiveRequestId: '',
                      donorLocationId: '',
                      recipientLocationId: ''
                    });
                  }}
                >
                  <Feather name="x" size={16} color="#fff" />
                  <Text style={styles.locationButtonText}>Clear All</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.submitButtonContainer}>
          {alertType === 'success' ? (
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                style={[styles.submitButton, { flex: 1, backgroundColor: theme.success }]}
                onPress={() => router.push('/navigation/MatchResultsScreen')}
                activeOpacity={0.8}
              >
                <Text style={styles.submitButtonText}>View Results</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitButton, { flex: 1, backgroundColor: theme.textSecondary }]}
                onPress={() => router.back()}
                activeOpacity={0.8}
              >
                <Text style={styles.submitButtonText}>Go Back</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[
                styles.submitButton,
                !isFormValid() || loading ? styles.submitButtonDisabled : null,
              ]}
              onPress={handleSubmit}
              disabled={!isFormValid() || loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Create Match</Text>
              )}
            </TouchableOpacity>
          )}
        </View>

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

export default ManualMatchScreen;