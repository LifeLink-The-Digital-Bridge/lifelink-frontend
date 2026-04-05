import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../utils/responsive';

export const lightTheme = {
  background: "#f8fafc",
  card: "#ffffff",
  inputBackground: "#ffffff",
  text: "#1e293b",
  textSecondary: "#64748b",
  border: "#e2e8f0",
  primary: "#3b82f6",
  success: "#10b981",
  error: "#ef4444",
  warning: "#f59e0b",
  info: "#06b6d4",
  shadow: "#000",
  healthPrimary: "#8b5cf6",
  emergencyRed: "#dc2626",
};

export const darkTheme = {
  background: "#0f172a",
  card: "#1e293b",
  inputBackground: "#1e293b",
  text: "#f1f5f9",
  textSecondary: "#94a3b8",
  border: "#334155",
  primary: "#3b82f6",
  success: "#10b981",
  error: "#ef4444",
  warning: "#f59e0b",
  info: "#06b6d4",
  shadow: "#000",
  healthPrimary: "#8b5cf6",
  emergencyRed: "#dc2626",
};

export const createHealthStyles = (theme: typeof lightTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContainer: {
      paddingHorizontal: wp("5%"),
      paddingBottom: hp("10%"),
    },
    header: {
      paddingTop: hp("4.8%"),
      paddingBottom: hp("1.4%"),
      paddingHorizontal: wp("5%"),
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    headerTitle: {
      fontSize: wp("6.2%"),
      fontWeight: "700",
      color: theme.text,
      marginBottom: hp("0.3%"),
    },
    headerSubtitle: {
      fontSize: wp("3.8%"),
      color: theme.textSecondary,
    },
    
    card: {
      backgroundColor: theme.card,
      borderRadius: wp("4%"),
      padding: wp("5%"),
      marginVertical: hp("1.5%"),
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: hp("1.5%"),
    },
    cardTitle: {
      fontSize: wp("5%"),
      fontWeight: "700",
      color: theme.text,
      flex: 1,
    },
    cardSubtitle: {
      fontSize: wp("3.5%"),
      color: theme.textSecondary,
      marginBottom: hp("1%"),
    },
    
    qrContainer: {
      alignItems: "center",
      justifyContent: "center",
      padding: wp("6%"),
      backgroundColor: "#ffffff",
      borderRadius: wp("4%"),
      marginVertical: hp("2%"),
    },
    qrCode: {
      width: wp("60%"),
      height: wp("60%"),
      borderRadius: wp("2%"),
    },
    healthIdText: {
      fontSize: wp("6%"),
      fontWeight: "700",
      color: theme.healthPrimary,
      marginTop: hp("2%"),
      letterSpacing: 1.5,
    },
    
    infoRow: {
      flexDirection: "row",
      paddingVertical: hp("1.2%"),
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    infoLabel: {
      fontSize: wp("4%"),
      fontWeight: "600",
      color: theme.textSecondary,
      flex: 1,
    },
    infoValue: {
      fontSize: wp("4%"),
      color: theme.text,
      flex: 2,
      fontWeight: "500",
    },
    
    timelineContainer: {
      paddingVertical: hp("1%"),
    },
    timelineItem: {
      flexDirection: "row",
      marginVertical: hp("1%"),
    },
    timelineDot: {
      width: wp("3%"),
      height: wp("3%"),
      borderRadius: wp("1.5%"),
      backgroundColor: theme.primary,
      marginTop: hp("0.8%"),
      marginRight: wp("3%"),
    },
    timelineLine: {
      position: "absolute",
      left: wp("1.5%"),
      top: hp("3%"),
      width: 2,
      height: "90%",
      backgroundColor: theme.border,
    },
    timelineContent: {
      flex: 1,
      backgroundColor: theme.card,
      borderRadius: wp("3%"),
      padding: wp("4%"),
      marginBottom: hp("1%"),
      borderWidth: 1,
      borderColor: theme.border,
    },
    timelineDate: {
      fontSize: wp("3.2%"),
      color: theme.textSecondary,
      fontWeight: "600",
      marginBottom: hp("0.5%"),
    },
    timelineTitle: {
      fontSize: wp("4.5%"),
      fontWeight: "700",
      color: theme.text,
      marginBottom: hp("0.5%"),
    },
    timelineDescription: {
      fontSize: wp("3.8%"),
      color: theme.textSecondary,
      lineHeight: wp("5.5%"),
    },
    
    badge: {
      paddingHorizontal: wp("3%"),
      paddingVertical: hp("0.5%"),
      borderRadius: wp("4%"),
      alignSelf: "flex-start",
    },
    badgeText: {
      fontSize: wp("3%"),
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    emergencyBadge: {
      backgroundColor: theme.emergencyRed + "20",
    },
    emergencyBadgeText: {
      color: theme.emergencyRed,
    },
    
    button: {
      backgroundColor: theme.primary,
      paddingVertical: hp("1.8%"),
      paddingHorizontal: wp("6%"),
      borderRadius: wp("3%"),
      alignItems: "center",
      justifyContent: "center",
      marginVertical: hp("1%"),
      shadowColor: theme.primary,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    buttonText: {
      fontSize: wp("4%"),
      fontWeight: "700",
      color: "#ffffff",
      letterSpacing: 0.5,
    },
    secondaryButton: {
      backgroundColor: "transparent",
      borderWidth: 2,
      borderColor: theme.primary,
    },
    secondaryButtonText: {
      color: theme.primary,
    },
    
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: hp("8%"),
    },
    emptyStateIcon: {
      marginBottom: hp("2%"),
    },
    emptyStateText: {
      fontSize: wp("4.5%"),
      fontWeight: "600",
      color: theme.textSecondary,
      textAlign: "center",
      marginBottom: hp("1%"),
    },
    emptyStateSubtext: {
      fontSize: wp("3.5%"),
      color: theme.textSecondary,
      textAlign: "center",
      paddingHorizontal: wp("10%"),
    },
    
    input: {
      backgroundColor: theme.inputBackground,
      borderWidth: 2,
      borderColor: theme.border,
      borderRadius: wp("3%"),
      paddingVertical: hp("1.5%"),
      paddingHorizontal: wp("4%"),
      fontSize: wp("4%"),
      color: theme.text,
      marginBottom: hp("2%"),
    },
    inputFocused: {
      borderColor: theme.primary,
    },
    textArea: {
      minHeight: hp("12%"),
      textAlignVertical: "top",
    },
    
    statsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginVertical: hp("2%"),
    },
    statCard: {
      width: "48%",
      backgroundColor: theme.card,
      borderRadius: wp("3%"),
      padding: wp("4%"),
      marginRight: "4%",
      marginBottom: hp("2%"),
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: "center",
    },
    statValue: {
      fontSize: wp("8%"),
      fontWeight: "700",
      color: theme.primary,
      marginBottom: hp("0.5%"),
    },
    statLabel: {
      fontSize: wp("3.5%"),
      color: theme.textSecondary,
      textAlign: "center",
    },
    
    emergencyCard: {
      backgroundColor: theme.emergencyRed + "10",
      borderColor: theme.emergencyRed,
      borderWidth: 2,
    },
    emergencyButton: {
      backgroundColor: theme.emergencyRed,
    },
    
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: hp("3%"),
      marginBottom: hp("2%"),
      paddingHorizontal: wp("2%"),
    },
    sectionTitle: {
      fontSize: wp("5.5%"),
      fontWeight: "700",
      color: theme.text,
    },
    sectionAction: {
      fontSize: wp("4%"),
      color: theme.primary,
      fontWeight: "600",
    },

    // ---- Form field styles (used in HealthID creation form) ----
    inputContainer: {
      marginBottom: hp("1.5%"),
    },
    label: {
      fontSize: wp("3.8%"),
      fontWeight: "600",
      color: theme.text,
      marginBottom: hp("0.7%"),
    },
    switchRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: hp("1.2%"),
      marginBottom: hp("0.5%"),
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    switchLabel: {
      fontSize: wp("4%"),
      color: theme.text,
      fontWeight: "500",
      flex: 1,
    },
  });

const healthStyles = createHealthStyles(lightTheme);
export default healthStyles;
