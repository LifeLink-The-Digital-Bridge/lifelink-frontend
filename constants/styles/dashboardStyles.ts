import { StyleSheet } from "react-native";

export const createDashboardStyles = (theme: any) => StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.background, 
    padding: 18 
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.background,
  },
  
  loadingText: {
    marginTop: 10,
    color: theme.textSecondary,
    fontSize: 16,
  },
  
  welcomeText: {
    fontSize: 22,
    color: theme.primary,
    marginBottom: 4,
    marginTop: 8,
  },
  
  subText: {
    fontSize: 16,
    color: theme.textSecondary,
    marginBottom: 18,
  },
  
  chatBotIcon: {
    position: "absolute",
    bottom: 40,
    right: 20,
    zIndex: 999,
  },
  
  chatBotButton: {
    backgroundColor: theme.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
