import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export interface RegistrationPromptProps {
  iconName: keyof typeof Feather.glyphMap;
  title: string;
  subtitle: string;
  benefits: string[];
  buttonText: string;
  buttonIcon: keyof typeof Feather.glyphMap;
  navigationRoute: string;
}

export function RegistrationPrompt({
  iconName,
  title,
  subtitle,
  benefits,
  buttonText,
  buttonIcon,
  navigationRoute,
}: RegistrationPromptProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const styles = StyleSheet.create({
    scrollContainer: {
      flex: 1,
      backgroundColor: theme.background,
    },
    contentContainer: {
      flexGrow: 1,
      padding: wp('5%'),
      paddingTop: hp('5%'),
      paddingBottom: hp('20%') + insets.bottom,
    },
    card: {
      backgroundColor: theme.card,
      borderRadius: wp('5%'),
      padding: wp('8%'),
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
      borderWidth: 1,
      borderColor: theme.border,
      marginTop: hp('8%'),
    },
    iconContainer: {
      width: wp('20%'),
      height: wp('20%'),
      borderRadius: wp('10%'),
      backgroundColor: theme.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: hp('3%'),
      alignSelf: 'center',
    },
    title: {
      fontSize: wp('5.5%'),
      fontWeight: '700',
      color: theme.text,
      textAlign: 'center',
      marginBottom: hp('2%'),
    },
    subtitle: {
      fontSize: wp('4%'),
      color: theme.textSecondary,
      textAlign: 'center',
      marginBottom: hp('4%'),
      lineHeight: wp('6%'),
    },
    benefitsList: {
      marginBottom: hp('4%'),
    },
    benefitItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: hp('2%'),
    },
    benefitText: {
      fontSize: wp('3.75%'),
      color: theme.text,
      marginLeft: wp('3%'),
      flex: 1,
      lineHeight: wp('5.5%'),
    },
    registerButton: {
      backgroundColor: theme.primary,
      paddingVertical: hp('2%'),
      paddingHorizontal: wp('8%'),
      borderRadius: wp('3%'),
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
      minHeight: hp('6.5%'),
    },
    buttonText: {
      color: '#fff',
      fontSize: wp('4.5%'),
      fontWeight: '700',
      letterSpacing: 0.5,
      marginLeft: wp('2%'),
    },
  });

  return (
    <ScrollView 
      style={styles.scrollContainer}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={true}
      bounces={true}
      alwaysBounceVertical={true}
    >
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Feather name={iconName} size={wp('10%')} color={theme.primary} />
        </View>
        
        <Text style={styles.title}>{title}</Text>
        
        <Text style={styles.subtitle}>{subtitle}</Text>
        
        <View style={styles.benefitsList}>
          {benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <Feather name="check-circle" size={wp('4%')} color={theme.success} />
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>
        
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => router.push(navigationRoute as any)}
          activeOpacity={0.8}
        >
          <Feather name={buttonIcon} size={wp('5%')} color="#fff" />
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
