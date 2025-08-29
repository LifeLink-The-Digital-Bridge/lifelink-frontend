// constants/styles/donateHubStyles.ts
import { StyleSheet, ViewStyle, TextStyle } from "react-native";

export const createDonateHubStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    } as ViewStyle,

    scrollContent: {
      padding: 16,
      paddingBottom: 100,
    } as ViewStyle,

    loadingContainer: {
      flex: 1,
      justifyContent: "center" as ViewStyle["justifyContent"],
      alignItems: "center" as ViewStyle["alignItems"],
      backgroundColor: theme.background,
    } as ViewStyle,

    loadingText: {
      color: theme.textSecondary,
      marginTop: 16,
      fontSize: 16,
    } as TextStyle,

    // Modern Header Styles
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.card,
      padding: 20,
      borderRadius: 20,
      marginBottom: 24,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 6,
      borderWidth: 1,
      borderColor: theme.border + "40",
    } as ViewStyle,

    headerIconContainer: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.primary + "15",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    } as ViewStyle,

    headerTextContainer: {
      flex: 1,
    } as ViewStyle,

    headerTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.text,
      letterSpacing: 0.3,
    } as TextStyle,

    headerSubtitle: {
      fontSize: 14,
      color: theme.textSecondary,
      marginTop: 2,
      fontWeight: "500",
    } as TextStyle,

    statusBadge: {
      backgroundColor: theme.success + "15",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.success + "30",
    } as ViewStyle,

    statusText: {
      color: theme.success,
      fontSize: 12,
      fontWeight: "600",
      letterSpacing: 0.5,
    } as TextStyle,

    // Enhanced Card Styles
    card: {
      backgroundColor: theme.card,
      borderRadius: 20,
      padding: 24,
      marginBottom: 24,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 6,
      borderWidth: 1,
      borderColor: theme.border + "40",
    } as ViewStyle,

    sectionCard: {
      backgroundColor: theme.background,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.border + "30",
    } as ViewStyle,

    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    } as ViewStyle,

    sectionIconContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.primary + "15",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    } as ViewStyle,

    sectionTitle: {
      fontWeight: "700",
      fontSize: 16,
      color: theme.text,
      letterSpacing: 0.3,
    } as TextStyle,

    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.border + "20",
    } as ViewStyle,

    lastInfoRow: {
      borderBottomWidth: 0,
    } as ViewStyle,

    detailText: {
      fontSize: 15,
      color: theme.text,
      marginBottom: 6,
      lineHeight: 22,
    } as TextStyle,

    labelText: {
      fontWeight: "600",
      color: theme.text,
      fontSize: 14,
      flex: 1,
    } as TextStyle,

    valueText: {
      fontWeight: "500",
      color: theme.textSecondary,
      fontSize: 14,
      textAlign: "right",
      flex: 1,
    } as TextStyle,

    button: {
      paddingVertical: 18,
      paddingHorizontal: 24,
      borderRadius: 16,
      alignItems: "center",
      marginBottom: 16,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    } as ViewStyle,

    primaryButton: {
      backgroundColor: theme.primary,
    } as ViewStyle,

    updateButton: {
      backgroundColor: "#00b894",
    } as ViewStyle,

    buttonText: {
      color: "#fff",
      fontWeight: "700",
      fontSize: 17,
      letterSpacing: 0.8,
    } as TextStyle,
  });
