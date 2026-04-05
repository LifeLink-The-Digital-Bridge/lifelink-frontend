import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import authStyles from '../../../constants/styles/authStyles';

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
        authStyles.button,
        authStyles[variant],
        isDisabled && authStyles.disabled,
        props.style,
      ]}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'primary' ? "#fff" : "#3b82f6"} 
          size="small"
        />
      ) : (
        <Text style={[authStyles.buttonText, authStyles[`${variant}Text`]]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
