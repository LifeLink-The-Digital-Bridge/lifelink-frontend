import React, { useEffect, useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import * as Location from "expo-location";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../utils/theme-context";
import { lightTheme, darkTheme } from "../../constants/styles/authStyles";
import { createUnifiedStyles } from "../../constants/styles/unifiedStyles";
import AppLayout from "@/components/AppLayout";
import { StatusHeader } from "@/components/common/StatusHeader";
import ScrollableHeaderLayout from "@/components/common/ScrollableHeaderLayout";

const MapScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);
  const mapRef = useRef<MapView>(null);

  const [region, setRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null>(null);

  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [gettingCurrentLocation, setGettingCurrentLocation] = useState(false);
  const [mapRotation, setMapRotation] = useState(0);

  const appDarkBlueMapStyle = [
    {
      elementType: "geometry",
      stylers: [{ color: "#1a1f2e" }],
    },
    {
      elementType: "labels.text.fill",
      stylers: [{ color: "#8ea4c7" }],
    },
    {
      elementType: "labels.text.stroke",
      stylers: [{ color: "#1a1f2e" }],
    },
    {
      featureType: "administrative",
      elementType: "geometry",
      stylers: [{ color: "#2a3441" }],
    },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#4f8df5" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#8ea4c7" }],
    },
    {
      featureType: "poi.business",
      stylers: [{ visibility: "on" }],
    },
    {
      featureType: "poi.business",
      elementType: "labels.text.fill",
      stylers: [{ color: "#a3b3c7" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#1e2832" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#6b8a76" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#2a3441" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#8ea4c7" }],
    },
    {
      featureType: "road.arterial",
      elementType: "geometry",
      stylers: [{ color: "#34404f" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#3d4a5a" }],
    },
    {
      featureType: "road.highway.controlled_access",
      elementType: "geometry",
      stylers: [{ color: "#475463" }],
    },
    {
      featureType: "road.local",
      elementType: "labels.text.fill",
      stylers: [{ color: "#7a8a9a" }],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#243142" }],
    },
    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [{ color: "#8ea4c7" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#0f1419" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#4f8df5" }],
    },
  ];

  const appLightMapStyle = [
    {
      featureType: "poi.business",
      stylers: [{ visibility: "on" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#4f8df5" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#4f8df5" }],
    },
  ];

  useEffect(() => {
    const initializeMap = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission denied", "Location permission is required");
          return;
        }

        if (params.latitude && params.longitude) {
          const lat = parseFloat(params.latitude as string);
          const lng = parseFloat(params.longitude as string);
          if (!isNaN(lat) && !isNaN(lng)) {
            const initialRegion = {
              latitude: lat,
              longitude: lng,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            };
            setRegion(initialRegion);
            setSelectedLocation({ latitude: lat, longitude: lng });
          } else {
            await getCurrentLocationInternal();
          }
        } else {
          await getCurrentLocationInternal();
        }
      } catch (error) {
        console.error("Error initializing map:", error);
        Alert.alert("Error", "Failed to load map");
      } finally {
        setLoading(false);
      }
    };

    const getCurrentLocationInternal = async () => {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const currentRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(currentRegion);
      setSelectedLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    };

    initializeMap();
  }, [params.latitude, params.longitude]);

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
    console.log("Location selected:", { latitude, longitude });
  };

  const handleRegionChangeComplete = (newRegion: any) => {
    if (newRegion.longitudeDelta && newRegion.latitudeDelta) {
      setMapRotation(0);
    }
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      if (params.returnScreen === "donor") {
        router.replace({
          pathname: "/navigation/donorScreen",
          params: {
            selectedLatitude: selectedLocation.latitude.toString(),
            selectedLongitude: selectedLocation.longitude.toString(),
            fromMap: "true",
          },
        });
      } else if (params.returnScreen === "recipient") {
        router.replace({
          pathname: "/navigation/RecipientScreen",
          params: {
            selectedLatitude: selectedLocation.latitude.toString(),
            selectedLongitude: selectedLocation.longitude.toString(),
            fromMap: "true",
          },
        });
      } else {
        router.back();
      }
    } else {
      Alert.alert("No Location", "Please select a location on the map");
    }
  };

  const handleCurrentLocation = async () => {
    try {
      setGettingCurrentLocation(true);
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const newLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setSelectedLocation(newLocation);
      
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          ...newLocation,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }, 1000);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to get current location");
    } finally {
      setGettingCurrentLocation(false);
    }
  };

  if (loading || !region) {
    return (
      <AppLayout>
        <View
          style={[
            styles.container,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <ActivityIndicator size="large" color={theme.primary} />
          <Text
            style={[
              styles.sectionTitle,
              { marginTop: 16, textAlign: "center" },
            ]}
          >
            Loading map...
          </Text>
        </View>
      </AppLayout>
    );
  }

  return (
    <ScrollableHeaderLayout>
      <View style={styles.container}>
        <StatusHeader
          title="Select Location"
          subtitle="Tap on map to choose location"
          iconName="map-pin"
          showBackButton
          theme={theme}
        />

        <View style={{ flex: 1 }}>
          <MapView
            ref={mapRef}
            provider={PROVIDER_DEFAULT}
            style={{ flex: 1 }}
            region={region}
            onPress={handleMapPress}
            onRegionChangeComplete={handleRegionChangeComplete}
            showsUserLocation={true}
            showsMyLocationButton={false}
            showsPointsOfInterest={true}
            showsBuildings={true}
            showsTraffic={false}
            showsIndoors={true}
            showsCompass={false}
            rotateEnabled={true}
            pitchEnabled={true}
            scrollEnabled={true}
            zoomEnabled={true}
            loadingEnabled={true}
            customMapStyle={isDark ? appDarkBlueMapStyle : appLightMapStyle}
          >
            {selectedLocation && (
              <Marker coordinate={selectedLocation} title="Selected Location">
                <View
                  style={{
                    backgroundColor: theme.primary,
                    padding: 8,
                    borderRadius: 25,
                    borderWidth: 3,
                    borderColor: "#ffffff",
                    shadowColor: theme.primary,
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.4,
                    shadowRadius: 6,
                    elevation: 8,
                  }}
                >
                  <Feather name="map-pin" size={18} color="#ffffff" />
                </View>
              </Marker>
            )}
          </MapView>

          {selectedLocation && (
            <View
              style={{
                position: "absolute",
                top: 20,
                left: 20,
                right: 20,
                backgroundColor: isDark
                  ? "rgba(26, 31, 46, 0.95)"
                  : "rgba(255, 255, 255, 0.95)",
                padding: 16,
                borderRadius: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
                elevation: 8,
                borderWidth: 1,
                borderColor: isDark
                  ? "rgba(79, 141, 245, 0.3)"
                  : "rgba(79, 141, 245, 0.2)",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <View
                  style={{
                    backgroundColor: theme.primary,
                    padding: 6,
                    borderRadius: 12,
                    marginRight: 12,
                  }}
                >
                  <Feather name="map-pin" size={14} color="#ffffff" />
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "700",
                    color: theme.text,
                    flex: 1,
                  }}
                >
                  Selected Location
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: "monospace",
                  color: theme.textSecondary,
                  fontWeight: "500",
                  backgroundColor: isDark
                    ? "rgba(79, 141, 245, 0.1)"
                    : "rgba(79, 141, 245, 0.05)",
                  padding: 8,
                  borderRadius: 8,
                  textAlign: "center",
                }}
              >
                {selectedLocation.latitude.toFixed(6)},{" "}
                {selectedLocation.longitude.toFixed(6)}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={{
              position: "absolute",
              top: selectedLocation ? 170 : 20,
              right: 20,
              backgroundColor: isDark
                ? "rgba(26, 31, 46, 0.95)"
                : "rgba(255, 255, 255, 0.95)",
              width: 44,
              height: 44,
              borderRadius: 22,
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 6,
              borderWidth: 1,
              borderColor: isDark
                ? "rgba(79, 141, 245, 0.3)"
                : "rgba(0,0,0,0.1)",
            }}
            onPress={handleCurrentLocation}
            disabled={gettingCurrentLocation}
          >
            {gettingCurrentLocation ? (
              <ActivityIndicator color={theme.primary} size="small" />
            ) : (
              <View
                style={{
                  transform: [{ rotate: `${-mapRotation}deg` }],
                }}
              >
                <Feather name="navigation" size={18} color={theme.primary} />
              </View>
            )}
          </TouchableOpacity>

          <View
            style={{
              position: "absolute",
              bottom: 30,
              left: 20,
              right: 20,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: selectedLocation
                  ? theme.primary
                  : isDark
                  ? "rgba(79, 141, 245, 0.3)"
                  : "rgba(79, 141, 245, 0.5)",
                borderRadius: 30,
                paddingVertical: 14,
                paddingHorizontal: 24,
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                shadowColor: theme.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: selectedLocation ? 0.3 : 0.1,
                shadowRadius: 12,
                elevation: 8,
                justifyContent: "center",
              }}
              onPress={handleConfirmLocation}
              disabled={!selectedLocation}
            >
              <Feather name="check" size={20} color="#fff" />
              <Text
                style={{
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: "700",
                }}
              >
                Confirm Location
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollableHeaderLayout>
  );
};

export default MapScreen;
