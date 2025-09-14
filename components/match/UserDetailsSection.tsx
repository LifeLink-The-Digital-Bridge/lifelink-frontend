import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { createUnifiedStyles } from '../../constants/styles/unifiedStyles';

interface UserDetailsSectionProps {
  userRole: 'donor' | 'recipient';
  donationDetails?: any;
  requestDetails?: any;
  loading?: boolean;
}

export const UserDetailsSection: React.FC<UserDetailsSectionProps> = ({
  userRole,
  donationDetails,
  requestDetails,
  loading
}) => {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  if (loading) {
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

  const data = userRole === 'donor' ? requestDetails : donationDetails;
  const title = userRole === 'donor' ? 'Your Request Details' : 'Your Donation Details';
  const icon = userRole === 'donor' ? 'clipboard' : 'droplet';

  if (!data) {
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
          {data.requestedTissue && (
            <View style={styles.infoRow}>
              <Text style={styles.labelText}>Tissue Needed:</Text>
              <Text style={styles.valueText}>{data.requestedTissue}</Text>
            </View>
          )}
          {data.requestedStemCellType && (
            <View style={styles.infoRow}>
              <Text style={styles.labelText}>Stem Cell Type:</Text>
              <Text style={styles.valueText}>{data.requestedStemCellType}</Text>
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
