import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

export const createProfileStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },

    profileSection: {
      backgroundColor: theme.card,
      paddingHorizontal: wp("5%"),
      paddingTop: hp("2.5%"),
      paddingBottom: hp("2.5%"),
      borderTopLeftRadius: wp("4%"),
      borderTopRightRadius: wp("4%"),
      marginHorizontal: wp("3%"),
      marginTop: hp("1.5%"),
    },

    profileTopRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: hp("2.5%"),
    },

    profileImageWrapper: {
      marginRight: wp("5%"),
    },

    profileImage: {
      width: wp("22.5%"),
      height: wp("22.5%"),
      borderRadius: wp("11.25%"),
      borderWidth: 3,
      borderColor: theme.primary,
    },

    profileImagePlaceholder: {
      width: wp("22.5%"),
      height: wp("22.5%"),
      borderRadius: wp("11.25%"),
      borderWidth: 3,
      borderColor: theme.border,
      backgroundColor: theme.background,
      justifyContent: "center",
      alignItems: "center",
    },

    profileInfo: {
      flex: 1,
      justifyContent: "flex-start",
      paddingTop: hp("0.5%"),
      paddingRight: wp("2%"),
    },

    username: {
      fontSize: wp("5.5%"),
      fontWeight: "700",
      color: theme.text,
      marginBottom: hp("0.5%"),
    },

    handle: {
      fontSize: wp("3.5%"),
      color: theme.textSecondary,
      marginBottom: hp("1.5%"),
    },

    infoItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: hp("0.75%"),
    },

    infoText: {
      fontSize: wp("3.25%"),
      color: theme.textSecondary,
      marginLeft: wp("2%"),
      flex: 1,
    },

    settingsButton: {
      width: wp("10%"),
      height: wp("10%"),
      borderRadius: wp("5%"),
      backgroundColor: theme.background,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.border,
      marginLeft: wp("2%"),
    },

    metaRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: hp("1%"),
    },

    metaItem: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: wp("5%"),
    },

    metaText: {
      fontSize: wp("3.5%"),
      color: theme.textSecondary,
      marginLeft: wp("1.5%"),
    },

    statsRow: {
      flexDirection: "row",
      paddingTop: hp("2%"),
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },

    statItem: {
      flex: 1,
      alignItems: "center",
    },

    statValue: {
      fontSize: wp("4.5%"),
      fontWeight: "700",
      color: theme.text,
      marginBottom: hp("0.25%"),
    },

    statLabel: {
      fontSize: wp("3.25%"),
      color: theme.textSecondary,
    },

    actionsContainer: {
      flexDirection: "row",
      paddingHorizontal: wp("5%"),
      paddingVertical: hp("2%"),
      backgroundColor: theme.card,
      gap: wp("3%"),
      marginHorizontal: wp("3%"),
    },

    actionButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: hp("1.25%"),
      paddingHorizontal: wp("4%"),
      borderRadius: wp("5%"),
      borderWidth: 1,
    },

    primaryButton: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },

    secondaryButton: {
      backgroundColor: "transparent",
      borderColor: theme.border,
    },

    dangerButton: {
      backgroundColor: "transparent",
      borderColor: theme.error,
    },

    buttonText: {
      fontSize: wp("3.75%"),
      fontWeight: "600",
      marginLeft: wp("1.5%"),
    },

    primaryButtonText: {
      color: "#fff",
    },

    secondaryButtonText: {
      color: theme.text,
    },

    dangerButtonText: {
      color: theme.error,
    },

    tabsContainer: {
      flexDirection: "row",
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      marginHorizontal: wp("3%"),
      overflow: "hidden",
    },

    tab: {
      flex: 1,
      paddingVertical: hp("2%"),
      alignItems: "center",
      borderBottomWidth: 3,
      borderBottomColor: "transparent",
    },

    activeTab: {
      borderBottomColor: theme.primary,
    },

    tabText: {
      fontSize: wp("3.75%"),
      fontWeight: "600",
      color: theme.textSecondary,
    },

    activeTabText: {
      color: theme.primary,
    },

    contentContainer: {
      padding: wp("4%"),
      paddingTop: 0,
      backgroundColor: theme.card,
      marginHorizontal: wp("3%"),
      borderBottomLeftRadius: wp("4%"),
      borderBottomRightRadius: wp("4%"),
      marginBottom: hp("1.5%"),
    },

    viewAllButton: {
      backgroundColor: theme.primary + "15",
      borderColor: theme.primary,
      marginTop: hp("0.5%"),
      marginBottom: hp("0.5%"),
    },

    viewAllButtonText: {
      color: theme.primary,
      fontWeight: "700",
    },

    card: {
      backgroundColor: theme.primary + "08",
      borderRadius: wp("3%"),
      padding: wp("4%"),
      marginBottom: hp("1.5%"),
      marginTop: hp("1.5%"),
      borderWidth: 1,
      borderColor: theme.border + "60",
    },

    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: hp("1.5%"),
    },

    cardTitle: {
      fontSize: wp("4.25%"),
      fontWeight: "600",
      color: theme.text,
    },

    badge: {
      paddingHorizontal: wp("2.5%"),
      paddingVertical: hp("0.5%"),
      borderRadius: wp("2%"),
    },

    badgeText: {
      fontSize: wp("3%"),
      fontWeight: "600",
    },

    cardDetail: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: hp("1%"),
    },

    detailLabel: {
      fontSize: wp("3.5%"),
      color: theme.textSecondary,
      marginLeft: wp("2%"),
      flex: 1,
    },

    detailValue: {
      fontSize: wp("3.5%"),
      fontWeight: "500",
      color: theme.text,
    },

    emptyState: {
      padding: wp("10%"),
      alignItems: "center",
      backgroundColor: theme.card,
      marginHorizontal: wp("3%"),
      borderBottomLeftRadius: wp("4%"),
      borderBottomRightRadius: wp("4%"),
      marginBottom: hp("1.5%"),
    },

    emptyIcon: {
      marginBottom: hp("2%"),
    },

    emptyTitle: {
      fontSize: wp("4.5%"),
      fontWeight: "600",
      color: theme.text,
      marginBottom: hp("1%"),
      textAlign: "center",
    },

    emptyDescription: {
      fontSize: wp("3.75%"),
      color: theme.textSecondary,
      textAlign: "center",
      marginBottom: hp("3%"),
      paddingHorizontal: wp("5%"),
    },

    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },

    modalContent: {
      backgroundColor: theme.card,
      borderTopLeftRadius: wp("5%"),
      borderTopRightRadius: wp("5%"),
      paddingTop: hp("1%"),
      paddingBottom: hp("4%"),
    },

    modalHandle: {
      width: wp("10%"),
      height: hp("0.5%"),
      backgroundColor: theme.border,
      borderRadius: wp("0.5%"),
      alignSelf: "center",
      marginBottom: hp("2.5%"),
    },

    modalTitle: {
      fontSize: wp("6%"),
      fontWeight: "700",
      color: theme.text,
      marginBottom: hp("3%"),
      paddingHorizontal: wp("5%"),
    },

    modalSection: {
      marginBottom: hp("3%"),
    },

    modalSectionTitle: {
      fontSize: wp("3.25%"),
      fontWeight: "600",
      color: theme.textSecondary,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      paddingHorizontal: wp("5%"),
      marginBottom: hp("1.5%"),
    },

    themeOption: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: wp("5%"),
      paddingVertical: hp("2%"),
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },

    logoutOption: {
      borderBottomWidth: 0,
    },

    themeOptionLeft: {
      flexDirection: "row",
      alignItems: "center",
    },

    themeOptionIcon: {
      width: wp("10%"),
      height: wp("10%"),
      borderRadius: wp("5%"),
      backgroundColor: theme.background,
      justifyContent: "center",
      alignItems: "center",
      marginRight: wp("3%"),
    },

    themeOptionText: {
      fontSize: wp("4%"),
      color: theme.text,
      fontWeight: "500",
    },

    imageViewerOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.95)",
      justifyContent: "center",
      alignItems: "center",
    },

    imageViewerCloseButton: {
      position: "absolute",
      top: hp("6.25%"),
      right: wp("5%"),
      width: wp("11%"),
      height: wp("11%"),
      borderRadius: wp("5.5%"),
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 10,
    },

    imageViewerContainer: {
      width: wp("100%"),
      height: hp("100%"),
      justifyContent: "center",
      alignItems: "center",
    },

    fullscreenImage: {
      width: wp("100%"),
      height: wp("100%"),
    },
  });
