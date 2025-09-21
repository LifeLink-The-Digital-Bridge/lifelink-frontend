import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, Modal } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
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

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);

  const appDarkBlueMapStyle = [
    {
      "elementType": "geometry",
      "stylers": [{ "color": "#1a1f2e" }]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#8ea4c7" }]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [{ "color": "#1a1f2e" }]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry",
      "stylers": [{ "color": "#2a3441" }]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#4f8df5" }]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#8ea4c7" }]
    },
    {
      "featureType": "poi.business",
      "stylers": [{ "visibility": "on" }]
    },
    {
      "featureType": "poi.business",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#a3b3c7" }]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [{ "color": "#2a3441" }]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#8ea4c7" }]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [{ "color": "#3d4a5a" }]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [{ "color": "#0f1419" }]
    }
  ];

  const generateRoute = () => {
    if (!currentLocation || !destinationLocation) return [];

    const points = [];
    const steps = 10;
    
    for (let i = 0; i <= steps; i++) {
      const ratio = i / steps;
      const lat = currentLocation.latitude + (destinationLocation.latitude - currentLocation.latitude) * ratio;
      const lng = currentLocation.longitude + (destinationLocation.longitude - currentLocation.longitude) * ratio;
      
      const curveFactor = Math.sin(ratio * Math.PI) * 0.001;
      points.push({
        latitude: lat + curveFactor,
        longitude: lng + curveFactor,
      });
    }
    
    return points;
  };

  const renderMap = (fullscreen = false) => {
    if (!locationPermission || !currentLocation || !destinationLocation) return null;

    const region = {
      latitude: (currentLocation.latitude + destinationLocation.latitude) / 2,
      longitude: (currentLocation.longitude + destinationLocation.longitude) / 2,
      latitudeDelta: Math.abs(currentLocation.latitude - destinationLocation.latitude) * 1.5 + 0.01,
      longitudeDelta: Math.abs(currentLocation.longitude - destinationLocation.longitude) * 1.5 + 0.01,
    };

    const route = generateRoute();

    return (
      <TouchableOpacity 
        style={{ 
          height: fullscreen ? '100%' : 250, 
          borderRadius: fullscreen ? 0 : 12, 
          overflow: 'hidden'
        }}
        onPress={fullscreen ? undefined : () => setIsFullscreen(true)}
        activeOpacity={fullscreen ? 1 : 0.8}
      >
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          region={region}
          showsUserLocation={false}
          showsMyLocationButton={false}
          showsPointsOfInterest={true}
          showsBuildings={true}
          customMapStyle={isDark ? appDarkBlueMapStyle : []}
          scrollEnabled={fullscreen}
          zoomEnabled={fullscreen}
          pitchEnabled={fullscreen}
          rotateEnabled={fullscreen}
        >
          {/* ✅ Route Polyline */}
          {route.length > 0 && (
            <Polyline
              coordinates={route}
              strokeColor={theme.primary}
              strokeWidth={4}
              lineDashPattern={[0]}
              lineJoin="round"
              lineCap="round"
            />
          )}

          {/* ✅ Current User Location */}
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title="Your Location"
            description="Your current location"
          >
            <View style={{
              backgroundColor: '#007AFF',
              padding: 8,
              borderRadius: 20,
              borderWidth: 3,
              borderColor: '#ffffff',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5,
            }}>
              <Feather name="user" size={16} color="#ffffff" />
            </View>
          </Marker>

          {/* ✅ Destination Location */}
          <Marker
            coordinate={{
              latitude: destinationLocation.latitude,
              longitude: destinationLocation.longitude,
            }}
            title={destinationLocation.title}
            description={destinationLocation.address}
          >
            <View style={{
              backgroundColor: theme.primary,
              padding: 8,
              borderRadius: 20,
              borderWidth: 3,
              borderColor: '#ffffff',
              shadowColor: theme.primary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.4,
              shadowRadius: 4,
              elevation: 5,
            }}>
              <Feather name="map-pin" size={16} color="#ffffff" />
            </View>
          </Marker>
        </MapView>

        {/* ✅ Expand Icon (only on small map) */}
        {!fullscreen && (
          <View style={{
            position: 'absolute',
            top: 10,
            right: 10,
            backgroundColor: isDark ? 'rgba(26, 31, 46, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            borderRadius: 20,
            padding: 8,
          }}>
            <Feather name="maximize-2" size={16} color={theme.primary} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderFullscreenMap = () => (
    <Modal
      visible={isFullscreen}
      animationType="slide"
      statusBarTranslucent
    >
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        {/* ✅ Header */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 20,
          paddingTop: 50,
          backgroundColor: isDark ? '#1a1f2e' : '#ffffff',
          borderBottomWidth: 1,
          borderBottomColor: isDark ? '#2a3441' : '#e0e0e0',
        }}>
          <TouchableOpacity 
            onPress={() => setIsFullscreen(false)}
            style={{
              backgroundColor: isDark ? 'rgba(79, 141, 245, 0.2)' : 'rgba(79, 141, 245, 0.1)',
              borderRadius: 20,
              padding: 8,
              marginRight: 16,
            }}
          >
            <Feather name="x" size={20} color={theme.primary} />
          </TouchableOpacity>
          <View>
            <Text style={{
              color: theme.text,
              fontSize: 18,
              fontWeight: '700',
            }}>
              Route to {destinationLocation?.title}
            </Text>
            <Text style={{
              color: theme.textSecondary,
              fontSize: 14,
            }}>
              {calculatedDistance ? `${calculatedDistance.toFixed(2)} km away` : 'Distance calculating...'}
            </Text>
          </View>
        </View>

        {/* ✅ Fullscreen Map */}
        <View style={{ flex: 1 }}>
          {renderMap(true)}
        </View>

        {/* ✅ Bottom Info */}
        {calculatedDistance && (
          <View style={{
            backgroundColor: isDark ? '#1a1f2e' : '#ffffff',
            padding: 20,
            borderTopWidth: 1,
            borderTopColor: isDark ? '#2a3441' : '#e0e0e0',
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: isDark ? 'rgba(79, 141, 245, 0.1)' : 'rgba(79, 141, 245, 0.05)',
              padding: 16,
              borderRadius: 12,
            }}>
              <View style={{
                backgroundColor: theme.primary,
                borderRadius: 20,
                padding: 8,
                marginRight: 12,
              }}>
                <Feather name="navigation" size={20} color="#ffffff" />
              </View>
              <View>
                <Text style={{
                  color: theme.text,
                  fontSize: 16,
                  fontWeight: '600',
                }}>
                  Distance: {calculatedDistance.toFixed(2)} km
                </Text>
                <Text style={{
                  color: theme.textSecondary,
                  fontSize: 14,
                }}>
                  Estimated route shown
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );

  if (locationPermission && currentLocation && destinationLocation) {
    return (
      <View style={[styles.sectionContainer, { paddingHorizontal: 24 }]}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIconContainer}>
            <Feather name="map-pin" size={18} color={theme.primary} />
          </View>
          <Text style={styles.sectionTitle}>Location & Distance</Text>
        </View>
        
        <View style={{ marginBottom: 16 }}>
          {renderMap()}
        </View>
        
        {calculatedDistance && (
          <InfoRow 
            label="Distance" 
            value={`${calculatedDistance.toFixed(2)} km`} 
            isLast 
          />
        )}

        {renderFullscreenMap()}
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
