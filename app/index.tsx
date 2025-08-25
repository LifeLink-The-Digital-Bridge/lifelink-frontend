import { Redirect } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, Image } from "react-native";
import { useAuth } from "../utils/auth-context";
import HomeScreenContent from "./navigation/HomeScreenContent";
import * as SplashScreen from "expo-splash-screen";
import AppLayout from "../components/AppLayout";

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const prepareSplash = async () => {
      await SplashScreen.preventAutoHideAsync();
      const timeout = setTimeout(async () => {
        setShowSplash(false);
        await SplashScreen.hideAsync();
      }, 1500);
      return () => clearTimeout(timeout);
    };
    prepareSplash();
  }, []);

  if (showSplash || isLoading) {
    return (
      <AppLayout hideHeader>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff",
          }}
        >
          <Image
            source={require("../assets/images/Lifelink_splash.png")}
            style={{ width: 200, height: 200, resizeMode: "contain" }}
          />
          <ActivityIndicator
            size="large"
            color="#0984e3"
            style={{ marginTop: 20 }}
          />
        </View>
      </AppLayout>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <HomeScreenContent />;
}
