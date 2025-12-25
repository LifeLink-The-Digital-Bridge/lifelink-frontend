import { StyleSheet } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "../../utils/responsive";

export const createUnifiedStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },

    scrollContent: {
      padding: wp("5%"),
      paddingBottom: hp("17.5%"),
    },

    card: {
      backgroundColor: theme.card,
      borderRadius: wp("5%"),
      padding: wp("6%"),
      marginBottom: hp("3%"),
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
      borderRadius: wp("4%"),
      padding: wp("5%"),
      marginBottom: hp("2.5%"),
      borderWidth: 1,
      borderColor: theme.border + "30",
    },

    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.card,
      padding: wp("5%"),
      borderRadius: wp("4%"),
      marginBottom: hp("2.5%"),
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
      borderWidth: 1,
      borderColor: theme.border + "50",
    },

    backButton: {
      width: wp("9%"),
      height: wp("9%"),
      borderRadius: wp("4.5%"),
      backgroundColor: theme.background,
      justifyContent: "center",
      alignItems: "center",
      marginRight: wp("3%"),
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },

    headerIconContainer: {
      width: wp("13%"),
      height: wp("13%"),
      borderRadius: wp("6.5%"),
      backgroundColor: theme.primary + "20",
      justifyContent: "center",
      alignItems: "center",
      marginRight: wp("4%"),
    },

    headerTextContainer: {
      flex: 1,
    },

    headerTitle: {
      fontSize: wp("4.5%"),
      fontWeight: "700",
      color: theme.text,
      letterSpacing: 0.2,
      lineHeight: wp("5.5%"),
    },

    headerSubtitle: {
      fontSize: wp("3.75%"),
      color: theme.textSecondary,
      marginTop: hp("0.5%"),
      fontWeight: "500",
      lineHeight: wp("5%"),
    },

    statusBadge: {
      backgroundColor: theme.success + "20",
      paddingHorizontal: wp("4%"),
      paddingVertical: hp("1%"),
      borderRadius: wp("4%"),
      borderWidth: 1,
      borderColor: theme.success + "40",
      justifyContent: "center",
      alignItems: "center",
      minWidth: wp("20%"),
    },

    statusText: {
      fontSize: wp("3.25%"),
      color: theme.success,
      fontWeight: "700",
      letterSpacing: 0.5,
    },

    sectionContainer: {
      backgroundColor: theme.card,
      borderRadius: wp("5%"),
      padding: wp("7%"),
      marginBottom: hp("3.5%"),
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
      marginBottom: hp("2.5%"),
      paddingBottom: hp("1%"),
      borderBottomWidth: 2,
      borderBottomColor: theme.primary + "30",
    },

    sectionIconContainer: {
      width: wp("8%"),
      height: wp("8%"),
      borderRadius: wp("4%"),
      backgroundColor: theme.primary + "20",
      justifyContent: "center",
      alignItems: "center",
      marginRight: wp("3%"),
    },

    sectionTitle: {
      fontSize: wp("5%"),
      fontWeight: "700",
      color: theme.text,
      letterSpacing: 0.2,
      lineHeight: wp("6%"),
    },

    subSectionTitle: {
      fontSize: wp("4.25%"),
      fontWeight: "600",
      color: theme.text,
      marginTop: hp("2.5%"),
      marginBottom: hp("2%"),
      letterSpacing: 0.1,
      lineHeight: wp("5.5%"),
    },

    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      paddingVertical: hp("1.5%"),
      borderBottomWidth: 1,
      borderBottomColor: theme.border + "25",
      minHeight: hp("5.5%"),
    },

    lastInfoRow: {
      borderBottomWidth: 0,
    },

    labelText: {
      fontSize: wp("3.75%"),
      color: theme.textSecondary,
      fontWeight: "500",
      flex: 1,
      lineHeight: wp("5%"),
      letterSpacing: 0.1,
    },

    valueText: {
      fontSize: wp("3.75%"),
      color: theme.text,
      fontWeight: "600",
      flex: 1.5,
      textAlign: "right",
      lineHeight: wp("5%"),
      letterSpacing: 0.1,
    },

    inputContainer: {
      marginBottom: hp("3%"),
    },

    label: {
      fontSize: wp("4%"),
      color: theme.text,
      fontWeight: "600",
      marginBottom: hp("1.5%"),
      letterSpacing: 0.1,
      lineHeight: wp("5%"),
    },

    input: {
      backgroundColor: theme.inputBackground,
      borderRadius: wp("3%"),
      padding: wp("4.5%"),
      fontSize: wp("4%"),
      borderWidth: 2,
      borderColor: theme.border,
      color: theme.text,
      lineHeight: wp("5%"),
      minHeight: hp("7%"),
    },

    inputDisabled: {
      backgroundColor: theme.textSecondary + "20",
      color: theme.textSecondary,
    },

    textArea: {
      backgroundColor: theme.inputBackground,
      borderRadius: wp("3%"),
      padding: wp("4.5%"),
      fontSize: wp("4%"),
      borderWidth: 2,
      borderColor: theme.border,
      color: theme.text,
      minHeight: hp("15%"),
      textAlignVertical: "top",
      lineHeight: wp("5.5%"),
    },

    switchRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: hp("1%"),
      marginBottom: hp("1.5%"),
      minHeight: hp("5.5%"),
    },

    switchLabel: {
      fontSize: wp("4%"),
      color: theme.text,
      fontWeight: "500",
      flex: 1,
      marginRight: wp("4%"),
      lineHeight: wp("5.5%"),
    },

    locationButtonContainer: {
      marginTop: hp("1%"),
    },

    locationButton: {
      backgroundColor: theme.primary,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: hp("1.5%"),
      color: theme.textSecondary,
      textAlign: "center",
      marginBottom: hp("1.5%"),
    },

    locationButtonText: {
      color: "#fff",
      fontSize: wp("4%"),
      fontWeight: "600",
      marginLeft: wp("2%"),
    },

    coordinatesContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.success + "15",
      padding: wp("3%"),
      borderRadius: wp("2%"),
      borderWidth: 1,
      borderColor: theme.success + "30",
    },

    coordinatesText: {
      fontSize: wp("3.5%"),
      color: theme.success,
      marginLeft: wp("2%"),
      fontWeight: "500",
    },

    agreementCard: {
      backgroundColor: theme.background,
      padding: wp("5%"),
      borderRadius: wp("4%"),
      borderWidth: 2,
      borderColor: theme.border + "40",
      marginBottom: hp("2.5%"),
    },

    agreementHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: hp("2%"),
    },

    agreementIcon: {
      width: wp("10%"),
      height: wp("10%"),
      borderRadius: wp("5%"),
      justifyContent: "center",
      alignItems: "center",
      marginRight: wp("3%"),
    },

    agreementTitle: {
      fontSize: wp("4.5%"),
      fontWeight: "700",
      color: theme.text,
      marginBottom: hp("0.5%"),
    },

    agreementSubtitle: {
      fontSize: wp("3.5%"),
      color: theme.textSecondary,
    },

    consentCard: {
      backgroundColor: theme.background,
      padding: wp("5%"),
      borderRadius: wp("4%"),
      borderWidth: 2,
      borderColor: theme.border + "40",
    },

    consentHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: hp("2%"),
    },

    consentIcon: {
      width: wp("10%"),
      height: wp("10%"),
      borderRadius: wp("5%"),
      justifyContent: "center",
      alignItems: "center",
      marginRight: wp("3%"),
    },

    consentTitle: {
      fontSize: wp("4.5%"),
      fontWeight: "700",
      color: theme.text,
      marginBottom: hp("0.5%"),
    },

    consentSubtitle: {
      fontSize: wp("3.5%"),
      color: theme.textSecondary,
    },

    consentToggle: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: hp("1%"),
    },

    consentText: {
      fontSize: wp("4%"),
      fontWeight: "600",
      color: theme.text,
      flex: 1,
      marginRight: wp("3%"),
    },

    termsButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.primary + "15",
      padding: wp("4%"),
      borderRadius: wp("3%"),
      marginBottom: hp("2%"),
    },

    termsButtonText: {
      marginLeft: wp("3%"),
      color: theme.primary,
      fontWeight: "600",
      fontSize: wp("3.75%"),
      flex: 1,
    },

    termsSubText: {
      color: theme.textSecondary,
      fontSize: wp("3.25%"),
      fontStyle: "italic",
    },

    successMessage: {
      backgroundColor: theme.success + "15",
      padding: wp("4%"),
      borderRadius: wp("3%"),
      borderWidth: 1,
      borderColor: theme.success + "30",
      flexDirection: "row",
      alignItems: "center",
      marginTop: hp("2%"),
    },

    successTitle: {
      color: theme.success,
      fontWeight: "700",
      fontSize: wp("4%"),
      marginBottom: hp("0.5%"),
    },

    successSubtitle: {
      color: theme.success,
      fontSize: wp("3.5%"),
      opacity: 0.8,
    },

    button: {
      marginTop: hp("3%"),
      paddingVertical: hp("2.25%"),
      borderRadius: wp("4%"),
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
      fontSize: wp("4.5%"),
      letterSpacing: 0.5,
    },

    submitButton: {
      backgroundColor: theme.primary,
      paddingVertical: hp("2.25%"),
      paddingHorizontal: wp("8%"),
      borderRadius: wp("4%"),
      alignItems: "center",
      justifyContent: "center",
      marginTop: hp("4%"),
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
      minHeight: hp("7%"),
    },

    submitButtonDisabled: {
      backgroundColor: theme.textSecondary,
      shadowColor: "transparent",
      shadowOpacity: 0,
      elevation: 0,
    },

    submitButtonText: {
      color: "#fff",
      fontSize: wp("4.5%"),
      fontWeight: "700",
      letterSpacing: 0.8,
      lineHeight: wp("5.5%"),
    },

    submitButtonContainer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.background,
      paddingHorizontal: wp("5%"),
      paddingVertical: hp("2%"),
      paddingBottom: hp("4.25%"),
      borderTopWidth: 1,
      borderTopColor: theme.border + "50",
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
    },

    actionsContainer: {
      marginTop: hp("1%"),
    },

    actionButton: {
      backgroundColor: theme.card,
      borderRadius: wp("4%"),
      marginBottom: hp("2%"),
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
      elevation: 4,
    },

    actionButtonContent: {
      flexDirection: "row",
      alignItems: "center",
      padding: wp("5%"),
    },

    actionIconContainer: {
      width: wp("11%"),
      height: wp("11%"),
      borderRadius: wp("5.5%"),
      justifyContent: "center",
      alignItems: "center",
      marginRight: wp("4%"),
    },

    actionTextContainer: {
      flex: 1,
    },

    actionTitle: {
      fontSize: wp("4.25%"),
      fontWeight: "600",
      color: theme.text,
      marginBottom: hp("0.5%"),
      letterSpacing: 0.1,
      lineHeight: wp("5.5%"),
    },

    actionSubtitle: {
      fontSize: wp("3.5%"),
      color: theme.textSecondary,
      fontWeight: "500",
      lineHeight: wp("4.5%"),
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
      padding: wp("6%"),
      backgroundColor: theme.background,
    },

    promptIconContainer: {
      width: wp("20%"),
      height: wp("20%"),
      borderRadius: wp("10%"),
      backgroundColor: theme.primary + "15",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: hp("3%"),
    },

    promptTitle: {
      fontSize: wp("6%"),
      fontWeight: "700",
      color: theme.text,
      marginBottom: hp("1%"),
      textAlign: "center",
    },

    promptSubtitle: {
      fontSize: wp("4%"),
      color: theme.textSecondary,
      textAlign: "center",
      lineHeight: hp("3%"),
      marginBottom: hp("4%"),
    },

    benefitsList: {
      alignSelf: "stretch",
      marginBottom: hp("4%"),
    },

    benefitItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: hp("1.5%"),
    },

    benefitText: {
      fontSize: wp("3.5%"),
      color: theme.text,
      marginLeft: wp("3%"),
      flex: 1,
    },

    registerButton: {
      backgroundColor: theme.primary,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: hp("2%"),
      paddingHorizontal: wp("8%"),
      borderRadius: wp("3%"),
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },

    registerButtonText: {
      color: "#fff",
      fontSize: wp("4%"),
      fontWeight: "700",
      marginLeft: wp("2%"),
    },

    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background,
      padding: wp("10%"),
    },

    loadingText: {
      fontSize: wp("4%"),
      color: theme.textSecondary,
      marginTop: hp("2.5%"),
      fontWeight: "500",
      textAlign: "center",
      lineHeight: wp("5.5%"),
    },

    eligibilityText: {
      fontSize: wp("3.5%"),
      fontWeight: "600",
      marginBottom: hp("1.5%"),
      paddingHorizontal: wp("3%"),
      paddingVertical: hp("1%"),
      borderRadius: wp("2%"),
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
      paddingVertical: hp("1%"),
      paddingHorizontal: wp("3%"),
      borderRadius: wp("2%"),
      marginTop: hp("1.5%"),
      borderWidth: 1,
      borderColor: theme.primary + "30",
    },

    matchButtonText: {
      color: theme.primary,
      fontSize: wp("3.5%"),
      fontWeight: "600",
      marginLeft: wp("2%"),
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
      borderRadius: wp("4%"),
      padding: wp("5%"),
      width: "90%",
      maxHeight: "80%",
    },

    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: hp("2.5%"),
    },

    modalTitle: {
      fontSize: wp("5%"),
      fontWeight: "600",
      color: theme.text,
    },

    locationItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: hp("2%"),
      paddingHorizontal: wp("1%"),
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },

    locationAddress: {
      fontSize: wp("4%"),
      fontWeight: "500",
      color: theme.text,
      marginBottom: hp("0.5%"),
    },

    locationDetails: {
      fontSize: wp("3.5%"),
      color: theme.textSecondary,
    },

    emptyText: {
      textAlign: "center",
      color: theme.textSecondary,
      fontSize: wp("4%"),
      marginVertical: hp("2.5%"),
    },

    addNewButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: hp("2%"),
      borderTopWidth: 1,
      borderTopColor: theme.border,
      marginTop: hp("1.25%"),
    },

    addNewText: {
      marginLeft: wp("2%"),
      fontSize: wp("4%"),
      fontWeight: "500",
      color: theme.primary,
    },

    addForm: {
      gap: hp("1.5%"),
    },

    buttonRow: {
      flexDirection: "row",
      gap: wp("3%"),
      marginTop: hp("2%"),
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
      fontSize: wp("4%"),
      color: theme.text,
    },

    locationStatus: {
      flexDirection: "row",
      alignItems: "center",
      padding: wp("3%"),
      backgroundColor: theme.primary + "15",
      borderRadius: wp("2%"),
      marginBottom: hp("2%"),
    },

    locationStatusText: {
      marginLeft: wp("2%"),
      color: theme.primary,
      fontSize: wp("3.5%"),
      fontWeight: "500",
    },

    locationError: {
      flexDirection: "row",
      alignItems: "center",
      padding: wp("3%"),
      backgroundColor: theme.error + "15",
      borderRadius: wp("2%"),
      marginBottom: hp("2%"),
    },

    locationErrorText: {
      marginLeft: wp("2%"),
      color: theme.error,
      fontSize: wp("3.5%"),
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
      borderRadius: wp("2%"),
      marginVertical: hp("0.25%"),
      paddingHorizontal: wp("2%"),
      borderWidth: 1,
      borderColor: theme.primary + "30",
    },

    locationItemContent: {
      flex: 1,
    },

    emptyContainer: {
      alignItems: "center",
      paddingVertical: hp("5%"),
    },

    emptySubtext: {
      fontSize: wp("3.5%"),
      color: theme.textSecondary,
      marginTop: hp("0.5%"),
      textAlign: "center",
      lineHeight: wp("4.5%"),
    },

    addFormTitle: {
      fontSize: wp("4.5%"),
      fontWeight: "600",
      color: theme.text,
      marginBottom: hp("2%"),
      letterSpacing: 0.1,
    },

    cardBackground: {
      backgroundColor: theme.card,
    },

    text: {
      fontSize: wp("3.75%"),
      color: theme.text,
      fontWeight: "400",
      lineHeight: wp("5%"),
    },

    row: {
      flexDirection: "row",
      marginHorizontal: -wp(1.5),
    },

    halfWidthContainer: {
      flex: 1,
      paddingHorizontal: wp(1.5),
      marginBottom: hp(3),
    },

    infoLabel: {
      fontSize: wp("3.75%"),
      color: theme.textSecondary,
      fontWeight: "500",
      marginBottom: hp("0.5%"),
      letterSpacing: 0.1,
      lineHeight: wp("5%"),
    },

    infoValue: {
      fontSize: wp("4%"),
      color: theme.text,
      fontWeight: "600",
      letterSpacing: 0.1,
      lineHeight: wp("5.5%"),
    },

  });
