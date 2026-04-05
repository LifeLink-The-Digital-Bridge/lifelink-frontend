import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import { MaterialIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../utils/theme-context";
import { lightTheme, darkTheme } from "../../constants/styles/authStyles";
import AppLayout from "../../components/AppLayout";

interface RoleOption {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof MaterialIcons.glyphMap | keyof typeof FontAwesome5.glyphMap;
  iconFamily: "MaterialIcons" | "FontAwesome5" | "Ionicons";
  color: string;
  description: string;
}

const roleOptions: RoleOption[] = [
  {
    id: "DONOR",
    title: "Blood Donor/Recipient",
    subtitle: "Donate or request blood",
    icon: "hand-holding-heart",
    iconFamily: "FontAwesome5",
    color: "#EF4444",
    description: "Join as a blood donor or register to request blood when needed",
  },
  {
    id: "MIGRANT",
    title: "Migrant Worker",
    subtitle: "Health record management",
    icon: "favorite",
    iconFamily: "MaterialIcons",
    color: "#8B5CF6",
    description: "Access portable health records with your Health ID",
  },
  {
    id: "DOCTOR",
    title: "Medical Professional",
    subtitle: "Manage patient records",
    icon: "local-hospital",
    iconFamily: "MaterialIcons",
    color: "#10B981",
    description: "Add and manage health records for patients",
  },
  {
    id: "NGO",
    title: "NGO / Organization",
    subtitle: "Community health services",
    icon: "people",
    iconFamily: "MaterialIcons",
    color: "#F59E0B",
    description: "Coordinate health services and support programs",
  },
];

export default function RoleSelectionScreen() {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;

  const handleRoleSelection = (roleId: string) => {
    if (roleId === "DONOR") {
      router.push({
        pathname: "/(auth)/registerScreen",
        params: { role: roleId },
      });
    } else if (roleId === "MIGRANT") {
      router.push({
        pathname: "/(auth)/registerMigrantScreen",
      });
    } else if (roleId === "DOCTOR") {
      router.push({
        pathname: "/(auth)/registerDoctorScreen",
      });
    } else if (roleId === "NGO") {
      router.push({
        pathname: "/(auth)/registerNGOScreen",
      });
    }
  };

  const renderIcon = (role: RoleOption) => {
    const iconProps = { size: 32, color: theme.card };

    switch (role.iconFamily) {
      case "MaterialIcons":
        return <MaterialIcons name={role.icon as any} {...iconProps} />;
      case "FontAwesome5":
        return <FontAwesome5 name={role.icon as any} {...iconProps} />;
      case "Ionicons":
        return <Ionicons name={role.icon as any} {...iconProps} />;
      default:
        return <MaterialIcons name="person" {...iconProps} />;
    }
  };

  return (
    <AppLayout showBackButton backRoute="/(auth)/loginScreen">
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>
            Choose Your Role
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Select how you want to use LifeLink
          </Text>
        </View>

        <View style={styles.rolesContainer}>
          {roleOptions.map((role) => (
            <TouchableOpacity
              key={role.id}
              style={[styles.roleCard, { backgroundColor: theme.card }]}
              onPress={() => handleRoleSelection(role.id)}
              activeOpacity={0.7}
            >
              <View
                style={[styles.iconContainer, { backgroundColor: role.color }]}
              >
                {renderIcon(role)}
              </View>

              <View style={styles.roleContent}>
                <Text style={[styles.roleTitle, { color: theme.text }]}>
                  {role.title}
                </Text>
                <Text style={[styles.roleSubtitle, { color: role.color }]}>
                  {role.subtitle}
                </Text>
                <Text
                  style={[styles.roleDescription, { color: theme.textSecondary }]}
                >
                  {role.description}
                </Text>
              </View>

              <MaterialIcons
                name="arrow-forward-ios"
                size={20}
                color={theme.textSecondary}
              />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={[styles.backText, { color: theme.textSecondary }]}>
            Back to Login
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  rolesContainer: {
    gap: 16,
  },
  roleCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  roleContent: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  roleSubtitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  roleDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  backButton: {
    marginTop: 24,
    paddingVertical: 16,
    alignItems: "center",
  },
  backText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
