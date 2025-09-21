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
    locationData = {
      usedLocationAddressLine: data.receiveRequestSnapshot.usedLocationAddressLine,
      usedLocationLandmark: data.receiveRequestSnapshot.usedLocationLandmark,
      usedLocationArea: data.receiveRequestSnapshot.usedLocationArea,
      usedLocationCity: data.receiveRequestSnapshot.usedLocationCity,
      usedLocationDistrict: data.receiveRequestSnapshot.usedLocationDistrict,
      usedLocationState: data.receiveRequestSnapshot.usedLocationState,
      usedLocationCountry: data.receiveRequestSnapshot.usedLocationCountry,
      usedLocationPincode: data.receiveRequestSnapshot.usedLocationPincode,
    };
  }
  else if (data.donationSnapshot?.usedLocationCity || data.donationSnapshot?.usedLocationAddressLine) {
    locationData = {
      usedLocationAddressLine: data.donationSnapshot.usedLocationAddressLine,
      usedLocationLandmark: data.donationSnapshot.usedLocationLandmark,
      usedLocationArea: data.donationSnapshot.usedLocationArea,
      usedLocationCity: data.donationSnapshot.usedLocationCity,
      usedLocationDistrict: data.donationSnapshot.usedLocationDistrict,
      usedLocationState: data.donationSnapshot.usedLocationState,
      usedLocationCountry: data.donationSnapshot.usedLocationCountry,
      usedLocationPincode: data.donationSnapshot.usedLocationPincode,
    };
  }
  else if (data.usedLocationCity || data.usedLocationAddressLine) {
    locationData = {
      usedLocationAddressLine: data.usedLocationAddressLine,
      usedLocationLandmark: data.usedLocationLandmark,
      usedLocationArea: data.usedLocationArea,
      usedLocationCity: data.usedLocationCity,
      usedLocationDistrict: data.usedLocationDistrict,
      usedLocationState: data.usedLocationState,
      usedLocationCountry: data.usedLocationCountry,
      usedLocationPincode: data.usedLocationPincode,
    };
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
      usedLocationPincode: data.location.pincode,
    };
  }
  else if (data.addresses && data.addresses.length > 0) {
    const activeLocation = data.addresses.find((addr: any) => addr.isActive) || data.addresses[0];
    if (activeLocation) {
      locationData = {
        usedLocationAddressLine: activeLocation.addressLine,
        usedLocationLandmark: activeLocation.landmark,
        usedLocationArea: activeLocation.area,
        usedLocationCity: activeLocation.city,
        usedLocationDistrict: activeLocation.district,
        usedLocationState: activeLocation.state,
        usedLocationCountry: activeLocation.country,
        usedLocationPincode: activeLocation.pincode,
      };
    }
  }
  else if (data.addressLine || data.city) {
    locationData = {
      usedLocationAddressLine: data.addressLine,
      usedLocationLandmark: data.landmark,
      usedLocationArea: data.area,
      usedLocationCity: data.city,
      usedLocationDistrict: data.district,
      usedLocationState: data.state,
      usedLocationCountry: data.country,
      usedLocationPincode: data.pincode,
    };
  }

  if (!locationData || (!locationData.usedLocationAddressLine && !locationData.usedLocationCity)) {
    return null;
  }

  return (
    <View style={[styles.sectionContainer, { paddingHorizontal: 24 }]}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconContainer}>
          <Feather name="map-pin" size={18} color={theme.primary} />
        </View>
        <Text style={styles.sectionTitle}>Location Details</Text>
      </View>
      
      {locationData.usedLocationAddressLine && <InfoRow label="Address" value={locationData.usedLocationAddressLine} />}
      {locationData.usedLocationLandmark && <InfoRow label="Landmark" value={locationData.usedLocationLandmark} />}
      {locationData.usedLocationArea && <InfoRow label="Area" value={locationData.usedLocationArea} />}
      {locationData.usedLocationCity && <InfoRow label="City" value={locationData.usedLocationCity} />}
      {locationData.usedLocationDistrict && <InfoRow label="District" value={locationData.usedLocationDistrict} />}
      {locationData.usedLocationState && <InfoRow label="State" value={locationData.usedLocationState} />}
      {locationData.usedLocationCountry && <InfoRow label="Country" value={locationData.usedLocationCountry} />}
      {locationData.usedLocationPincode && <InfoRow label="Pincode" value={locationData.usedLocationPincode} isLast />}
    </View>
  );
};
