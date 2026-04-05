import React, { useState } from 'react';
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
  latitude: number | null;
  longitude: number | null;
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
  latitude,
  longitude,
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

  const [touched, setTouched] = useState({
    addressLine: false,
    landmark: false,
    area: false,
    district: false,
    city: false,
    stateVal: false,
    country: false,
    pincode: false,
  });

  const hasLocation = latitude !== null && longitude !== null;

  const requiredFieldsCount = 8;
  const filledFieldsCount = [
    addressLine,
    landmark,
    area,
    district,
    city,
    stateVal,
    country,
    pincode,
  ].filter(field => field && field.trim() !== '').length + (hasLocation ? 1 : 0);

  const isSectionComplete = filledFieldsCount === requiredFieldsCount + 1;
  const missingCount = (requiredFieldsCount + 1) - filledFieldsCount;

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconContainer}>
          <Feather 
            name={isSectionComplete ? "check-circle" : "map-pin"} 
            size={18} 
            color={isSectionComplete ? theme.success : theme.primary} 
          />
        </View>
        <Text style={styles.sectionTitle}>Location Details</Text>
        {!isSectionComplete && (
          <View style={{
            backgroundColor: theme.error + '20',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
            marginLeft: 'auto',
          }}>
            <Text style={{
              color: theme.error,
              fontSize: 11,
              fontWeight: '600',
            }}>
              {missingCount} required
            </Text>
          </View>
        )}
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
        <Text style={styles.label}>
          Address Line <Text style={{ color: theme.error }}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            !addressLine && touched.addressLine && { borderColor: theme.error, borderWidth: 2 }
          ]}
          placeholder="Enter your address"
          placeholderTextColor={theme.textSecondary}
          value={addressLine}
          onChangeText={setAddressLine}
          onBlur={() => setTouched({ ...touched, addressLine: true })}
        />
        {!addressLine && touched.addressLine && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Feather name="alert-circle" size={12} color={theme.error} />
            <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
              Address line is required
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          Landmark <Text style={{ color: theme.error }}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            !landmark && touched.landmark && { borderColor: theme.error, borderWidth: 2 }
          ]}
          placeholder="Nearby landmark"
          placeholderTextColor={theme.textSecondary}
          value={landmark}
          onChangeText={setLandmark}
          onBlur={() => setTouched({ ...touched, landmark: true })}
        />
        {!landmark && touched.landmark && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Feather name="alert-circle" size={12} color={theme.error} />
            <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
              Landmark is required
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          Area <Text style={{ color: theme.error }}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            !area && touched.area && { borderColor: theme.error, borderWidth: 2 }
          ]}
          placeholder="Enter area"
          placeholderTextColor={theme.textSecondary}
          value={area}
          onChangeText={setArea}
          onBlur={() => setTouched({ ...touched, area: true })}
        />
        {!area && touched.area && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Feather name="alert-circle" size={12} color={theme.error} />
            <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
              Area is required
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          District <Text style={{ color: theme.error }}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            !district && touched.district && { borderColor: theme.error, borderWidth: 2 }
          ]}
          placeholder="Enter district"
          placeholderTextColor={theme.textSecondary}
          value={district}
          onChangeText={setDistrict}
          onBlur={() => setTouched({ ...touched, district: true })}
        />
        {!district && touched.district && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Feather name="alert-circle" size={12} color={theme.error} />
            <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
              District is required
            </Text>
          </View>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          City <Text style={{ color: theme.error }}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            !city && touched.city && { borderColor: theme.error, borderWidth: 2 }
          ]}
          placeholder="Enter city"
          placeholderTextColor={theme.textSecondary}
          value={city}
          onChangeText={setCity}
          onBlur={() => setTouched({ ...touched, city: true })}
        />
        {!city && touched.city && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Feather name="alert-circle" size={12} color={theme.error} />
            <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
              City is required
            </Text>
          </View>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          State <Text style={{ color: theme.error }}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            !stateVal && touched.stateVal && { borderColor: theme.error, borderWidth: 2 }
          ]}
          placeholder="Enter state"
          placeholderTextColor={theme.textSecondary}
          value={stateVal}
          onChangeText={setStateVal}
          onBlur={() => setTouched({ ...touched, stateVal: true })}
        />
        {!stateVal && touched.stateVal && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Feather name="alert-circle" size={12} color={theme.error} />
            <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
              State is required
            </Text>
          </View>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          Country <Text style={{ color: theme.error }}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            !country && touched.country && { borderColor: theme.error, borderWidth: 2 }
          ]}
          placeholder="Enter country"
          placeholderTextColor={theme.textSecondary}
          value={country}
          onChangeText={setCountry}
          onBlur={() => setTouched({ ...touched, country: true })}
        />
        {!country && touched.country && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Feather name="alert-circle" size={12} color={theme.error} />
            <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
              Country is required
            </Text>
          </View>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          Pincode <Text style={{ color: theme.error }}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            !pincode && touched.pincode && { borderColor: theme.error, borderWidth: 2 }
          ]}
          placeholder="Enter pincode"
          placeholderTextColor={theme.textSecondary}
          value={pincode}
          onChangeText={setPincode}
          onBlur={() => setTouched({ ...touched, pincode: true })}
          keyboardType="numeric"
        />
        {!pincode && touched.pincode && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Feather name="alert-circle" size={12} color={theme.error} />
            <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
              Pincode is required
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.locationButtonContainer}>
        <TouchableOpacity
          style={styles.locationButton}
          onPress={onLocationPress}
          activeOpacity={0.8}
        >
          <Feather name="map" size={20} color="#fff" />
          <Text style={styles.locationButtonText}>
            {hasLocation ? "Update Location" : "Pick Location on Map"}
          </Text>
        </TouchableOpacity>
        
        {hasLocation && manualLocationSet && onResetLocation && (
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

      {!hasLocation && (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
          <Feather name="alert-circle" size={12} color={theme.error} />
          <Text style={{ marginLeft: 4, fontSize: 12, color: theme.error }}>
            Location coordinates are required
          </Text>
        </View>
      )}
      
      {hasLocation && (
        <View style={styles.coordinatesContainer}>
          <Feather name="check-circle" size={16} color={theme.success} />
          <Text style={styles.coordinatesText}>
            Location: {latitude!.toFixed(6)}, {longitude!.toFixed(6)}
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
