import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { TextInput, TextInputProps, TouchableOpacity, View, Animated } from 'react-native';
import authStyles from '../../../constants/styles/authStyles';

interface PasswordInputProps extends TextInputProps {
  style?: any;
  hasError?: boolean;
}

export function PasswordInput({ style, hasError, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={authStyles.passwordContainer}>
      <TextInput
        {...props}
        style={[
          authStyles.passwordInput,
          isFocused && authStyles.inputFocused,
          hasError && authStyles.inputError,
          style
        ]}
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
        style={authStyles.eyeButton}
        onPress={() => setShowPassword(prev => !prev)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Feather
          name={showPassword ? 'eye' : 'eye-off'}
          size={20}
          color={isFocused ? "#3b82f6" : "#6b7280"}
        />
      </TouchableOpacity>
    </View>
  );
}
