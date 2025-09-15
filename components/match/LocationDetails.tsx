import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { createUnifiedStyles } from '../../constants/styles/unifiedStyles';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { InfoRow } from './InfoRow';

interface LocationDetailsProps {
  data: any;
}

export const LocationDetails: React.FC<LocationDetailsProps> = ({ data }) => {
  const { colorScheme } = useTheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  if (!data) return null;

  let locationData = null;
  
  if (data.receiveRequestSnapshot?.usedLocationCity || data.receiveRequestSnapshot?.usedLocationAddressLine) {
    locationData = data.receiveRequestSnapshot;
  } else if (data.donationSnapshot?.usedLocationCity || data.donationSnapshot?.usedLocationAddressLine) {
    locationData = data.donationSnapshot;
  } 
  else if (data.location?.addressLine || data.location?.city) {
    locationData = {
      usedLocationAddressLine: data.location.addressLine,
      usedLocationLandmark: data.location.landmark,
      usedLocationArea: data.location.area,
      usedLocationCity: data.location.city,
      usedLocationDistrict: data.location.district,
      usedLocationState: data.location.state,
      usedLocationCountry: data.location.country,
      usedLocationPincode: data.location.pincode
    };
  }
  else if (data.usedLocationCity || data.usedLocationAddressLine || data.addressLine || data.city) {
    locationData = {
      usedLocationAddressLine: data.usedLocationAddressLine || data.addressLine,
      usedLocationLandmark: data.usedLocationLandmark || data.landmark,
      usedLocationArea: data.usedLocationArea || data.area,
      usedLocationCity: data.usedLocationCity || data.city,
      usedLocationDistrict: data.usedLocationDistrict || data.district,
      usedLocationState: data.usedLocationState || data.state,
      usedLocationCountry: data.usedLocationCountry || data.country,
      usedLocationPincode: data.usedLocationPincode || data.pincode
    };
  }

  if (!locationData) return null;

  return (
    <View style={[styles.sectionContainer, { paddingHorizontal: 24 }]}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconContainer}>
          <Feather name="map-pin" size={18} color={theme.primary} />
        </View>
        <Text style={styles.sectionTitle}>Location Details</Text>
      </View>

      {locationData.usedLocationAddressLine && (
        <InfoRow label="Address" value={locationData.usedLocationAddressLine} />
      )}
      {locationData.usedLocationLandmark && (
        <InfoRow label="Landmark" value={locationData.usedLocationLandmark} />
      )}
      {locationData.usedLocationArea && (
        <InfoRow label="Area" value={locationData.usedLocationArea} />
      )}
      {locationData.usedLocationCity && (
        <InfoRow label="City" value={locationData.usedLocationCity} />
      )}
      {locationData.usedLocationDistrict && (
        <InfoRow label="District" value={locationData.usedLocationDistrict} />
      )}
      {locationData.usedLocationState && (
        <InfoRow label="State" value={locationData.usedLocationState} />
      )}
      {locationData.usedLocationCountry && (
        <InfoRow label="Country" value={locationData.usedLocationCountry} />
      )}
      {locationData.usedLocationPincode && (
        <InfoRow label="Pincode" value={locationData.usedLocationPincode} isLast />
      )}
    </View>
  );
};
