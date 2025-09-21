import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { createUnifiedStyles } from '../../constants/styles/unifiedStyles';
import { InfoRow } from './InfoRow';

interface LocationCoordinates {
  latitude: number;
  longitude: number;
  address?: string;
  title: string;
}

interface MapSectionProps {
  currentLocation: LocationCoordinates | null;
  destinationLocation: LocationCoordinates | null;
  calculatedDistance: number | null;
  locationPermission: boolean;
  loadingLocation: boolean;
  onRequestLocation: () => void;
}

export const MapSection: React.FC<MapSectionProps> = ({
  currentLocation,
  destinationLocation,
  calculatedDistance,
  locationPermission,
  loadingLocation,
  onRequestLocation
}) => {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  if (locationPermission && currentLocation && destinationLocation) {
    const region = {
      latitude: (currentLocation.latitude + destinationLocation.latitude) / 2,
      longitude: (currentLocation.longitude + destinationLocation.longitude) / 2,
      latitudeDelta: Math.abs(currentLocation.latitude - destinationLocation.latitude) * 1.5 + 0.01,
      longitudeDelta: Math.abs(currentLocation.longitude - destinationLocation.longitude) * 1.5 + 0.01,
    };

    return (
      <View style={[styles.sectionContainer, { paddingHorizontal: 24 }]}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIconContainer}>
            <Feather name="map-pin" size={18} color={theme.primary} />
          </View>
          <Text style={styles.sectionTitle}>Location & Distance</Text>
        </View>
        
        <View style={{ 
          height: 250, 
          borderRadius: 12, 
          overflow: 'hidden',
          marginBottom: 16
        }}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={{ flex: 1 }}
            region={region}
            showsUserLocation={false}
            showsMyLocationButton={false}
          >
            <Marker
              coordinate={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              }}
              title="Your Location"
              description="Your current location"
              pinColor="blue"
            />
            <Marker
              coordinate={{
                latitude: destinationLocation.latitude,
                longitude: destinationLocation.longitude,
              }}
              title={destinationLocation.title}
              description={destinationLocation.address}
              pinColor="red"
            />
          </MapView>
        </View>
        
        {calculatedDistance && (
          <InfoRow 
            label="Distance" 
            value={`${calculatedDistance.toFixed(2)} km`} 
            isLast 
          />
        )}
      </View>
    );
  }

  return (
    <View style={[styles.sectionContainer, { paddingHorizontal: 24 }]}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconContainer}>
          <Feather name="map-pin" size={18} color={theme.primary} />
        </View>
        <Text style={styles.sectionTitle}>Location & Distance</Text>
      </View>
      
      <View style={{ 
        height: 200, 
        backgroundColor: theme.cardBackground, 
        borderRadius: 12, 
        justifyContent: 'center', 
        alignItems: 'center',
        marginBottom: 16
      }}>
        {loadingLocation ? (
          <>
            <ActivityIndicator color={theme.primary} size="large" />
            <Text style={{ color: theme.text, marginTop: 8 }}>Getting your location...</Text>
          </>
        ) : !locationPermission ? (
          <>
            <Feather name="map-pin" size={32} color={theme.textSecondary} />
            <Text style={{ color: theme.text, marginTop: 8, textAlign: 'center' }}>
              Location permission required to show map and distance
            </Text>
            <TouchableOpacity 
              onPress={onRequestLocation}
              style={{
                backgroundColor: theme.primary,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8,
                marginTop: 8
              }}
            >
              <Text style={{ color: '#fff' }}>Enable Location</Text>
            </TouchableOpacity>
          </>
        ) : !destinationLocation ? (
          <>
            <Feather name="map-pin" size={32} color={theme.textSecondary} />
            <Text style={{ color: theme.text, marginTop: 8, textAlign: 'center' }}>
              Destination location not available
            </Text>
          </>
        ) : (
          <>
            <Feather name="map-pin" size={32} color={theme.textSecondary} />
            <Text style={{ color: theme.text, marginTop: 8, textAlign: 'center' }}>
              Unable to load map
            </Text>
          </>
        )}
      </View>
      
      {calculatedDistance && (
        <InfoRow 
          label="Distance" 
          value={`${calculatedDistance.toFixed(2)} km`} 
          isLast 
        />
      )}
    </View>
  );
};
