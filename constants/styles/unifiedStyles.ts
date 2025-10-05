import { StyleSheet, Dimensions, Platform, PixelRatio } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const scale = SCREEN_WIDTH / 375;

export function normalize(size: number): number {
  const newSize = size * scale;
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

export const createUnifiedStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },

    scrollContent: {
      padding: 20,
      paddingBottom: 140,
    },

    card: {
      backgroundColor: theme.card,
      borderRadius: 20,
      padding: 24,
      marginBottom: 24,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
      borderWidth: 1,
      borderColor: theme.border + "40",
      width: "100%",
    },

    sectionCard: {
      backgroundColor: theme.background,
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme.border + "30",
    },

    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.card,
      padding: 20,
      borderRadius: 16,
      marginBottom: 20,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
      borderWidth: 1,
      borderColor: theme.border + "50",
    },

    backButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.background,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },

    headerIconContainer: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: theme.primary + "20",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },

    headerTextContainer: {
      flex: 1,
    },

    headerTitle: {
      fontSize: normalize(18),
      fontWeight: "700",
      color: theme.text,
      letterSpacing: 0.2,
      lineHeight: normalize(22),
    },

    headerSubtitle: {
      fontSize: normalize(15),
      color: theme.textSecondary,
      marginTop: 4,
      fontWeight: "500",
      lineHeight: normalize(20),
    },

    statusBadge: {
      backgroundColor: theme.success + "20",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.success + "40",
      justifyContent: "center",
      alignItems: "center",
      minWidth: 80,
    },

    statusText: {
      fontSize: normalize(13),
      color: theme.success,
      fontWeight: "700",
      letterSpacing: 0.5,
    },

    sectionContainer: {
      backgroundColor: theme.card,
      borderRadius: 20,
      padding: 28,
      marginBottom: 28,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 6,
      borderWidth: 1,
      borderColor: theme.border + "40",
    },

    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
      paddingBottom: 8,
      borderBottomWidth: 2,
      borderBottomColor: theme.primary + "30",
    },

    sectionIconContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.primary + "20",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },

    sectionTitle: {
      fontSize: normalize(20),
      fontWeight: "700",
      color: theme.text,
      letterSpacing: 0.2,
      lineHeight: normalize(24),
    },

    subSectionTitle: {
      fontSize: normalize(17),
      fontWeight: "600",
      color: theme.text,
      marginTop: 20,
      marginBottom: 16,
      letterSpacing: 0.1,
      lineHeight: normalize(22),
    },

    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border + "25",
      minHeight: 44,
    },

    lastInfoRow: {
      borderBottomWidth: 0,
    },

    labelText: {
      fontSize: normalize(15),
      color: theme.textSecondary,
      fontWeight: "500",
      flex: 1,
      lineHeight: normalize(20),
      letterSpacing: 0.1,
    },

    valueText: {
      fontSize: normalize(15),
      color: theme.text,
      fontWeight: "600",
      flex: 1.5,
      textAlign: "right",
      lineHeight: normalize(20),
      letterSpacing: 0.1,
    },

    inputContainer: {
      marginBottom: 24,
    },

    label: {
      fontSize: normalize(16),
      color: theme.text,
      fontWeight: "600",
      marginBottom: 12,
      letterSpacing: 0.1,
      lineHeight: normalize(20),
    },

    input: {
      backgroundColor: theme.inputBackground,
      borderRadius: 12,
      padding: 18,
      fontSize: normalize(16),
      borderWidth: 2,
      borderColor: theme.border,
      color: theme.text,
      lineHeight: normalize(20),
      minHeight: 56,
    },

    inputDisabled: {
      backgroundColor: theme.textSecondary + "20",
      color: theme.textSecondary,
    },

    textArea: {
      backgroundColor: theme.inputBackground,
      borderRadius: 12,
      padding: 18,
      fontSize: normalize(16),
      borderWidth: 2,
      borderColor: theme.border,
      color: theme.text,
      minHeight: 120,
      textAlignVertical: "top",
      lineHeight: normalize(22),
    },

    row: {
      flexDirection: "row",
    },

    switchRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 8,
      marginBottom: 12,
      minHeight: 44,
    },

    switchLabel: {
      fontSize: normalize(16),
      color: theme.text,
      fontWeight: "500",
      flex: 1,
      marginRight: 16,
      lineHeight: normalize(22),
    },

    locationButtonContainer: {
      marginTop: 8,
    },

    locationButton: {
      backgroundColor: theme.primary,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 12,
      marginBottom: 12,
    },

    locationButtonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: normalize(16),
      marginLeft: 8,
      textAlign: "center",
    },

    locationText: {
      fontSize: normalize(14),
      color: theme.textSecondary,
      textAlign: "center",
      marginBottom: 12,
    },

    coordinatesContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.success + "15",
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.success + "30",
    },

    coordinatesText: {
      fontSize: normalize(14),
      color: theme.success,
      marginLeft: 8,
      fontWeight: "500",
    },

    agreementCard: {
      backgroundColor: theme.background,
      padding: 20,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: theme.border + "40",
      marginBottom: 20,
    },

    agreementHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },

    agreementIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },

    agreementTitle: {
      fontSize: normalize(18),
      fontWeight: "700",
      color: theme.text,
      marginBottom: 4,
    },

    agreementSubtitle: {
      fontSize: normalize(14),
      color: theme.textSecondary,
    },

    consentCard: {
      backgroundColor: theme.background,
      padding: 20,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: theme.border + "40",
    },

    consentHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },

    consentIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },

    consentTitle: {
      fontSize: normalize(18),
      fontWeight: "700",
      color: theme.text,
      marginBottom: 4,
    },

    consentSubtitle: {
      fontSize: normalize(14),
      color: theme.textSecondary,
    },

    consentToggle: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 8,
    },

    consentText: {
      fontSize: normalize(16),
      fontWeight: "600",
      color: theme.text,
      flex: 1,
      marginRight: 12,
    },

    termsButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.primary + "15",
      padding: 16,
      borderRadius: 12,
      marginBottom: 16,
    },

    termsButtonText: {
      marginLeft: 12,
      color: theme.primary,
      fontWeight: "600",
      fontSize: normalize(15),
      flex: 1,
    },

    termsSubText: {
      color: theme.textSecondary,
      fontSize: normalize(13),
      fontStyle: "italic",
    },

    successMessage: {
      backgroundColor: theme.success + "15",
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.success + "30",
      flexDirection: "row",
      alignItems: "center",
      marginTop: 16,
    },

    successTitle: {
      color: theme.success,
      fontWeight: "700",
      fontSize: normalize(16),
      marginBottom: 4,
    },

    successSubtitle: {
      color: theme.success,
      fontSize: normalize(14),
      opacity: 0.8,
    },

    button: {
      marginTop: 24,
      paddingVertical: 18,
      borderRadius: 16,
      alignItems: "center",
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },

    buttonEnabled: {
      backgroundColor: theme.primary,
    },

    buttonDisabled: {
      backgroundColor: theme.textSecondary,
    },

    buttonText: {
      color: "#fff",
      fontWeight: "700",
      fontSize: normalize(18),
      letterSpacing: 0.5,
    },

    submitButton: {
      backgroundColor: theme.primary,
      paddingVertical: 18,
      paddingHorizontal: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 32,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
      minHeight: 56,
    },

    submitButtonDisabled: {
      backgroundColor: theme.textSecondary,
      shadowColor: "transparent",
      shadowOpacity: 0,
      elevation: 0,
    },

    submitButtonText: {
      color: "#fff",
      fontSize: normalize(18),
      fontWeight: "700",
      letterSpacing: 0.8,
      lineHeight: normalize(22),
    },

    submitButtonContainer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.background,
      paddingHorizontal: 20,
      paddingVertical: 16,
      paddingBottom: 34,
      borderTopWidth: 1,
      borderTopColor: theme.border + "50",
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
    },

    actionsContainer: {
      marginTop: 8,
    },

    actionButton: {
      backgroundColor: theme.card,
      borderRadius: 16,
      marginBottom: 16,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
      elevation: 4,
    },

    actionButtonContent: {
      flexDirection: "row",
      alignItems: "center",
      padding: 20,
    },

    actionIconContainer: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },

    actionTextContainer: {
      flex: 1,
    },

    actionTitle: {
      fontSize: normalize(17),
      fontWeight: "600",
      color: theme.text,
      marginBottom: 4,
      letterSpacing: 0.1,
      lineHeight: normalize(22),
    },

    actionSubtitle: {
      fontSize: normalize(14),
      color: theme.textSecondary,
      fontWeight: "500",
      lineHeight: normalize(18),
    },

    updateButton: {
      borderWidth: 1,
      borderColor: theme.primary + "30",
    },

    requestButton: {
      borderWidth: 1,
      borderColor: theme.success + "30",
    },

    promptContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
      backgroundColor: theme.background,
    },

    promptIconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.primary + "15",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 24,
    },

    promptTitle: {
      fontSize: normalize(24),
      fontWeight: "700",
      color: theme.text,
      marginBottom: 8,
      textAlign: "center",
    },

    promptSubtitle: {
      fontSize: normalize(16),
      color: theme.textSecondary,
      textAlign: "center",
      lineHeight: 24,
      marginBottom: 32,
    },

    benefitsList: {
      alignSelf: "stretch",
      marginBottom: 32,
    },

    benefitItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },

    benefitText: {
      fontSize: normalize(14),
      color: theme.text,
      marginLeft: 12,
      flex: 1,
    },

    registerButton: {
      backgroundColor: theme.primary,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 16,
      paddingHorizontal: 32,
      borderRadius: 12,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },

    registerButtonText: {
      color: "#fff",
      fontSize: normalize(16),
      fontWeight: "700",
      marginLeft: 8,
    },

    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background,
      padding: 40,
    },

    loadingText: {
      fontSize: normalize(16),
      color: theme.textSecondary,
      marginTop: 20,
      fontWeight: "500",
      textAlign: "center",
      lineHeight: normalize(22),
    },

    eligibilityText: {
      fontSize: normalize(14),
      fontWeight: "600",
      marginBottom: 12,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      textAlign: "center",
    },

    eligibleText: {
      color: theme.success,
      backgroundColor: theme.success + "20",
    },

    ineligibleText: {
      color: theme.error,
      backgroundColor: theme.error + "20",
    },
    matchButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.primary + "15",
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      marginTop: 12,
      borderWidth: 1,
      borderColor: theme.primary + "30",
    },

    matchButtonText: {
      color: theme.primary,
      fontSize: normalize(14),
      fontWeight: "600",
      marginLeft: 8,
      letterSpacing: 0.1,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 20,
      width: "90%",
      maxHeight: "80%",
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: theme.text,
    },
    locationItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 16,
      paddingHorizontal: 4,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    locationAddress: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.text,
      marginBottom: 4,
    },
    locationDetails: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    emptyText: {
      textAlign: "center",
      color: theme.textSecondary,
      fontSize: 16,
      marginVertical: 20,
    },
    addNewButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 16,
      borderTopWidth: 1,
      borderTopColor: theme.border,
      marginTop: 10,
    },
    addNewText: {
      marginLeft: 8,
      fontSize: 16,
      fontWeight: "500",
      color: theme.primary,
    },
    addForm: {
      gap: 12,
    },
    buttonRow: {
      flexDirection: "row",
      gap: 12,
      marginTop: 16,
    },
    cancelButton: {
      backgroundColor: theme.border,
    },
    cancelButtonText: {
      color: theme.text,
      fontWeight: "500",
    },
    saveButton: {
      backgroundColor: theme.primary,
    },
    saveButtonText: {
      color: "white",
      fontWeight: "500",
    },
    inputText: {
      flex: 1,
      fontSize: 16,
      color: theme.text,
    },

    locationStatus: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      backgroundColor: theme.primary + "15",
      borderRadius: 8,
      marginBottom: 16,
    },
    locationStatusText: {
      marginLeft: 8,
      color: theme.primary,
      fontSize: 14,
      fontWeight: "500",
    },
    locationError: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      backgroundColor: theme.error + "15",
      borderRadius: 8,
      marginBottom: 16,
    },
    locationErrorText: {
      marginLeft: 8,
      color: theme.error,
      fontSize: 14,
      flex: 1,
    },
    locationSelector: {
      flexDirection: "row",
      alignItems: "center",
    },

    locationSelectorContent: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    selectedLocationItem: {
      backgroundColor: theme.primary + "10",
      borderRadius: 8,
      marginVertical: 2,
      paddingHorizontal: 8,
      borderWidth: 1,
      borderColor: theme.primary + "30",
    },

    locationItemContent: {
      flex: 1,
    },

    emptyContainer: {
      alignItems: "center",
      paddingVertical: 40,
    },

    emptySubtext: {
      fontSize: normalize(14),
      color: theme.textSecondary,
      marginTop: 4,
      textAlign: "center",
      lineHeight: normalize(18),
    },

    addFormTitle: {
      fontSize: normalize(18),
      fontWeight: "600",
      color: theme.text,
      marginBottom: 16,
      letterSpacing: 0.1,
    },

    cardBackground: {
      backgroundColor: theme.card,
    },

    text: {
      fontSize: normalize(15),
      color: theme.text,
      fontWeight: "400",
      lineHeight: normalize(20),
    },
  });
