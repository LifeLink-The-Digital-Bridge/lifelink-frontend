import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme, createAuthStyles } from '../../constants/styles/authStyles';

export function ThemeToggle() {
  const { theme, isDark, setTheme } = useTheme();
  const currentTheme = isDark ? darkTheme : lightTheme;
  const styles = createAuthStyles(currentTheme);

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <TouchableOpacity 
      style={styles.themeToggle} 
      onPress={toggleTheme}
      activeOpacity={0.7}
    >
      <Feather 
        name={isDark ? 'sun' : 'moon'} 
        size={20} 
        color={currentTheme.text} 
      />
    </TouchableOpacity>
  );
}
