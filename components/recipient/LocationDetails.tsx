import React from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../utils/theme-context";
import { lightTheme, darkTheme } from "../../constants/styles/authStyles";
import { createUnifiedStyles } from "../../constants/styles/unifiedStyles";

interface LocationDetailsProps {
  addressLine: string;
  setAddressLine: (value: string) => void;
  landmark: string;
  setLandmark: (value: string) => void;
  area: string;
  setArea: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  district: string;
  setDistrict: (value: string) => void;
  stateVal: string;
  setStateVal: (value: string) => void;
  country: string;
  setCountry: (value: string) => void;
  pincode: string;
  setPincode: (value: string) => void;
  latitude: number | null;
  longitude: number | null;
  onLocationPress: () => void;
  onResetLocation?: () => void;
  manualLocationSet?: boolean;
}

export function LocationDetails(props: LocationDetailsProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  const hasValidCoordinates = props.latitude !== null && props.longitude !== null && 
                              !isNaN(props.latitude) && !isNaN(props.longitude);

  console.log('🗺️ RecipientForm LocationDetails render:', {
    latitude: props.latitude,
    longitude: props.longitude,
    hasValidCoordinates,
    manualLocationSet: props.manualLocationSet,
    type: typeof props.latitude
  });

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconContainer}>
          <Feather name="map-pin" size={18} color={theme.primary} />
        </View>
        <Text style={styles.sectionTitle}>Location Details</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Address Line *</Text>
        <TextInput
          style={styles.input}
          placeholder="123 Health Street"
          placeholderTextColor={theme.textSecondary}
          value={props.addressLine}
          onChangeText={props.setAddressLine}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Landmark</Text>
        <TextInput
          style={styles.input}
          placeholder="Near City Hospital"
          placeholderTextColor={theme.textSecondary}
          value={props.landmark}
          onChangeText={props.setLandmark}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Area</Text>
        <TextInput
          style={styles.input}
          placeholder="Green Park"
          placeholderTextColor={theme.textSecondary}
          value={props.area}
          onChangeText={props.setArea}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>District</Text>
        <TextInput
          style={styles.input}
          placeholder="Hyderabad Urban"
          placeholderTextColor={theme.textSecondary}
          value={props.district}
          onChangeText={props.setDistrict}
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>City *</Text>
          <TextInput
            style={styles.input}
            placeholder="Hyderabad"
            placeholderTextColor={theme.textSecondary}
            value={props.city}
            onChangeText={props.setCity}
          />
        </View>

        <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.label}>State *</Text>
          <TextInput
            style={styles.input}
            placeholder="Telangana"
            placeholderTextColor={theme.textSecondary}
            value={props.stateVal}
            onChangeText={props.setStateVal}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>Country *</Text>
          <TextInput
            style={styles.input}
            placeholder="India"
            placeholderTextColor={theme.textSecondary}
            value={props.country}
            onChangeText={props.setCountry}
          />
        </View>

        <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.label}>Pincode *</Text>
          <TextInput
            style={styles.input}
            placeholder="500001"
            placeholderTextColor={theme.textSecondary}
            value={props.pincode}
            onChangeText={props.setPincode}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.locationButtonContainer}>
        <TouchableOpacity
          style={styles.locationButton}
          onPress={props.onLocationPress}
          activeOpacity={0.8}
        >
          <Feather name="map" size={20} color="#fff" />
          <Text style={styles.locationButtonText}>
            {hasValidCoordinates ? "Update Location" : "Pick Location on Map"}
          </Text>
        </TouchableOpacity>
        
        {hasValidCoordinates && props.manualLocationSet && props.onResetLocation && (
          <TouchableOpacity
            style={[styles.locationButton, { 
              backgroundColor: theme.textSecondary + '40',
              marginLeft: 8,
              flex: 0.4
            }]}
            onPress={props.onResetLocation}
            activeOpacity={0.8}
          >
            <Feather name="rotate-ccw" size={16} color="#fff" />
            <Text style={[styles.locationButtonText, { fontSize: 12 }]}>
              Reset
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {hasValidCoordinates && (
        <View style={styles.coordinatesContainer}>
          <Feather name="check-circle" size={16} color={theme.success} />
          <Text style={styles.coordinatesText}>
            Location: {props.latitude!.toFixed(6)}, {props.longitude!.toFixed(6)}
          </Text>
          {props.manualLocationSet && (
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
