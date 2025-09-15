import React, { useEffect, useState } from "react";
import { View, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { AuthProvider } from "../../utils/auth-context";
import AppLayout from "@/components/AppLayout";

const MapScreen = () => {
  const router = useRouter();
  const [region, setRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null>(null);
  const [marker, setMarker] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      let loc = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setMarker({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
  }, []);

  const handleConfirm = () => {
    if (marker) {
      router.replace({
        pathname: "/navigation/donorScreen",
        params: {
          latitude: marker.latitude.toString(),
          longitude: marker.longitude.toString(),
        },
      });
    }
  };

  if (!region) return null;

  return (
    <AuthProvider>
      <AppLayout>
        <View style={{ flex: 1 }}>
          <MapView
            style={{ flex: 1 }}
            region={region}
            onPress={(e) => {
              const { latitude, longitude } = e.nativeEvent.coordinate;
              setMarker({ latitude, longitude });
            }}
          >
            {marker && <Marker coordinate={marker} />}
          </MapView>
          <Button title="Confirm Location" onPress={handleConfirm} />
        </View>
      </AppLayout>
    </AuthProvider>
  );
};

export default MapScreen;
