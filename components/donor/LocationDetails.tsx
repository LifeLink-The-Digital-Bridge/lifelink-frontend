import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { createDonorStyles } from '../../constants/styles/donorStyles';

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
}: LocationDetailsProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createDonorStyles(theme);

  return (
    <View style={styles.sectionContainer}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <Feather name="map-pin" size={24} color={theme.primary} />
        <Text style={[styles.sectionTitle, { marginTop: 0, marginLeft: 12 }]}>Location</Text>
      </View>
      
      <TextInput
        style={styles.input}
        placeholder="Address Line"
        placeholderTextColor={theme.textSecondary}
        value={addressLine}
        onChangeText={setAddressLine}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Landmark"
        placeholderTextColor={theme.textSecondary}
        value={landmark}
        onChangeText={setLandmark}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Area"
        placeholderTextColor={theme.textSecondary}
        value={area}
        onChangeText={setArea}
      />
      
      <TextInput
        style={styles.input}
        placeholder="District"
        placeholderTextColor={theme.textSecondary}
        value={district}
        onChangeText={setDistrict}
      />
      
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
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
      
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
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
      
      <TouchableOpacity
        style={styles.locationButton}
        onPress={onLocationPress}
        activeOpacity={0.8}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Feather name="map" size={20} color="#fff" />
          <Text style={[styles.locationButtonText, { marginLeft: 8 }]}>
            {location ? "Change Location" : "Pick Location on Map"}
          </Text>
        </View>
      </TouchableOpacity>
      
      {location && (
        <Text style={styles.locationText}>
          Selected: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
        </Text>
      )}
    </View>
  );
}
