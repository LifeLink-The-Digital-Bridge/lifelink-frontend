import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import AppLayout from "@/components/AppLayout";

export default function HomeScreenContent() {
  return (
    <AppLayout hideHeader>
      <View style={homeStyles.container}>
        <Image
          source={require("../../assets/images/Lifelink_splash.png")}
          style={homeStyles.logo}
        />
        <Text style={homeStyles.title}>LifeLink</Text>
        <Text style={homeStyles.subtitle}>
          <FontAwesome name="heartbeat" size={18} color="#e17055" /> Connecting
          donors and recipients across India.
        </Text>
        <Link href="/(auth)/loginScreen" asChild>
          <TouchableOpacity style={homeStyles.button}>
            <Text style={homeStyles.buttonText}>Login</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/(auth)/registerScreen" asChild>
          <TouchableOpacity style={homeStyles.buttonSecondary}>
            <Text style={homeStyles.buttonText}>Register</Text>
          </TouchableOpacity>
        </Link>
        <Text style={homeStyles.footer}>
          © {new Date().getFullYear()} LifeLink
        </Text>
      </View>
    </AppLayout>
  );
}

const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f8fa",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  logo: {
    width: 200,
    height: 150,
    marginBottom: 10,
    resizeMode: "contain",
    borderColor: "#0984e3",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0984e3",
    marginBottom: 6,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: "#636e72",
    textAlign: "center",
    marginBottom: 32,
    marginHorizontal: 10,
  },
  button: {
    backgroundColor: "#0984e3",
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 10,
    marginBottom: 16,
    width: "80%",
    alignItems: "center",
  },
  buttonSecondary: {
    backgroundColor: "#6c5ce7",
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    marginBottom: 32,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 17,
  },
  footer: {
    color: "#b2bec3",
    fontSize: 13,
    marginTop: 16,
  },
});
