import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ScrollableHeaderLayout from '../../components/common/ScrollableHeaderLayout';

const RaiseFund = () => {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: wp('5%'),
      paddingTop: hp('6%'),
      paddingBottom: hp('2%'),
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.border + '40',
    },
    backButton: {
      width: wp('10%'),
      height: wp('10%'),
      borderRadius: wp('5%'),
      backgroundColor: theme.primary + '15',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: wp('4%'),
    },
    headerTitle: {
      fontSize: wp('5%'),
      fontWeight: '700',
      color: theme.text,
    },
    contentContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: wp('8%'),
    },
    iconContainer: {
      width: wp('30%'),
      height: wp('30%'),
      borderRadius: wp('15%'),
      backgroundColor: theme.primary + '15',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: hp('4%'),
    },
    title: {
      fontSize: wp('6%'),
      fontWeight: '700',
      color: theme.text,
      marginBottom: hp('2%'),
      textAlign: 'center',
    },
    message: {
      fontSize: wp('4%'),
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: wp('6%'),
      marginBottom: hp('1.5%'),
    },
    subtitle: {
      fontSize: wp('3.5%'),
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: wp('5%'),
      marginBottom: hp('4%'),
    },
    featuresList: {
      width: '100%',
      backgroundColor: theme.card,
      borderRadius: wp('4%'),
      padding: wp('5%'),
      marginBottom: hp('3%'),
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: hp('1.5%'),
    },
    featureIconContainer: {
      width: wp('10%'),
      height: wp('10%'),
      borderRadius: wp('5%'),
      backgroundColor: theme.primary + '15',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: wp('4%'),
    },
    featureText: {
      flex: 1,
      fontSize: wp('3.8%'),
      color: theme.text,
      fontWeight: '500',
    },
    backHomeButton: {
      backgroundColor: theme.primary,
      paddingVertical: hp('2%'),
      paddingHorizontal: wp('10%'),
      borderRadius: wp('3%'),
      width: '100%',
      alignItems: 'center',
    },
    backHomeButtonText: {
      color: '#fff',
      fontSize: wp('4.2%'),
      fontWeight: '700',
    },
    badge: {
      backgroundColor: theme.primary,
      paddingHorizontal: wp('3%'),
      paddingVertical: hp('0.5%'),
      borderRadius: wp('3%'),
      alignSelf: 'center',
      marginBottom: hp('2%'),
    },
    badgeText: {
      color: '#fff',
      fontSize: wp('3%'),
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
  });

  const upcomingFeatures = [
    { icon: 'dollar-sign', text: 'Create fundraising campaigns' },
    { icon: 'users', text: 'Share with your network' },
    { icon: 'shield', text: 'Secure payment processing' },
  ];

  return (
    <ScrollableHeaderLayout>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={wp('5.5%')} color={theme.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Raise Fund</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Coming Soon</Text>
          </View>

          <View style={styles.iconContainer}>
            <Feather name="dollar-sign" size={wp('15%')} color={theme.primary} />
          </View>

          <Text style={styles.title}>Fundraising Feature</Text>
          
          <Text style={styles.message}>
            We're working hard to bring you an amazing fundraising experience!
          </Text>

          <Text style={styles.subtitle}>
            Soon you'll be able to create campaigns and receive support from the community.
          </Text>

          <View style={styles.featuresList}>
            {upcomingFeatures.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={styles.featureIconContainer}>
                  <Feather 
                    name={feature.icon as any} 
                    size={wp('5%')} 
                    color={theme.primary} 
                  />
                </View>
                <Text style={styles.featureText}>{feature.text}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.backHomeButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Text style={styles.backHomeButtonText}>Back to Dashboard</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ScrollableHeaderLayout>
  );
};

export default RaiseFund;
