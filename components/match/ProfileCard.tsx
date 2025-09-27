import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { createUnifiedStyles } from '../../constants/styles/unifiedStyles';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { InfoRow } from './InfoRow';

interface ProfileCardProps {
  user: any;
  title: string;
  iconName: string;
  onViewProfile: (userId: string, userName: string) => void;
  matchingServiceData?: any;
  isHistorical?: boolean;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  user,
  title,
  iconName,
  onViewProfile,
  matchingServiceData,
  isHistorical = false
}) => {
  const { colorScheme } = useTheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  const renderProfileInfo = () => {
    if (!matchingServiceData) return null;

    if (title === "Donor" && matchingServiceData.medicalDetails) {
      return (
        <>
          <InfoRow 
            label="Status" 
            value={matchingServiceData.status || 'N/A'}
            valueColor={
              matchingServiceData.status === 'ACTIVE' ? theme.success : theme.text
            }
          />
          <InfoRow 
            label="Registration Date" 
            value={matchingServiceData.registrationDate ? 
              new Date(matchingServiceData.registrationDate).toLocaleDateString() : 'N/A'
            }
          />
          <InfoRow 
            label="Hemoglobin" 
            value={matchingServiceData.medicalDetails.hemoglobinLevel ? 
              `${matchingServiceData.medicalDetails.hemoglobinLevel} g/dL` : 'N/A'
            }
          />
          <InfoRow 
            label="Blood Pressure" 
            value={matchingServiceData.medicalDetails.bloodPressure || 'N/A'}
          />
          <InfoRow 
            label="Overall Health" 
            value={matchingServiceData.medicalDetails.overallHealthStatus || 'N/A'}
            isLast
          />
        </>
      );
    } else if (title === "Recipient" && matchingServiceData.medicalDetails) {
      return (
        <>
          <InfoRow 
            label="Availability" 
            value={matchingServiceData.availability || 'N/A'}
            valueColor={
              matchingServiceData.availability === 'AVAILABLE' ? theme.success : theme.text
            }
          />
          <InfoRow 
            label="Diagnosis" 
            value={matchingServiceData.medicalDetails.diagnosis || 'N/A'}
          />
          <InfoRow 
            label="Hemoglobin" 
            value={matchingServiceData.medicalDetails.hemoglobinLevel ? 
              `${matchingServiceData.medicalDetails.hemoglobinLevel} g/dL` : 'N/A'
            }
          />
          <InfoRow 
            label="Blood Pressure" 
            value={matchingServiceData.medicalDetails.bloodPressure || 'N/A'}
          />
          <InfoRow 
            label="Overall Health" 
            value={matchingServiceData.medicalDetails.overallHealthStatus || 'N/A'}
            isLast
          />
        </>
      );
    }

    return null;
  };

  return (
    <View style={[styles.sectionContainer, { paddingHorizontal: 24 }]}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconContainer}>
          <Feather name={iconName as any} size={18} color={theme.primary} />
        </View>
        <Text style={styles.sectionTitle}>{title} Information</Text>
      </View>

      <TouchableOpacity
        onPress={() => onViewProfile(user.id, user.name)}
        activeOpacity={0.7}
        style={{ marginBottom: 16 }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Text style={[styles.valueText, { fontSize: 18, fontWeight: '600' }]}>{user.name}</Text>
          <Feather name="chevron-right" size={16} color={theme.primary} />
        </View>
        <InfoRow label="Username" value={`@${user.username}`} />
        <InfoRow label="Email" value={user.email} />
        {user.phone && <InfoRow label="Phone" value={user.phone} />}
        {user.gender && <InfoRow label="Gender" value={user.gender} />}
      </TouchableOpacity>

      {renderProfileInfo()}
    </View>
  );
};
