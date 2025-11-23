import { StyleSheet } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

export const createNotificationStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: wp("4.5%"),
        paddingVertical: hp("2%"),
        backgroundColor: theme.card,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
    },

    headerTitle: {
        fontSize: wp("5%"),
        fontWeight: "700",
        color: theme.text,
    },

    markAllButton: {
        backgroundColor: theme.primary + "20",
        paddingVertical: hp("1%"),
        paddingHorizontal: wp("3%"),
        borderRadius: wp("2%"),
    },

    markAllText: {
        color: theme.primary,
        fontSize: wp("3.5%"),
        fontWeight: "600",
    },

    tabContainer: {
        flexDirection: "row",
        backgroundColor: theme.card,
        paddingHorizontal: wp("4.5%"),
        paddingTop: hp("1%"),
        paddingBottom: hp("1.5%"),
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
    },

    tab: {
        paddingVertical: hp("1%"),
        paddingHorizontal: wp("4%"),
        marginRight: wp("2%"),
        borderRadius: wp("5%"),
    },

    activeTab: {
        backgroundColor: theme.primary,
    },

    inactiveTab: {
        backgroundColor: theme.primary + "20",
    },

    tabText: {
        fontSize: wp("3.75%"),
        fontWeight: "600",
    },

    activeTabText: {
        color: "#fff",
    },

    inactiveTabText: {
        color: theme.primary,
    },

    // Notification Item Styles
    notificationItem: {
        backgroundColor: theme.card,
        marginHorizontal: wp("4.5%"),
        marginVertical: hp("0.75%"),
        borderRadius: wp("3%"),
        padding: wp("4%"),
        shadowColor: theme.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },

    unreadItem: {
        backgroundColor: theme.primary + "08",
        borderLeftWidth: 4,
        borderLeftColor: theme.primary,
    },

    notificationHeader: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: hp("1%"),
    },

    iconContainer: {
        width: wp("10%"),
        height: wp("10%"),
        borderRadius: wp("5%"),
        justifyContent: "center",
        alignItems: "center",
        marginRight: wp("3%"),
    },

    notificationContent: {
        flex: 1,
    },

    notificationTitle: {
        fontSize: wp("4%"),
        fontWeight: "700",
        color: theme.text,
        marginBottom: hp("0.5%"),
    },

    notificationMessage: {
        fontSize: wp("3.5%"),
        color: theme.textSecondary,
        lineHeight: wp("5%"),
    },

    notificationFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: hp("1%"),
    },

    timestamp: {
        fontSize: wp("3%"),
        color: theme.textSecondary,
    },

    unreadDot: {
        width: wp("2%"),
        height: wp("2%"),
        borderRadius: wp("1%"),
        backgroundColor: theme.primary,
    },

    actionButtons: {
        flexDirection: "row",
        gap: wp("2%"),
    },

    actionButton: {
        padding: wp("2%"),
        borderRadius: wp("1.5%"),
        backgroundColor: theme.primary + "15",
    },

    // Badge Styles
    badge: {
        position: "absolute",
        top: -5,
        right: -5,
        backgroundColor: "#FF3B30",
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 5,
        borderWidth: 2,
        borderColor: theme.card,
    },

    badgeText: {
        color: "#fff",
        fontSize: wp("2.75%"),
        fontWeight: "700",
    },

    // Empty State Styles
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: hp("10%"),
    },

    emptyIcon: {
        marginBottom: hp("2%"),
    },

    emptyTitle: {
        fontSize: wp("5%"),
        fontWeight: "700",
        color: theme.text,
        marginBottom: hp("1%"),
    },

    emptyMessage: {
        fontSize: wp("3.75%"),
        color: theme.textSecondary,
        textAlign: "center",
        paddingHorizontal: wp("10%"),
    },

    // Loading Styles
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: hp("10%"),
    },

    loadingText: {
        marginTop: hp("2%"),
        fontSize: wp("3.75%"),
        color: theme.textSecondary,
    },

    // Section Header Styles
    sectionHeader: {
        backgroundColor: theme.background,
        paddingHorizontal: wp("4.5%"),
        paddingVertical: hp("1%"),
    },

    sectionHeaderText: {
        fontSize: wp("3.5%"),
        fontWeight: "600",
        color: theme.textSecondary,
        textTransform: "uppercase",
    },

    // Connection Status
    connectionStatus: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: wp("4.5%"),
        paddingVertical: hp("1%"),
        backgroundColor: theme.card,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
    },

    connectionDot: {
        width: wp("2%"),
        height: wp("2%"),
        borderRadius: wp("1%"),
        marginRight: wp("2%"),
    },

    connectedDot: {
        backgroundColor: "#34C759",
    },

    disconnectedDot: {
        backgroundColor: "#FF9500",
    },

    connectionText: {
        fontSize: wp("3%"),
        color: theme.textSecondary,
    },
});
