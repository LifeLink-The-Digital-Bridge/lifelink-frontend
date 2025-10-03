import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { Redirect, router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { useTheme } from "../utils/theme-context";
import {
  lightTheme,
  darkTheme,
  createAuthStyles,
} from "../constants/styles/authStyles";
import { VideoLogo } from "../components/VideoLogo";
import AppLayout from "@/components/AppLayout";
import { useAuth } from "../utils/auth-context";

const { height: screenHeight } = Dimensions.get("window");

export default function HomeScreenContent() {
  const { colorScheme, setTheme } = useTheme();
  const currentTheme = colorScheme === "dark" ? darkTheme : lightTheme;
  const styles = createAuthStyles(currentTheme);

  const scrollViewRef = useRef<ScrollView>(null);
  const [showFeatures, setShowFeatures] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleScroll = (event: any) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    if (yOffset > 150 && !showFeatures) {
      setShowFeatures(true);
    } else if (yOffset <= 100 && showFeatures) {
      setShowFeatures(false);
    }
  };

  const scrollDownToFeatures = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ 
        y: screenHeight * 0.75, 
        animated: true 
      });
      setShowFeatures(true);
    }
  };

  const toggleTheme = () => {
    setTheme(colorScheme === 'dark' ? 'light' : 'dark');
  };

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  const homeStyles = {
    container: {
      flex: 1,
      backgroundColor: currentTheme.background,
    },
    scrollContent: {
      paddingBottom: 100,
    },
    heroSection: {
      height: screenHeight * 0.85,
      paddingHorizontal: 24,
      justifyContent: "center" as const,
      alignItems: "center" as const,
    },
    logoContainer: {
      width: 150,
      height: 150,
      marginBottom: 32,
      justifyContent: "center" as const,
      alignItems: "center" as const,
    },
    title: {
      fontSize: 36,
      fontWeight: "700" as const,
      color: currentTheme.text,
      textAlign: "center" as const,
      marginBottom: 12,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: 20,
      color: currentTheme.textSecondary,
      textAlign: "center" as const,
      marginBottom: 48,
      lineHeight: 28,
      paddingHorizontal: 20,
    },
    buttonContainer: {
      width: 300,
      maxWidth: 300,
      alignSelf: "center" as const,
    },
    primaryButton: {
      backgroundColor: currentTheme.primary,
      paddingVertical: 18,
      paddingHorizontal: 32,
      borderRadius: 16,
      alignItems: "center" as const,
      shadowColor: currentTheme.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
      marginBottom: 20,
    },
    secondaryButton: {
      backgroundColor: "transparent",
      borderWidth: 2,
      borderColor: currentTheme.primary,
      paddingVertical: 18,
      paddingHorizontal: 32,
      borderRadius: 16,
      alignItems: "center" as const,
    },
    buttonText: {
      fontSize: 18,
      fontWeight: "700" as const,
      color: "#fff",
    },
    secondaryButtonText: {
      fontSize: 18,
      fontWeight: "700" as const,
      color: currentTheme.primary,
    },
    featuresContainer: {
      paddingHorizontal: 24,
      paddingVertical: 40,
      minHeight: screenHeight * 0.6,
    },
    sectionTitle: {
      fontSize: 28,
      fontWeight: "700" as const,
      color: currentTheme.text,
      marginBottom: 32,
      textAlign: "center" as const,
    },
    featureItem: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      paddingVertical: 20,
      paddingHorizontal: 24,
      backgroundColor: currentTheme.card,
      borderRadius: 16,
      marginBottom: 16,
      shadowColor: currentTheme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    featureIcon: {
      marginRight: 20,
      padding: 8,
      backgroundColor: currentTheme.primary + "20",
      borderRadius: 12,
    },
    featureText: {
      flex: 1,
      fontSize: 16,
      color: currentTheme.text,
      fontWeight: "500" as const,
      lineHeight: 24,
    },
    scrollIndicator: {
      position: "absolute" as const,
      bottom: 10,
      left: 0,
      right: 0,
      alignItems: "center" as const,
      paddingVertical: 20,
    },
    scrollText: {
      fontSize: 14,
      color: currentTheme.textSecondary,
      marginBottom: 8,
    },
    themeToggle: {
      position: "absolute" as const,
      top: 50,
      right: 20,
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: currentTheme.card,
      borderWidth: 2,
      borderColor: currentTheme.border,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      shadowColor: currentTheme.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
      zIndex: 1000,
    },
  };

  const features = [
    {
      icon: "heart",
      title: "Save lives through organ and blood donation",
      delay: 100,
    },
    {
      icon: "users",
      title: "Connect with donors and recipients nearby",
      delay: 200,
    },
    {
      icon: "map-pin",
      title: "Find donation centers and hospitals",
      delay: 300,
    },
    { icon: "shield", title: "Secure and confidential platform", delay: 400 },
    { icon: "clock", title: "Emergency request handling 24/7", delay: 500 },
  ];

  return (
    <AppLayout>

    <View style={homeStyles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={homeStyles.container}
        contentContainerStyle={homeStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}
      >
        <Animated.View
          style={[
            homeStyles.heroSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          <Animatable.View
            animation="fadeIn"
            delay={200}
            style={homeStyles.logoContainer}
          >
            <VideoLogo
              style={{ width: 150, height: 150 }}
              autoPlay={true}
              loop={true}
            />
          </Animatable.View>

          <Animatable.Text
            style={homeStyles.title}
            animation="fadeInUp"
            delay={400}
          >
            Welcome to LifeLink
          </Animatable.Text>

          <Animatable.Text
            style={homeStyles.subtitle}
            animation="fadeInUp"
            delay={600}
          >
            Connecting hearts, saving lives through the power of donation
          </Animatable.Text>

          <Animatable.View
            style={homeStyles.buttonContainer}
            animation="fadeInUp"
            delay={800}
          >
            <TouchableOpacity
              style={homeStyles.primaryButton}
              onPress={() => router.push("/(auth)/loginScreen")}
              activeOpacity={0.8}
            >
              <Animatable.Text
                style={homeStyles.buttonText}
                animation="pulse"
                iterationCount="infinite"
                duration={3000}
              >
                Sign In
              </Animatable.Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={homeStyles.secondaryButton}
              onPress={() => router.push("/(auth)/registerScreen")}
              activeOpacity={0.8}
            >
              <Text style={homeStyles.secondaryButtonText}>Create Account</Text>
            </TouchableOpacity>
          </Animatable.View>
        </Animated.View>

        <View style={homeStyles.featuresContainer}>
          {showFeatures && (
            <>
              <Animatable.Text
                style={homeStyles.sectionTitle}
                animation="fadeInDown"
                duration={600}
              >
                How LifeLink Helps
              </Animatable.Text>

              {features.map((feature, index) => (
                <Animatable.View
                  key={index}
                  style={homeStyles.featureItem}
                  animation="fadeInRight"
                  delay={feature.delay}
                  duration={600}
                >
                  <View style={homeStyles.featureIcon}>
                    <Feather
                      name={feature.icon as any}
                      size={24}
                      color={currentTheme.primary}
                    />
                  </View>
                  <Text style={homeStyles.featureText}>{feature.title}</Text>
                </Animatable.View>
              ))}

              <Animatable.View
                style={{ alignItems: "center", paddingTop: 40, paddingBottom: 60 }}
                animation="fadeIn"
                delay={800}
              >
                <Text style={[homeStyles.scrollText, { textAlign: "center" }]}>
                  Join thousands of people making a difference
                </Text>
              </Animatable.View>
            </>
          )}
        </View>
      </ScrollView>

      {!showFeatures && (
        <TouchableOpacity
          style={homeStyles.scrollIndicator}
          onPress={scrollDownToFeatures}
          activeOpacity={0.7}
        >
          <Animatable.Text
            style={homeStyles.scrollText}
            animation="fadeIn"
            delay={1200}
          >
            Learn more about LifeLink
          </Animatable.Text>
          <Animatable.View
            animation="bounceIn"
            iterationCount="infinite"
            duration={1000}
          >
            <Feather
              name="chevron-down"
              size={28}
              color={currentTheme.primary}
            />
          </Animatable.View>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={homeStyles.themeToggle}
        onPress={toggleTheme}
        activeOpacity={0.8}
      >
        <Feather
          name={colorScheme === "dark" ? "sun" : "moon"}
          size={24}
          color={currentTheme.text}
        />
      </TouchableOpacity>
    </View>
        </AppLayout>

  );
}