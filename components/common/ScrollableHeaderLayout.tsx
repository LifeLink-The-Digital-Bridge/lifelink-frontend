import React from "react";
import { View, StyleSheet, Platform, StatusBar as RNStatusBar } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../../utils/theme-context";
import { lightTheme, darkTheme } from "../../constants/styles/authStyles";

interface ScrollableHeaderLayoutProps {
  children: React.ReactNode;
}

const ScrollableHeaderLayout = ({ children }: ScrollableHeaderLayoutProps) => {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar 
        style={isDark ? "light" : "dark"} 
        backgroundColor={theme.background}
        translucent={false}
      />
      {children}
    </View>
  );
};

export default ScrollableHeaderLayout;
