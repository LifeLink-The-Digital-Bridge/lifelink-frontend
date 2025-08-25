import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { styles } from './styles';

interface LoadingButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
}

export function LoadingButton({ 
  title, 
  loading = false, 
  variant = 'primary',
  disabled,
  ...props 
}: LoadingButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      {...props}
      style={[
        styles.button,
        styles[variant],
        isDisabled && styles.disabled,
        props.style,
      ]}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={[styles.buttonText, styles[`${variant}Text`]]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
