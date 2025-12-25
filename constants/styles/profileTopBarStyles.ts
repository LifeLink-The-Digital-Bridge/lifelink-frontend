import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../utils/responsive';

export const createProfileTopBarStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: wp("4%"),
      paddingTop: hp("7.5%"),
      paddingBottom: hp("2%"),
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },

    backButton: {
      width: wp("10%"),
      height: wp("10%"),
      justifyContent: "center",
      alignItems: "center",
    },

    title: {
      flex: 1,
      fontSize: wp("5%"),
      fontWeight: "700",
      color: theme.text,
      marginLeft: wp("3%"),
    },

    actions: {
      flexDirection: "row",
      alignItems: "center",
      gap: wp("2%"),
    },

    actionButton: {
      width: wp("10%"),
      height: wp("10%"),
      borderRadius: wp("5%"),
      backgroundColor: theme.card,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.border,
    },
  });
