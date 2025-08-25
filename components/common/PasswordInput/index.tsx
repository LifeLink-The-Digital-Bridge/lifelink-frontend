import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles } from './styles';

interface PasswordInputProps extends TextInputProps {
  style?: any;
}

export function PasswordInput({ style, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <TextInput
        {...props}
        style={[styles.input, style]}
        secureTextEntry={!showPassword}
      />
      <TouchableOpacity
        style={styles.eyeButton}
        onPress={() => setShowPassword(prev => !prev)}
      >
        <Feather
          name={showPassword ? 'eye' : 'eye-off'}
          size={22}
          color="#636e72"
        />
      </TouchableOpacity>
    </View>
  );
}
