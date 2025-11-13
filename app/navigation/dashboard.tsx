import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Animated,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../../utils/auth-context";
import { useTheme } from "../../utils/theme-context";
import { useTabBar } from "../../utils/tabbar-context";
import { lightTheme, darkTheme } from "../../constants/styles/authStyles";
import { createDashboardStyles } from "../../constants/styles/dashboardStyles";
import { createUnifiedStyles } from "../../constants/styles/unifiedStyles";
import ScrollableHeaderLayout from "../../components/common/ScrollableHeaderLayout";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

import { TopBar } from "../../components/common/TopBar";
import { SidebarMenu } from "../../components/dashboard/SidebarMenu";
import { WelcomeSection } from "../../components/dashboard/WelcomeSection";
import { ChatBot } from "../../components/dashboard/ChatBot";

const TOPBAR_HEIGHT = 90;

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const { colorScheme } = useTheme();
  const { hideTabBar, showTabBar } = useTabBar();

  const isDark = colorScheme === "dark";
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createDashboardStyles(theme);
  const unifiedStyles = createUnifiedStyles(theme);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    roles: "",
    userId: "",
  });
  const [showChatIcon, setShowChatIcon] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [nearbyData, setNearbyData] = useState<any[]>([]);
  const [loadingNearby, setLoadingNearby] = useState(false);

  const [validationAlertVisible, setValidationAlertVisible] = useState(false);
  const [validationAlertMessage, setValidationAlertMessage] = useState("");
  const [validationAlertTitle, setValidationAlertTitle] = useState("");

  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const topBarTranslateY = useRef(new Animated.Value(0)).current;

  const hasCheckedPermissions = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("../(auth)/loginScreen");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        const [username, email, roles, userId] = await Promise.all([
          SecureStore.getItemAsync("username"),
          SecureStore.getItemAsync("email"),
          SecureStore.getItemAsync("roles"),
          SecureStore.getItemAsync("userId"),
        ]);

        setUserData({
          username: username || "",
          email: email || "",
          roles: roles || "",
          userId: userId || "",
        });

        if (!hasCheckedPermissions.current) {
          hasCheckedPermissions.current = true;
          checkExistingLocationPermission();
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  const checkExistingLocationPermission = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      
      if (status === "granted") {
        setLocationPermission(true);
        getCurrentLocation();
      } else {
        setLocationPermission(false);
      }
    } catch (error) {
      console.error("Error checking location permission:", error);
      setLocationPermission(false);
    }
  };

  const handleEnableLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status === "granted") {
        setLocationPermission(true);
        await getCurrentLocation();
      } else {
        setLocationPermission(false);
        showValidationAlert(
          "Permission Denied",
          "Location permission is required to see nearby activity. Please enable it in your device settings."
        );
      }
    } catch (error) {
      console.error("Error requesting location permission:", error);
      setLocationPermission(false);
    }
  };

  const getCurrentLocation = async () => {
    try {
      setLoadingNearby(true);
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setCurrentLocation(location);
      
      await fetchNearbyData(location.coords.latitude, location.coords.longitude);
    } catch (error) {
      console.error("Error getting current location:", error);
      setLoadingNearby(false);
    }
  };

  const fetchNearbyData = async (latitude: number, longitude: number) => {
    try {
      setLoadingNearby(true);
    
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setNearbyData([]);
      
    } catch (error) {
      console.error("Error fetching nearby data:", error);
      setNearbyData([]);
    } finally {
      setLoadingNearby(false);
    }
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const currentScrollY = event.nativeEvent.contentOffset.y;
        const diff = currentScrollY - lastScrollY.current;

        if (diff > 0 && currentScrollY > 50) {
          Animated.timing(topBarTranslateY, {
            toValue: -TOPBAR_HEIGHT,
            duration: 200,
            useNativeDriver: true,
          }).start();
          hideTabBar();
        } else if (diff < 0 || currentScrollY <= 0) {
          Animated.timing(topBarTranslateY, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
          showTabBar();
        }

        setShowChatIcon(currentScrollY <= 10);
        lastScrollY.current = currentScrollY;
      },
    }
  );

  const showValidationAlert = (title: string, message: string) => {
    setValidationAlertTitle(title);
    setValidationAlertMessage(message);
    setValidationAlertVisible(true);
  };

  const handleChatBotPress = () => {
    showValidationAlert("Chat Bot", "Chat functionality coming soon!");
  };

  const handleBellPress = () => {
    showValidationAlert("Notifications", "No new notifications at the moment");
  };

    const handleRaiseFund = () => {
    showValidationAlert(
      "Raise Fund", 
      "Raise Fund functionality coming soon! We're working hard to bring you this feature."
    );
  };

  const nearbyStyles = StyleSheet.create({
    sectionContainer: {
      backgroundColor: theme.card,
      borderRadius: wp("4%"),
      padding: wp("5%"),
      marginTop: hp("2%"),
      marginBottom: hp("2%"),
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: hp("2%"),
    },
    sectionTitle: {
      fontSize: wp("4.5%"),
      fontWeight: "700",
      color: theme.text,
    },
    locationDisabled: {
      alignItems: "center",
      paddingVertical: hp("3%"),
    },
    locationIcon: {
      width: wp("15%"),
      height: wp("15%"),
      borderRadius: wp("7.5%"),
      backgroundColor: theme.primary + "15",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: hp("2%"),
    },
    locationDisabledText: {
      fontSize: wp("3.5%"),
      color: theme.textSecondary,
      textAlign: "center",
      marginBottom: hp("2%"),
      lineHeight: wp("5%"),
    },
    enableLocationButton: {
      backgroundColor: theme.primary,
      paddingVertical: hp("1.5%"),
      paddingHorizontal: wp("6%"),
      borderRadius: wp("2.5%"),
      marginTop: hp("1%"),
    },
    enableLocationText: {
      color: "#fff",
      fontSize: wp("3.5%"),
      fontWeight: "600",
    },
    emptyState: {
      alignItems: "center",
      paddingVertical: hp("3%"),
    },
    emptyIcon: {
      marginBottom: hp("2%"),
    },
    emptyText: {
      fontSize: wp("4%"),
      fontWeight: "600",
      color: theme.text,
      marginBottom: hp("1%"),
    },
    emptySubtext: {
      fontSize: wp("3.5%"),
      color: theme.textSecondary,
      textAlign: "center",
    },
  });

  const alertStyles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
      padding: wp("5%"),
    },
    container: {
      backgroundColor: theme.card,
      borderRadius: wp("4%"),
      padding: wp("6%"),
      width: "100%",
      maxWidth: 340,
      alignItems: "center",
    },
    iconContainer: {
      width: wp("14%"),
      height: wp("14%"),
      borderRadius: wp("7%"),
      backgroundColor: theme.primary + "20",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: hp("2%"),
    },
    title: {
      fontSize: wp("5%"),
      fontWeight: "700",
      color: theme.text,
      marginBottom: hp("1%"),
      textAlign: "center",
    },
    message: {
      fontSize: wp("3.75%"),
      color: theme.textSecondary,
      textAlign: "center",
      marginBottom: hp("3%"),
      lineHeight: wp("5.5%"),
    },
    button: {
      backgroundColor: theme.primary,
      paddingVertical: hp("1.5%"),
      paddingHorizontal: wp("8%"),
      borderRadius: wp("2.5%"),
      width: "100%",
    },
    buttonText: {
      color: "#fff",
      fontSize: wp("4%"),
      fontWeight: "600",
      textAlign: "center",
    },
  });

  if (loading) {
    return (
      <ScrollableHeaderLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </ScrollableHeaderLayout>
    );
  }

  return (
    <ScrollableHeaderLayout>
      <View style={{ flex: 1, overflow: "hidden" }}>
        <SidebarMenu
          isVisible={menuVisible}
          onClose={() => setMenuVisible(false)}
        />

        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            transform: [{ translateY: topBarTranslateY }],
          }}
        >
          <TopBar
            theme={theme}
            onMenuPress={() => setMenuVisible(true)}
            onBellPress={handleBellPress}
          />
        </Animated.View>

        <ScrollView
          contentContainerStyle={{
            paddingTop: TOPBAR_HEIGHT,
            paddingBottom: 120,
            paddingHorizontal: 18,
          }}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          <WelcomeSection username={userData.username} />

          <View style={nearbyStyles.sectionContainer}>
            <View style={nearbyStyles.sectionHeader}>
              <Text style={nearbyStyles.sectionTitle}>Nearby Activity</Text>
              <Feather name="map-pin" size={wp("5%")} color={theme.primary} />
            </View>

            {locationPermission === false ? (
              <View style={nearbyStyles.locationDisabled}>
                <View style={nearbyStyles.locationIcon}>
                  <Feather name="map-pin" size={wp("8%")} color={theme.primary} />
                </View>
                <Text style={nearbyStyles.locationDisabledText}>
                  Enable location to see nearby donors and recipients
                </Text>
                <TouchableOpacity
                  style={nearbyStyles.enableLocationButton}
                  onPress={handleEnableLocation}
                >
                  <Text style={nearbyStyles.enableLocationText}>
                    Enable Location
                  </Text>
                </TouchableOpacity>
              </View>
            ) : loadingNearby ? (
              <View style={{ paddingVertical: hp("3%"), alignItems: "center" }}>
                <ActivityIndicator size="small" color={theme.primary} />
                <Text
                  style={{
                    marginTop: hp("1%"),
                    color: theme.textSecondary,
                    fontSize: wp("3.5%"),
                  }}
                >
                  Finding nearby activity...
                </Text>
              </View>
            ) : nearbyData.length === 0 ? (
              <View style={nearbyStyles.emptyState}>
                <Feather
                  name="users"
                  size={wp("12%")}
                  color={theme.textSecondary}
                  style={nearbyStyles.emptyIcon}
                />
                <Text style={nearbyStyles.emptyText}>
                  No activity nearby
                </Text>
                <Text style={nearbyStyles.emptySubtext}>
                  No donors or recipients found in your area at the moment
                </Text>
              </View>
            ) : (
              <View>
                {nearbyData.map((item, index) => (
                  <Text key={index}>{item.name}</Text>
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        <ChatBot visible={showChatIcon} onPress={handleChatBotPress} />

        <Modal
          visible={validationAlertVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setValidationAlertVisible(false)}
        >
          <TouchableOpacity
            style={alertStyles.overlay}
            activeOpacity={1}
            onPress={() => setValidationAlertVisible(false)}
          >
            <TouchableOpacity style={alertStyles.container} activeOpacity={1}>
              <View style={alertStyles.iconContainer}>
                <Feather name="bell" size={wp("7%")} color={theme.primary} />
              </View>
              <Text style={alertStyles.title}>{validationAlertTitle}</Text>
              <Text style={alertStyles.message}>{validationAlertMessage}</Text>
              <TouchableOpacity
                style={alertStyles.button}
                onPress={() => setValidationAlertVisible(false)}
              >
                <Text style={alertStyles.buttonText}>Got it</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      </View>
    </ScrollableHeaderLayout>
  );
};

export default Dashboard;
