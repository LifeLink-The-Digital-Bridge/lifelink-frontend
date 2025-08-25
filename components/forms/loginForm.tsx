import React from 'react';
import { View, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { useForm } from '../../hooks/useForm';
import { useAuth } from '../../utils/auth-context';
import { PasswordInput } from '../common/PasswordInput';
import { LoadingButton } from '../common/LoadingButton';
import { ValidationMessage } from './validationMessage';
import { loginUser } from "../../app/api/loginApi";
import { validateField, validationRules } from '../../utils/validation';
import { getLoginType } from '../../utils/helpers';
import { styles } from './styles';

interface LoginFormData {
  identifier: string;
  password: string;
}

export function LoginForm() {
  const { values, errors, setValue, setError } = useForm<LoginFormData>({
    identifier: '',
    password: '',
  });
  
  const [loading, setLoading] = React.useState(false);
  const { setIsAuthenticated } = useAuth();

  const validateForm = (): boolean => {
    let isValid = true;

    if (!values.identifier) {
      setError('identifier', 'Username or email is required');
      isValid = false;
    }

    const passwordError = validateField(values.password, validationRules.password, 'Password');
    if (passwordError) {
      setError('password', passwordError);
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const loginType = getLoginType(values.identifier);
      const response = await loginUser({
        loginType,
        identifier: values.identifier,
        password: values.password,
      });

      setIsAuthenticated(true);
      Alert.alert('Login Successful', `Welcome, ${response.username}`);
      router.push('/(tabs)');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username or Email"
        autoCapitalize="none"
        value={values.identifier}
        onChangeText={(text) => setValue('identifier', text)}
      />
      <ValidationMessage error={errors.identifier} />

      <PasswordInput
        style={styles.input}
        placeholder="Password"
        value={values.password}
        onChangeText={(text) => setValue('password', text)}
      />
      <ValidationMessage error={errors.password} />

      <LoadingButton
        title="Login"
        onPress={handleLogin}
        loading={loading}
      />
    </View>
  );
}
