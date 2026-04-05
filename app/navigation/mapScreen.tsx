import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import * as Location from "expo-location";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../utils/theme-context";
import { lightTheme, darkTheme } from "../../constants/styles/authStyles";
import { createUnifiedStyles } from "../../constants/styles/unifiedStyles";
import { StatusHeader } from "@/components/common/StatusHeader";
import { getNearbyUsers, NearbyUser } from "../api/userApi";
import { SafeAreaView } from "react-native-safe-area-context";

type FilterKey = "DOCTOR" | "MIGRANT" | "NGO" | "HOSPITAL";

interface HospitalMarker {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  address: string;
}

const FILTER_COLORS: Record<FilterKey, string> = {
  DOCTOR: "#2563eb",
  MIGRANT: "#16a34a",
  NGO: "#f59e0b",
  HOSPITAL: "#dc2626",
};

const parseParam = (value: string | string[] | undefined): string | undefined => {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
};

const MapScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);
  const mapRef = useRef<MapView>(null);

  const returnScreen = parseParam(params.returnScreen as string | string[] | undefined);
  const paramLatitude = parseParam(params.latitude as string | string[] | undefined);
  const paramLongitude = parseParam(params.longitude as string | string[] | undefined);

  const isPickerMode = Boolean(returnScreen);

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
  const [loadingNearby, setLoadingNearby] = useState(false);
  const [mapRotation, setMapRotation] = useState(0);
  const [nearbyUsers, setNearbyUsers] = useState<NearbyUser[]>([]);
  const [nearbyHospitals, setNearbyHospitals] = useState<HospitalMarker[]>([]);
  const [radiusKm, setRadiusKm] = useState(10);
  const [showFiltersPanel, setShowFiltersPanel] = useState(true);
  const [filters, setFilters] = useState<Record<FilterKey, boolean>>({
    DOCTOR: true,
    MIGRANT: true,
    NGO: true,
    HOSPITAL: true,
  });

  const appDarkBlueMapStyle = [
    { elementType: "geometry", stylers: [{ color: "#1a1f2e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#8ea4c7" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#1a1f2e" }] },
    { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#2a3441" }] },
    { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#4f8df5" }] },
    { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#8ea4c7" }] },
    { featureType: "poi.business", stylers: [{ visibility: "on" }] },
    { featureType: "poi.business", elementType: "labels.text.fill", stylers: [{ color: "#a3b3c7" }] },
    { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#1e2832" }] },
    { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b8a76" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#2a3441" }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#8ea4c7" }] },
    { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#34404f" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3d4a5a" }] },
    { featureType: "road.highway.controlled_access", elementType: "geometry", stylers: [{ color: "#475463" }] },
    { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#7a8a9a" }] },
    { featureType: "transit", elementType: "geometry", stylers: [{ color: "#243142" }] },
    { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#8ea4c7" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#0f1419" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#4f8df5" }] },
  ];

  const appLightMapStyle = [
    { featureType: "poi.business", stylers: [{ visibility: "on" }] },
    { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#4f8df5" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#4f8df5" }] },
  ];

  useEffect(() => {
    const initializeMap = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission denied", "Location permission is required");
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const current = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        };

        const paramLat = paramLatitude ? parseFloat(paramLatitude) : NaN;
        const paramLng = paramLongitude ? parseFloat(paramLongitude) : NaN;

        const initialLocation =
          !Number.isNaN(paramLat) && !Number.isNaN(paramLng)
            ? { latitude: paramLat, longitude: paramLng }
            : current;

        setSelectedLocation(initialLocation);
        setRegion({
          latitude: initialLocation.latitude,
          longitude: initialLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });

        if (!isPickerMode) {
          await refreshNearby(initialLocation.latitude, initialLocation.longitude);
        }
      } catch (error) {
        console.error("Error initializing map:", error);
        Alert.alert("Error", "Failed to load map");
      } finally {
        setLoading(false);
      }
    };

    initializeMap();
  }, [isPickerMode, paramLatitude, paramLongitude]);

  const haversineDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const earthRadiusKm = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
  };

  const fetchNearbyHospitals = async (
    latitude: number,
    longitude: number,
    radiusInKm: number,
  ): Promise<HospitalMarker[]> => {
    const radiusMeters = Math.round(radiusInKm * 1000);
    const overpassQuery = `[out:json][timeout:25];(node["amenity"="hospital"](around:${radiusMeters},${latitude},${longitude});way["amenity"="hospital"](around:${radiusMeters},${latitude},${longitude});relation["amenity"="hospital"](around:${radiusMeters},${latitude},${longitude}););out center tags;`;

    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: overpassQuery,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch hospitals");
    }

    const data = await response.json();
    const elements = Array.isArray(data?.elements) ? data.elements : [];

    return elements
      .map((element: any, index: number) => {
        const lat = element.lat ?? element.center?.lat;
        const lon = element.lon ?? element.center?.lon;
        if (typeof lat !== "number" || typeof lon !== "number") {
          return null;
        }
        const name = element.tags?.name || `Hospital ${index + 1}`;
        const address = [
          element.tags?.["addr:street"],
          element.tags?.["addr:city"],
          element.tags?.["addr:state"],
        ]
          .filter(Boolean)
          .join(", ");
        const distanceKm = haversineDistanceKm(latitude, longitude, lat, lon);

        return {
          id: String(element.id || `${lat}-${lon}`),
          name,
          latitude: lat,
          longitude: lon,
          distanceKm: Math.round(distanceKm * 100) / 100,
          address,
        } as HospitalMarker;
      })
      .filter(Boolean)
      .sort((a: HospitalMarker, b: HospitalMarker) => a.distanceKm - b.distanceKm)
      .slice(0, 40);
  };

  const refreshNearby = async (latitude: number, longitude: number, radiusOverride?: number) => {
    if (isPickerMode) {
      return;
    }
    const effectiveRadius = radiusOverride ?? radiusKm;

    try {
      setLoadingNearby(true);
      const [users, hospitals] = await Promise.all([
        getNearbyUsers(latitude, longitude, effectiveRadius, ["DOCTOR", "MIGRANT", "NGO"]),
        fetchNearbyHospitals(latitude, longitude, effectiveRadius),
      ]);
      setNearbyUsers(users);
      setNearbyHospitals(hospitals);
    } catch (error: any) {
      console.error("Nearby map fetch failed", error);
      Alert.alert("Map Data", error?.message || "Unable to load nearby map data");
    } finally {
      setLoadingNearby(false);
    }
  };

  const handleMapPress = async (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
    if (!isPickerMode) {
      await refreshNearby(latitude, longitude);
    }
  };

  const handleRegionChangeComplete = (newRegion: any) => {
    if (newRegion.longitudeDelta && newRegion.latitudeDelta) {
      setMapRotation(0);
    }
  };

  const navigateBackWithCoordinates = (pathname: string) => {
    if (!selectedLocation) {
      Alert.alert("No Location", "Please select a location on the map");
      return;
    }

    router.push({
      pathname: pathname as any,
      params: {
        selectedLatitude: selectedLocation.latitude.toString(),
        selectedLongitude: selectedLocation.longitude.toString(),
        fromMap: "true",
      },
    });
  };

  const handleConfirmLocation = () => {
    if (!selectedLocation) {
      Alert.alert("No Location", "Please select a location on the map");
      return;
    }

    if (returnScreen === "donor") {
      navigateBackWithCoordinates("/navigation/donorscreens/donorScreen");
      return;
    }
    if (returnScreen === "recipient") {
      navigateBackWithCoordinates("/navigation/recipientscreens/RecipientScreen");
      return;
    }
    if (returnScreen === "migrant-register") {
      navigateBackWithCoordinates("/(auth)/registerMigrantScreen");
      return;
    }
    if (returnScreen === "doctor-register") {
      navigateBackWithCoordinates("/(auth)/registerDoctorScreen");
      return;
    }
    if (returnScreen === "ngo-register") {
      navigateBackWithCoordinates("/(auth)/registerNGOScreen");
      return;
    }

    router.back();
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
        mapRef.current.animateToRegion(
          {
            ...newLocation,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          1000,
        );
      }

      if (!isPickerMode) {
        await refreshNearby(newLocation.latitude, newLocation.longitude);
      }
    } catch {
      Alert.alert("Error", "Failed to get current location");
    } finally {
      setGettingCurrentLocation(false);
    }
  };

  const toggleFilter = (key: FilterKey) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const markerColor = (role: string) => {
    if (role === "DOCTOR") return FILTER_COLORS.DOCTOR;
    if (role === "MIGRANT") return FILTER_COLORS.MIGRANT;
    if (role === "NGO") return FILTER_COLORS.NGO;
    return theme.primary;
  };

  const roleIconName = (role: string): keyof typeof MaterialIcons.glyphMap => {
    if (role === "DOCTOR") return "medical-services";
    if (role === "MIGRANT") return "directions-walk";
    if (role === "NGO") return "groups";
    return "person";
  };

  const visibleUsers = useMemo(
    () => nearbyUsers.filter((user) => filters[user.role as FilterKey]),
    [nearbyUsers, filters],
  );

  const visibleHospitals = useMemo(
    () => (filters.HOSPITAL ? nearbyHospitals : []),
    [nearbyHospitals, filters.HOSPITAL],
  );

  if (loading || !region) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}> 
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.sectionTitle, { marginTop: 16, textAlign: "center" }]}>Loading map...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        <View style={{ paddingTop: 4, paddingHorizontal: 12 }}>
          <StatusHeader
            title={isPickerMode ? "Select Location" : "Nearby Care Map"}
            subtitle={isPickerMode ? "Tap on map to choose location" : "Doctors, migrants, NGOs and hospitals around you"}
            iconName="map-pin"
            showBackButton={isPickerMode}
            theme={theme}
          />
        </View>

        <View style={{ flex: 1 }}>
          {!isPickerMode && showFiltersPanel && (
            <View
              style={{
                position: "absolute",
                top: 12,
                left: 12,
                right: 12,
                zIndex: 10,
                backgroundColor: isDark ? "rgba(26, 31, 46, 0.95)" : "rgba(255, 255, 255, 0.95)",
                borderRadius: 14,
                padding: 10,
                borderWidth: 1,
                borderColor: isDark ? "rgba(79, 141, 245, 0.3)" : "rgba(79, 141, 245, 0.2)",
              }}
            >
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {([
                  ["DOCTOR", "Doctors"],
                  ["MIGRANT", "Migrants"],
                  ["NGO", "NGOs"],
                  ["HOSPITAL", "Hospitals"],
                ] as [FilterKey, string][]).map(([key, label]) => (
                  <TouchableOpacity
                    key={key}
                    onPress={() => toggleFilter(key)}
                    style={{
                      backgroundColor: filters[key] ? FILTER_COLORS[key] : theme.border,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 20,
                      marginRight: 8,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: filters[key] ? "#fff" : FILTER_COLORS[key],
                        marginRight: 6,
                      }}
                    />
                    <Text style={{ color: filters[key] ? "#fff" : theme.text, fontSize: 12, fontWeight: "600" }}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
                <Text style={{ color: theme.textSecondary, fontSize: 12 }}>
                  {visibleUsers.length + visibleHospitals.length} markers within {radiusKm} km
                </Text>
                <TouchableOpacity onPress={() => selectedLocation && refreshNearby(selectedLocation.latitude, selectedLocation.longitude)}>
                  <Text style={{ color: theme.primary, fontSize: 12, fontWeight: "700" }}>
                    {loadingNearby ? "Refreshing..." : "Refresh"}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: "row", marginTop: 8 }}>
                {[5, 10, 20].map((value) => (
                  <TouchableOpacity
                    key={value}
                    onPress={() => {
                      setRadiusKm(value);
                      if (selectedLocation) {
                        refreshNearby(selectedLocation.latitude, selectedLocation.longitude, value);
                      }
                    }}
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 12,
                      backgroundColor: radiusKm === value ? theme.primary + "25" : "transparent",
                      marginRight: 8,
                    }}
                  >
                    <Text style={{ color: radiusKm === value ? theme.primary : theme.textSecondary, fontSize: 12 }}>
                      {value} km
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {!isPickerMode && (
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                zIndex: 11,
                backgroundColor: isDark ? "rgba(26, 31, 46, 0.95)" : "rgba(255, 255, 255, 0.95)",
                borderRadius: 16,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderWidth: 1,
                borderColor: isDark ? "rgba(79, 141, 245, 0.3)" : "rgba(79, 141, 245, 0.2)",
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() => setShowFiltersPanel((prev) => !prev)}
            >
              <Feather name={showFiltersPanel ? "chevron-up" : "sliders"} size={14} color={theme.primary} />
              <Text style={{ color: theme.primary, marginLeft: 6, fontSize: 12, fontWeight: "700" }}>
                {showFiltersPanel ? "Hide Filters" : "Show Filters"}
              </Text>
            </TouchableOpacity>
          )}

          <MapView
            ref={mapRef}
            provider={PROVIDER_DEFAULT}
            style={{ flex: 1 }}
            region={region}
            onPress={handleMapPress}
            onRegionChangeComplete={handleRegionChangeComplete}
            showsUserLocation
            showsMyLocationButton={false}
            showsPointsOfInterest
            showsBuildings
            showsCompass={false}
            rotateEnabled
            pitchEnabled
            scrollEnabled
            zoomEnabled
            loadingEnabled
            customMapStyle={isDark ? appDarkBlueMapStyle : appLightMapStyle}
          >
            {selectedLocation && (
              <Marker
                coordinate={selectedLocation}
                title={isPickerMode ? "Selected Location" : "Reference Point"}
                pinColor={isPickerMode ? theme.primary : "#111827"}
              />
            )}

            {!isPickerMode &&
              visibleUsers.map((user) => (
                <Marker
                  key={`user-${user.id}-${user.role}`}
                  coordinate={{ latitude: user.latitude, longitude: user.longitude }}
                  title={`${user.name} (${user.role})`}
                  description={`${user.distanceKm} km away${user.detail ? ` • ${user.detail}` : ""}`}
                >
                  <View
                    style={{
                      backgroundColor: markerColor(user.role),
                      padding: 6,
                      borderRadius: 18,
                      borderWidth: 2,
                      borderColor: "#fff",
                    }}
                  >
                    <MaterialIcons name={roleIconName(user.role)} size={16} color="#fff" />
                  </View>
                </Marker>
              ))}

            {!isPickerMode &&
              visibleHospitals.map((hospital) => (
                <Marker
                  key={`hospital-${hospital.id}`}
                  coordinate={{ latitude: hospital.latitude, longitude: hospital.longitude }}
                  title={hospital.name}
                  description={`${hospital.distanceKm} km away${hospital.address ? ` • ${hospital.address}` : ""}`}
                  pinColor="#dc2626"
                >
                  <View
                    style={{
                      backgroundColor: "#dc2626",
                      padding: 6,
                      borderRadius: 18,
                      borderWidth: 2,
                      borderColor: "#fff",
                    }}
                  >
                    <MaterialIcons name="local-hospital" size={16} color="#fff" />
                  </View>
                </Marker>
              ))}
          </MapView>

          <TouchableOpacity
            style={{
              position: "absolute",
              top: isPickerMode ? 20 : showFiltersPanel ? 190 : 70,
              right: 20,
              backgroundColor: isDark ? "rgba(26, 31, 46, 0.95)" : "rgba(255, 255, 255, 0.95)",
              width: 44,
              height: 44,
              borderRadius: 22,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderColor: isDark ? "rgba(79, 141, 245, 0.3)" : "rgba(0,0,0,0.1)",
            }}
            onPress={handleCurrentLocation}
            disabled={gettingCurrentLocation}
          >
            {gettingCurrentLocation ? (
              <ActivityIndicator color={theme.primary} size="small" />
            ) : (
              <View style={{ transform: [{ rotate: `${-mapRotation}deg` }] }}>
                <Feather name="navigation" size={18} color={theme.primary} />
              </View>
            )}
          </TouchableOpacity>

          {isPickerMode && selectedLocation && (
            <View
              style={{
                position: "absolute",
                top: 20,
                left: 20,
                right: 80,
                backgroundColor: isDark ? "rgba(26, 31, 46, 0.95)" : "rgba(255, 255, 255, 0.95)",
                padding: 12,
                borderRadius: 12,
              }}
            >
              <Text style={{ color: theme.text, fontWeight: "700", marginBottom: 4 }}>Selected Coordinates</Text>
              <Text style={{ color: theme.textSecondary, fontFamily: "monospace" }}>
                {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
              </Text>
            </View>
          )}

          {isPickerMode ? (
            <View style={{ position: "absolute", bottom: 30, left: 20, right: 20 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: selectedLocation ? theme.primary : theme.border,
                  borderRadius: 30,
                  paddingVertical: 14,
                  paddingHorizontal: 24,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                }}
                onPress={handleConfirmLocation}
                disabled={!selectedLocation}
              >
                <Feather name="check" size={20} color="#fff" />
                <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>Confirm Location</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MapScreen;
