import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Modal from "react-native-modal";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { BlurView } from 'expo-blur';

interface MenuItem {
  icon: string;
  label: string;
  subtitle: string;
  route: '/navigation/RaiseFund' | '/navigation/statusscreens/StatusScreen' | '/navigation/matchscreens/ManualMatchScreen' | '/navigation/matchscreens/MatchResultsScreen';
  badge?: string;
}

interface MenuSection {
  label: string;
  items: MenuItem[];
}

interface SidebarMenuProps {
  isVisible: boolean;
  onClose: () => void;
}

export function SidebarMenu({ isVisible, onClose }: SidebarMenuProps) {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  const styles = StyleSheet.create({
    sidebarContainer: {
      width: 300,
      height: '100%',
      backgroundColor: theme.background,
      paddingTop: 60,
      borderTopRightRadius: 24,
      borderBottomRightRadius: 24,
      elevation: 20,
      shadowColor: '#000',
      shadowOpacity: 0.5,
      shadowOffset: { width: 8, height: 0 },
      shadowRadius: 20,
    },
    headerSection: {
      paddingHorizontal: 24,
      paddingBottom: 24,
      borderBottomWidth: 1,
      borderBottomColor: theme.border + '40',
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: '800',
      color: theme.text,
      letterSpacing: 0.5,
    },
    headerSubtitle: {
      fontSize: 14,
      color: theme.textSecondary,
      marginTop: 4,
      fontWeight: '500',
    },
    menuScrollView: {
      flex: 1,
      paddingTop: 16,
    },
    menuSection: {
      paddingHorizontal: 16,
    },
    sectionLabel: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 1,
      paddingHorizontal: 12,
      marginBottom: 12,
      marginTop: 8,
    },
    menuItemButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 14,
      marginBottom: 6,
      backgroundColor: 'transparent',
    },
    menuItemButtonActive: {
      backgroundColor: theme.primary + '15',
    },
    menuItemIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: theme.primary + '10',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 14,
    },
    menuItemContent: {
      flex: 1,
    },
    menuItemText: {
      fontSize: 16,
      color: theme.text,
      fontWeight: '600',
      marginBottom: 2,
    },
    menuItemSubtext: {
      fontSize: 12,
      color: theme.textSecondary,
      fontWeight: '400',
    },
    menuItemChevron: {
      marginLeft: 'auto',
    },
    footer: {
      paddingHorizontal: 20,
      paddingBottom: 32,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: theme.border + '40',
    },
    closeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 14,
      backgroundColor: theme.primary + '12',
      borderWidth: 1,
      borderColor: theme.primary + '25',
    },
    closeButtonText: {
      fontSize: 15,
      color: theme.primary,
      marginLeft: 10,
      fontWeight: '700',
    },
    badge: {
      backgroundColor: theme.error,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 10,
      marginLeft: 'auto',
    },
    badgeText: {
      color: '#fff',
      fontSize: 11,
      fontWeight: '700',
    },
  });

  const menuSections: MenuSection[] = [
    {
      label: 'Quick Actions',
      items: [
        { 
          icon: 'dollar-sign', 
          label: 'Raise Fund',
          subtitle: 'Start a fundraiser',
          route: '/navigation/RaiseFund',
          badge: 'New'
        },
        { 
          icon: 'activity', 
          label: 'Activity',
          subtitle: 'View match results',
          route: '/navigation/matchscreens/MatchResultsScreen'
        },
      ]
    },
    {
      label: 'Management',
      items: [
        { 
          icon: 'clipboard', 
          label: 'My Status',
          subtitle: 'Track donations & requests',
          route: '/navigation/statusscreens/StatusScreen'
        },
        { 
          icon: 'link', 
          label: 'Manual Match',
          subtitle: 'Connect manually',
          route: '/navigation/matchscreens/ManualMatchScreen'
        },
      ]
    }
  ];

  const handleMenuItemPress = (route: MenuItem['route']) => {
    onClose();
    setTimeout(() => {
      router.push(route);
    }, 300);
  };

  return (
    <Modal
      isVisible={isVisible}
      animationIn="slideInLeft"
      animationOut="slideOutLeft"
      animationInTiming={400}
      animationOutTiming={350}
      onBackdropPress={onClose}
      backdropOpacity={0.6}
      backdropTransitionInTiming={400}
      backdropTransitionOutTiming={350}
      style={{
        margin: 0,
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}
      useNativeDriver
      hideModalContentWhileAnimating
    >
      <View style={styles.sidebarContainer}>
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>LifeLink</Text>
          <Text style={styles.headerSubtitle}>Connecting Lives, Building Hope</Text>
        </View>

        <ScrollView 
          style={styles.menuScrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.menuSection}>
            {menuSections.map((section, sectionIndex) => (
              <View key={sectionIndex}>
                <Text style={styles.sectionLabel}>{section.label}</Text>
                {section.items.map((item, itemIndex) => (
                  <TouchableOpacity
                    key={itemIndex}
                    style={styles.menuItemButton}
                    onPress={() => handleMenuItemPress(item.route)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.menuItemIconContainer}>
                      <Feather name={item.icon as any} size={20} color={theme.primary} />
                    </View>
                    <View style={styles.menuItemContent}>
                      <Text style={styles.menuItemText}>{item.label}</Text>
                      <Text style={styles.menuItemSubtext}>{item.subtitle}</Text>
                    </View>
                    {item.badge && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{item.badge}</Text>
                      </View>
                    )}
                    <Feather 
                      name="chevron-right" 
                      size={18} 
                      color={theme.textSecondary} 
                      style={styles.menuItemChevron}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Feather name="x" size={20} color={theme.primary} />
            <Text style={styles.closeButtonText}>Close Menu</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
