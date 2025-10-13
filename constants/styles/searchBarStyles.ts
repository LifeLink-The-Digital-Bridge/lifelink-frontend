import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

export const createSearchBarStyles = (theme: any) =>
  StyleSheet.create({
    searchContainer: {
      flex: 1,
      flexDirection: "row",
      backgroundColor: theme.card,
      borderRadius: wp("2.5%"),
      alignItems: "center",
      paddingHorizontal: wp("3%"),
      paddingVertical: hp("1.25%"),
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },

    searchPlaceholder: {
      flex: 1,
      marginLeft: wp("2%"),
      fontSize: wp("4%"),
      color: theme.textSecondary,
    },

    modalContainer: {
      flex: 1,
      backgroundColor: theme.background,
    },

    searchHeader: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: wp("4%"),
      paddingTop: hp("2.5%"),
      paddingBottom: hp("1.5%"),
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },

    backButton: {
      marginRight: wp("3%"),
    },

    searchInputContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.background,
      borderRadius: wp("2.5%"),
      paddingHorizontal: wp("3%"),
      paddingVertical: hp("1.25%"),
      borderWidth: 1,
      borderColor: theme.border,
    },

    searchInput: {
      flex: 1,
      fontSize: wp("4%"),
      color: theme.text,
      marginLeft: wp("2%"),
      marginRight: wp("2%"),
    },

    centerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: wp("10%"),
    },

    emptyTitle: {
      fontSize: wp("5%"),
      fontWeight: "600",
      color: theme.text,
      marginTop: hp("2%"),
      marginBottom: hp("1%"),
    },

    emptyDescription: {
      fontSize: wp("3.75%"),
      color: theme.textSecondary,
      textAlign: "center",
      lineHeight: hp("2.75%"),
    },

    emptyText: {
      fontSize: wp("3.75%"),
      color: theme.textSecondary,
      textAlign: "center",
      marginTop: hp("1.25%"),
    },

    resultsList: {
      paddingVertical: hp("1%"),
    },

    resultItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: wp("4%"),
      backgroundColor: theme.card,
      marginHorizontal: wp("3%"),
      marginVertical: hp("0.5%"),
      borderRadius: wp("3%"),
      borderWidth: 1,
      borderColor: theme.border,
    },

    resultAvatar: {
      width: wp("12.5%"),
      height: wp("12.5%"),
      borderRadius: wp("6.25%"),
      marginRight: wp("3%"),
    },

    resultAvatarPlaceholder: {
      width: wp("12.5%"),
      height: wp("12.5%"),
      borderRadius: wp("6.25%"),
      backgroundColor: theme.background,
      justifyContent: "center",
      alignItems: "center",
      marginRight: wp("3%"),
      borderWidth: 1,
      borderColor: theme.border,
    },

    resultInfo: {
      flex: 1,
    },

    resultUsername: {
      fontSize: wp("4%"),
      fontWeight: "600",
      color: theme.text,
      marginBottom: hp("0.5%"),
    },

    resultEmail: {
      fontSize: wp("3.5%"),
      color: theme.textSecondary,
    },
  });
