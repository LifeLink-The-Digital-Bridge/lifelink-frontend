import { StyleSheet } from "react-native";

export const createSearchBarStyles = (theme: any) =>
  StyleSheet.create({
    searchContainer: {
      flex: 1,
      flexDirection: "row",
      backgroundColor: theme.card,
      borderRadius: 10,
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 10,
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
      marginLeft: 8,
      fontSize: 16,
      color: theme.textSecondary,
    },

    modalContainer: {
      flex: 1,
      backgroundColor: theme.background,
    },

    searchHeader: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 12,
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },

    backButton: {
      marginRight: 12,
    },

    searchInputContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.background,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: theme.border,
    },

    searchInput: {
      flex: 1,
      fontSize: 16,
      color: theme.text,
      marginLeft: 8,
      marginRight: 8,
    },

    centerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 40,
    },

    emptyTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: theme.text,
      marginTop: 16,
      marginBottom: 8,
    },

    emptyDescription: {
      fontSize: 15,
      color: theme.textSecondary,
      textAlign: "center",
      lineHeight: 22,
    },

    emptyText: {
      fontSize: 15,
      color: theme.textSecondary,
      textAlign: "center",
      marginTop: 10,
    },

    resultsList: {
      paddingVertical: 8,
    },

    resultItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      backgroundColor: theme.card,
      marginHorizontal: 12,
      marginVertical: 4,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },

    resultAvatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 12,
    },

    resultAvatarPlaceholder: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.background,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },

    resultInfo: {
      flex: 1,
    },

    resultUsername: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.text,
      marginBottom: 4,
    },

    resultEmail: {
      fontSize: 14,
      color: theme.textSecondary,
    },
  });
