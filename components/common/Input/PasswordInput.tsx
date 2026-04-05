import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../utils/theme-context';
import { lightTheme, darkTheme, createAuthStyles } from '../../../constants/styles/authStyles';

interface PasswordInputProps extends TextInputProps {
  style?: any;
  hasError?: boolean;
}

export function PasswordInput({ style, hasError, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createAuthStyles(theme);

  return (
    <View style={styles.passwordContainer}>
      <TextInput
        {...props}
        style={[
          styles.passwordInput,
          isFocused && styles.inputFocused,
          hasError && styles.inputError,
          style,
        ]}
        placeholderTextColor={theme.textSecondary}
        secureTextEntry={!showPassword}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
      />
      <TouchableOpacity
        style={styles.eyeButton}
        onPress={() => setShowPassword((prev) => !prev)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Feather
          name={showPassword ? 'eye' : 'eye-off'}
          size={20}
          color={isFocused ? theme.primary : theme.textSecondary}
        />
      </TouchableOpacity>
    </View>
  );
}
