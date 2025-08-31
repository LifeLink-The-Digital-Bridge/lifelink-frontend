import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
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
}

export function LocationDetails(props: LocationDetailsProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Feather name="map-pin" size={24} color={theme.primary} />
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

      <TouchableOpacity
        style={styles.locationButton}
        onPress={props.onLocationPress}
        activeOpacity={0.8}
      >
        <Feather name="map" size={20} color="#fff" />
        <Text style={styles.locationButtonText}>
          {props.latitude && props.longitude
            ? "Update Location"
            : "Pick Location on Map"}
        </Text>
      </TouchableOpacity>

      {props.latitude !== null && props.longitude !== null && (
        <View style={styles.coordinatesContainer}>
          <Feather name="navigation" size={16} color={theme.success} />
          <Text style={styles.coordinatesText}>
            Location: {props.latitude.toFixed(4)}, {props.longitude.toFixed(4)}
          </Text>
        </View>
      )}
    </View>
  );
}
