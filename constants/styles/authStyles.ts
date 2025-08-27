import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

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
  shadow: "#000",
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
  shadow: "#000",
};

export const createAuthStyles = (theme: typeof lightTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: 24,
    },

    scrollContainer: {
      flexGrow: 1,
      justifyContent: "center",
      paddingVertical: 40,
    },

    headerContainer: {
      alignItems: "center",
      marginBottom: 40,
    },

    title: {
      fontSize: 32,
      fontWeight: "700",
      color: theme.text,
      textAlign: "center",
      marginBottom: 8,
    },

    subtitle: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: "center",
    },

    inputContainer: {
      marginBottom: 20,
    },

    input: {
      backgroundColor: theme.inputBackground,
      borderColor: theme.border,
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 16,
      fontSize: 16,
      color: theme.text,
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },

    inputFocused: {
      borderColor: theme.primary,
      shadowColor: theme.primary,
      shadowOpacity: 0.15,
    },

    inputError: {
      borderColor: theme.error,
    },

    passwordContainer: {
      position: "relative",
    },

    passwordInput: {
      backgroundColor: theme.card,
      borderWidth: 2,
      borderColor: theme.border,
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 16,
      paddingRight: 52,
      fontSize: 16,
      color: theme.text,
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },

    eyeButton: {
      position: "absolute",
      right: 16,
      top: "50%",
      marginTop: -12,
      padding: 4,
      borderRadius: 6,
    },

    button: {
      backgroundColor: theme.primary,
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginVertical: 12,
      minHeight: 52,
      shadowColor: theme.primary,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },

    primary: {
      backgroundColor: theme.primary,
    },

    secondary: {
      backgroundColor: "transparent",
      borderWidth: 2,
      borderColor: theme.primary,
      shadowOpacity: 0,
      elevation: 0,
    },

    disabled: {
      backgroundColor: theme.textSecondary,
      shadowOpacity: 0,
      elevation: 0,
    },

    buttonText: {
      fontSize: 16,
      fontWeight: "600",
      textAlign: "center",
      letterSpacing: 0.5,
    },

    primaryText: {
      color: "#ffffff",
    },

    secondaryText: {
      color: theme.primary,
    },

    linkContainer: {
      alignItems: "center",
      marginTop: 24,
    },

    linkText: {
      color: theme.primary,
      fontSize: 16,
      fontWeight: "500",
    },

    errorContainer: {
      marginTop: 4,
      marginBottom: 8,
    },

    errorText: {
      color: theme.error,
      fontSize: 14,
      fontWeight: "500",
    },

    successContainer: {
      marginTop: 4,
      marginBottom: 8,
    },

    successText: {
      color: theme.success,
      fontSize: 14,
      fontWeight: "500",
    },

    imagePicker: {
      backgroundColor: theme.primary,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
      shadowColor: theme.primary,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 2,
      flexDirection: "row",
      minHeight: 44,
    },

    imagePickerText: {
      color: "#ffffff",
      fontSize: 15,
      fontWeight: "600",
      marginLeft: 6,
    },

    profileImageContainer: {
      alignItems: "center",
      marginTop: 16,
      marginBottom: 20,
    },

    profileImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 4,
      borderColor: theme.primary,
      marginTop: 12,
    },


    formSection: {
      marginBottom: 24,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.text,
      marginBottom: 16,
    },

    themeToggle: {
      position: "absolute",
      top: 50,
      right: 20,
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.card,
      borderWidth: 2,
      borderColor: theme.border,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      zIndex: 1000,
    },
  });

const authStyles = createAuthStyles(lightTheme);
export default authStyles;
