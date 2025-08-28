import { StyleSheet, ViewStyle, TextStyle } from "react-native";

export const createDonateHubStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    } as ViewStyle,

    scrollContent: {
      padding: 16, 
      paddingTop: 8, 
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
      borderColor: theme.border + '40',
    } as ViewStyle,

    sectionTitle: {
      fontWeight: '700',
      fontSize: 18,
      color: theme.text,
      marginTop: 20,
      marginBottom: 12,
      letterSpacing: 0.5,
    } as TextStyle,

    detailText: {
      fontSize: 15,
      color: theme.text,
      marginBottom: 6,
      lineHeight: 22,
    } as TextStyle,

    labelText: {
      fontWeight: '700',
      color: theme.text,
      fontSize: 15,
    } as TextStyle,

    valueText: {
      fontWeight: '500',
      color: theme.textSecondary,
      fontSize: 15,
    } as TextStyle,

    button: {
      paddingVertical: 18,
      paddingHorizontal: 24,
      borderRadius: 16,
      alignItems: 'center',
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

    registerButton: {
      backgroundColor: '#0984e3',
    } as ViewStyle,

    updateButton: {
      backgroundColor: '#00b894',
    } as ViewStyle,

    buttonText: {
      color: '#fff',
      fontWeight: '700',
      fontSize: 17,
      letterSpacing: 0.8,
    } as TextStyle,

    notRegisteredText: {
      fontSize: 18,
      color: theme.text,
      marginBottom: 20,
      textAlign: 'center',
    } as TextStyle,
  });
