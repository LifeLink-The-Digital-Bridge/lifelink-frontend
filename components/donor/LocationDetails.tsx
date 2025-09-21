import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { createUnifiedStyles } from '../../constants/styles/unifiedStyles';

interface LocationDetailsProps {
  addressLine: string;
  setAddressLine: (value: string) => void;
  landmark: string;
  setLandmark: (value: string) => void;
  area: string;
  setArea: (value: string) => void;
  district: string;
  setDistrict: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  stateVal: string;
  setStateVal: (value: string) => void;
  country: string;
  setCountry: (value: string) => void;
  pincode: string;
  setPincode: (value: string) => void;
  location: { latitude: number; longitude: number } | null;
  onLocationPress: () => void;
  locationLoading?: boolean;
  locationError?: string | null;
  onResetLocation?: () => void;
  manualLocationSet?: boolean;
}

export function LocationDetails({
  addressLine,
  setAddressLine,
  landmark,
  setLandmark,
  area,
  setArea,
  district,
  setDistrict,
  city,
  setCity,
  stateVal,
  setStateVal,
  country,
  setCountry,
  pincode,
  setPincode,
  location,
  onLocationPress,
  locationLoading = false,
  locationError = null,
  onResetLocation,
  manualLocationSet = false,
}: LocationDetailsProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  console.log('🗺️ DonorForm LocationDetails render:', {
    hasLocation: !!location,
    coordinates: location,
    manualLocationSet,
    locationLoading
  });

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconContainer}>
          <Feather name="map-pin" size={18} color={theme.primary} />
        </View>
        <Text style={styles.sectionTitle}>Location Details</Text>
      </View>

      {locationLoading && (
        <View style={styles.locationStatus}>
          <ActivityIndicator size="small" color={theme.primary} />
          <Text style={styles.locationStatusText}>Getting your location...</Text>
        </View>
      )}

      {locationError && (
        <View style={styles.locationError}>
          <Feather name="alert-circle" size={16} color={theme.error} />
          <Text style={styles.locationErrorText}>{locationError}</Text>
        </View>
      )}
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Address Line</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your address"
          placeholderTextColor={theme.textSecondary}
          value={addressLine}
          onChangeText={setAddressLine}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Landmark (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Nearby landmark"
          placeholderTextColor={theme.textSecondary}
          value={landmark}
          onChangeText={setLandmark}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Area</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter area"
          placeholderTextColor={theme.textSecondary}
          value={area}
          onChangeText={setArea}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>District (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter district"
          placeholderTextColor={theme.textSecondary}
          value={district}
          onChangeText={setDistrict}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>City & State</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1, marginRight: 12 }]}
            placeholder="City"
            placeholderTextColor={theme.textSecondary}
            value={city}
            onChangeText={setCity}
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="State"
            placeholderTextColor={theme.textSecondary}
            value={stateVal}
            onChangeText={setStateVal}
          />
        </View>
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Country & Pincode</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1, marginRight: 12 }]}
            placeholder="Country"
            placeholderTextColor={theme.textSecondary}
            value={country}
            onChangeText={setCountry}
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Pincode"
            placeholderTextColor={theme.textSecondary}
            value={pincode}
            onChangeText={setPincode}
            keyboardType="numeric"
          />
        </View>
      </View>
      
      <View style={styles.locationButtonContainer}>
        <TouchableOpacity
          style={styles.locationButton}
          onPress={onLocationPress}
          activeOpacity={0.8}
        >
          <Feather name="map" size={20} color="#fff" />
          <Text style={styles.locationButtonText}>
            {location ? "Update Location" : "Pick Location on Map"}
          </Text>
        </TouchableOpacity>
        
        {location && manualLocationSet && onResetLocation && (
          <TouchableOpacity
            style={[styles.locationButton, { 
              backgroundColor: theme.textSecondary + '40',
              marginLeft: 8,
              flex: 0.4
            }]}
            onPress={onResetLocation}
            activeOpacity={0.8}
          >
            <Feather name="rotate-ccw" size={16} color="#fff" />
            <Text style={[styles.locationButtonText, { fontSize: 12 }]}>
              Reset
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      {location && (
        <View style={styles.coordinatesContainer}>
          <Feather name="check-circle" size={16} color={theme.success} />
          <Text style={styles.coordinatesText}>
            Location: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
          </Text>
          {manualLocationSet && (
            <View style={{
              backgroundColor: theme.primary + '20',
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 12,
              marginLeft: 8
            }}>
              <Text style={{
                color: theme.primary,
                fontSize: 10,
                fontWeight: '600'
              }}>
                MANUAL
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
