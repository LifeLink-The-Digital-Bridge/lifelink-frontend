import { StyleSheet } from 'react-native';

export const createProfileTopBarStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingTop: 60,
      paddingBottom: 16,
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },

    backButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },

    title: {
      flex: 1,
      fontSize: 20,
      fontWeight: '700',
      color: theme.text,
      marginLeft: 12,
    },

    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },

    actionButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.card,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.border,
    },
  });
