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
  description?: string;
  type?: 'registered' | 'current' | 'other';
}

interface MapSectionProps {
  allLocations: LocationCoordinates[];
  registeredLocation: LocationCoordinates | null;
  currentGpsLocation: LocationCoordinates | null;
  otherPartyLocation: LocationCoordinates | null;
  calculatedDistance: number | null;
  locationPermission: boolean;
  loadingLocation: boolean;
  onRequestLocation: () => void;
  calculateDistance: (lat1: number, lon1: number, lat2: number, lon2: number) => number;
  currentUserRole?: 'donor' | 'recipient' | 'unknown';
  otherPartyRole?: 'Donor' | 'Recipient';
  matchType?: string;
}

export const MapSection: React.FC<MapSectionProps> = ({
  allLocations,
  registeredLocation,
  currentGpsLocation,
  otherPartyLocation,
  calculatedDistance,
  locationPermission,
  loadingLocation,
  onRequestLocation,
  calculateDistance,
  currentUserRole = 'unknown',
  otherPartyRole = 'Other Party',
  matchType
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

  const getMarkerConfig = (location: LocationCoordinates) => {
    switch (location.type) {
      case 'registered':
        return {
          color: '#4CAF50', 
          icon: 'home',
          backgroundColor: '#4CAF50'
        };
      case 'current':
        return {
          color: '#007AFF',
          icon: 'navigation',
          backgroundColor: '#007AFF'
        };
      case 'other':
        return {
          color: '#FF5722', 
          icon: otherPartyRole === 'Donor' ? 'heart' : 'user',
          backgroundColor: '#FF5722'
        };
      default:
        return {
          color: theme.primary,
          icon: 'map-pin',
          backgroundColor: theme.primary
        };
    }
  };

  const generateRoute = () => {
    if (!registeredLocation || !otherPartyLocation) return [];

    const points = [];
    const steps = 10;
    
    for (let i = 0; i <= steps; i++) {
      const ratio = i / steps;
      const lat = registeredLocation.latitude + (otherPartyLocation.latitude - registeredLocation.latitude) * ratio;
      const lng = registeredLocation.longitude + (otherPartyLocation.longitude - registeredLocation.longitude) * ratio;
      
      const curveFactor = Math.sin(ratio * Math.PI) * 0.001;
      points.push({
        latitude: lat + curveFactor,
        longitude: lng + curveFactor,
      });
    }
    
    return points;
  };

  const renderMap = (fullscreen = false) => {
    if (!locationPermission || allLocations.length === 0) return null;

    const latitudes = allLocations.map(loc => loc.latitude);
    const longitudes = allLocations.map(loc => loc.longitude);
    
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);
    
    const region = {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max((maxLat - minLat) * 1.5, 0.01),
      longitudeDelta: Math.max((maxLng - minLng) * 1.5, 0.01),
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
          customMapStyle={isDark ? appDarkBlueMapStyle : []}
          showsUserLocation={false}
          showsMyLocationButton={false}
          showsPointsOfInterest={true}
          showsBuildings={true}
          scrollEnabled={fullscreen}
          zoomEnabled={fullscreen}
          pitchEnabled={fullscreen}
          rotateEnabled={fullscreen}
          mapType="standard"
        >
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

          {otherPartyLocation && registeredLocation && (
            <Polyline
              coordinates={[
                { latitude: registeredLocation.latitude, longitude: registeredLocation.longitude },
                { latitude: otherPartyLocation.latitude, longitude: otherPartyLocation.longitude }
              ]}
              strokeColor={isDark ? "#66BB6A" : "#4CAF50"}
              strokeWidth={3}
              lineDashPattern={[5, 5]}
            />
          )}
          
          {otherPartyLocation && currentGpsLocation && (
            <Polyline
              coordinates={[
                { latitude: currentGpsLocation.latitude, longitude: currentGpsLocation.longitude },
                { latitude: otherPartyLocation.latitude, longitude: otherPartyLocation.longitude }
              ]}
              strokeColor={isDark ? "#4f8df5" : "#007AFF"} 
              strokeWidth={3}
              lineDashPattern={[10, 5]}
            />
          )}

          {allLocations.map((location, index) => {
            const config = getMarkerConfig(location);
            return (
              <Marker
                key={`${location.type}-${index}`}
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                title={location.title}
                description={location.description}
              >
                <View style={{
                  backgroundColor: config.backgroundColor,
                  padding: 8,
                  borderRadius: 20,
                  borderWidth: 3,
                  borderColor: '#ffffff',
                  shadowColor: isDark ? '#ffffff' : '#000000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isDark ? 0.3 : 0.3,
                  shadowRadius: 4,
                  elevation: 5,
                }}>
                  <Feather name={config.icon as any} size={16} color="#ffffff" />
                </View>
              </Marker>
            );
          })}
        </MapView>

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

  const getDistanceInfo = () => {
    if (!otherPartyLocation) return null;

    const info = [];
    
    if (registeredLocation) {
      const distance = calculateDistance(
        registeredLocation.latitude, 
        registeredLocation.longitude,
        otherPartyLocation.latitude, 
        otherPartyLocation.longitude
      );
      info.push({
        label: "From Registered Location",
        value: `${distance.toFixed(2)} km`,
        color: isDark ? '#66BB6A' : '#4CAF50'
      });
    }

    if (currentGpsLocation && registeredLocation) {
      const distance = calculateDistance(
        currentGpsLocation.latitude, 
        currentGpsLocation.longitude,
        otherPartyLocation.latitude, 
        otherPartyLocation.longitude
      );
      info.push({
        label: "From Current Location", 
        value: `${distance.toFixed(2)} km`,
        color: isDark ? '#4f8df5' : '#007AFF'
      });
    }

    return info;
  };

  const renderFullscreenMap = () => (
    <Modal
      visible={isFullscreen}
      animationType="slide"
      statusBarTranslucent
    >
      <View style={{ flex: 1, backgroundColor: theme.background }}>
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
              color: isDark ? '#8ea4c7' : theme.text,
              fontSize: 18,
              fontWeight: '700',
            }}>
              Route to {otherPartyRole} 
            </Text>
            <Text style={{
              color: theme.textSecondary,
              fontSize: 14,
            }}>
              {calculatedDistance ? `${calculatedDistance.toFixed(2)} km away` : 'Distance calculating...'}
            </Text>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          {renderMap(true)}
        </View>

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
                  color: isDark ? '#8ea4c7' : theme.text,
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

  if (locationPermission && allLocations.length > 0) {
    const distanceInfo = getDistanceInfo();
    
    return (
      <View style={[styles.sectionContainer, { paddingHorizontal: 24 }]}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIconContainer}>
            <Feather name="map-pin" size={18} color={theme.primary} />
          </View>
          <Text style={styles.sectionTitle}>Locations & Distance</Text>
        </View>
        
        <View style={{ marginBottom: 16 }}>
          {renderMap()}
        </View>

        <View style={{ marginBottom: 16 }}>
          {registeredLocation && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <View style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: isDark ? '#66BB6A' : '#4CAF50',
                marginRight: 12,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 2,
                borderColor: '#ffffff',
              }}>
                <Feather name="home" size={12} color="#ffffff" />
              </View>
              <Text style={[styles.text, { fontSize: 14, color: theme.text, fontWeight: '500' }]}>
                Your registered location
              </Text>
            </View>
          )}
          
          {currentGpsLocation && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <View style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: isDark ? '#4f8df5' : '#007AFF',
                marginRight: 12,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 2,
                borderColor: '#ffffff',
              }}>
                <Feather name="navigation" size={12} color="#ffffff" />
              </View>
              <Text style={[styles.text, { fontSize: 14, color: theme.text, fontWeight: '500' }]}>
                Your current location
              </Text>
            </View>
          )}
          
          {otherPartyLocation && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: isDark ? '#FF7043' : '#FF5722',
                marginRight: 12,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 2,
                borderColor: '#ffffff',
              }}>
                <Feather 
                  name={otherPartyRole === 'Donor' ? 'heart' : 'user'} 
                  size={12} 
                  color="#ffffff" 
                />
              </View>
              <Text style={[styles.text, { fontSize: 14, color: theme.text, fontWeight: '500' }]}>
                {otherPartyRole} location 
              </Text>
            </View>
          )}
        </View>
        
        {distanceInfo && distanceInfo.map((info, index) => (
          <InfoRow 
            key={index}
            label={info.label}
            value={info.value}
            isLast={index === distanceInfo.length - 1}
            valueColor={info.color}
          />
        ))}

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
        backgroundColor: theme.card,
        borderRadius: 12, 
        justifyContent: 'center', 
        alignItems: 'center',
        marginBottom: 16
      }}>
        {loadingLocation ? (
          <>
            <ActivityIndicator color={theme.primary} size="large" />
            <Text style={[styles.text, { color: theme.text, marginTop: 8 }]}>Getting your location...</Text>
          </>
        ) : !locationPermission ? (
          <>
            <Feather name="map-pin" size={32} color={theme.textSecondary} />
            <Text style={[styles.text, { color: theme.text, marginTop: 8, textAlign: 'center' }]}>
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
        ) : !otherPartyLocation ? (
          <>
            <Feather name="map-pin" size={32} color={theme.textSecondary} />
            <Text style={[styles.text, { color: theme.text, marginTop: 8, textAlign: 'center' }]}>
              {otherPartyRole} location not available 
            </Text>
          </>
        ) : (
          <>
            <Feather name="map-pin" size={32} color={theme.textSecondary} />
            <Text style={[styles.text, { color: theme.text, marginTop: 8, textAlign: 'center' }]}>
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
