import { Tabs } from "expo-router/tabs";
import { useAuth } from '../../utils/auth-context';
import { useRole } from '../../utils/role-context';
import { MaterialIcons, Feather, FontAwesome5 } from "@expo/vector-icons";
import { Redirect } from "expo-router";
import { useTheme } from "../../utils/theme-context";
import { TabBarProvider, useTabBar } from "../../utils/tabbar-context";
import { lightTheme, darkTheme } from "../../constants/styles/authStyles";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function TabsContent() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const { isAuthenticated, isLoading } = useAuth();
  const { isMigrant, isDoctor, isNGO, isAdmin, isLoading: roleLoading } = useRole();
  const { tabBarTranslateY } = useTabBar();
  const insets = useSafeAreaInsets();

  if (isLoading || roleLoading) return null;
  if (!isAuthenticated) return <Redirect href="/(auth)/loginScreen" />;
  
  const tabBarHeight = Platform.OS === 'ios' 
    ? 56 + insets.bottom 
    : 56 + Math.max(insets.bottom, 0);
  const showMigrantTabs = isMigrant && !isDoctor && !isNGO && !isAdmin;
  const showDoctorTabs = isDoctor && !isAdmin;
  const showNgoTabs = isNGO && !isAdmin;
  const showDefaultDonationTabs = !isMigrant && !isDoctor && !isNGO && !isAdmin;
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: theme.card,
          height: tabBarHeight,
          paddingBottom: insets.bottom,
          paddingTop: 8,
          paddingHorizontal: 8,
          borderTopWidth: 0,
          borderWidth: 0,
          borderTopColor: 'transparent',
          borderColor: 'transparent',
          shadowColor: theme.shadow,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: isDark ? 0.25 : 0.1,
          shadowRadius: 12,
          elevation: 8,
          transform: [{ translateY: tabBarTranslateY }],
        },
        tabBarItemStyle: {
          height: 56,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 12,
          marginHorizontal: 4,
          paddingVertical: 3,
        },
        tabBarLabelStyle: { 
          fontWeight: "600", 
          fontSize: 10,
          marginTop: 2,
          letterSpacing: 0.2,
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
        headerShown: false,
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,
      }}
    >
        <Tabs.Screen
        name="index"
        options={{
          title: isAdmin ? "Admin" : isDoctor ? "Patients" : isNGO ? "Services" : isMigrant ? "Health" : "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: focused ? theme.primary + '15' : 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 2,
            }}>
              <MaterialIcons 
                name={isAdmin ? "admin-panel-settings" : isDoctor ? "people" : isNGO ? "groups" : isMigrant ? "favorite" : "home"} 
                size={focused ? 26 : 22} 
                color={color}
              />
            </View>
          ),
        }}
      />
      
      <Tabs.Screen
        name="health-id"
        options={{
          href: showMigrantTabs ? undefined : null,
          title: "Health ID",
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: focused ? theme.primary + '15' : 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 2,
            }}>
              <MaterialIcons 
                name="qr-code-2" 
                size={focused ? 26 : 22} 
                color={color}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="records"
        options={{
          href: showMigrantTabs ? undefined : null,
          title: "Records",
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: focused ? theme.primary + '15' : 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 2,
            }}>
              <MaterialIcons 
                name="assignment" 
                size={focused ? 26 : 22} 
                color={color}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="donate"
        options={{
          href: showDefaultDonationTabs ? undefined : null,
          title: "Donate",
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: focused ? theme.primary + '15' : 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 2,
            }}>
              <FontAwesome5 
                name="hand-holding-heart" 
                size={focused ? 20 : 18} 
                color={color}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="maps"
        options={{
          title: "Maps",
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: focused ? theme.primary + '15' : 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 2,
            }}>
              <MaterialIcons 
                name="location-on" 
                size={focused ? 26 : 22} 
                color={color}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="patients"
        options={{
          href: showDoctorTabs ? undefined : null,
          title: "Patients",
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: focused ? theme.primary + '15' : 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 2,
            }}>
              <MaterialIcons
                name="badge"
                size={focused ? 24 : 20}
                color={color}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="support"
        options={{
          href: showNgoTabs ? undefined : null,
          title: "Support",
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: focused ? theme.primary + '15' : 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 2,
            }}>
              <MaterialIcons
                name="volunteer-activism"
                size={focused ? 24 : 20}
                color={color}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="receive"
        options={{
          href: showDefaultDonationTabs ? undefined : null,
          title: "Request",
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: focused ? theme.primary + '15' : 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 2,
            }}>
              <MaterialIcons 
                name="medical-services" 
                size={focused ? 24 : 20} 
                color={color}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="emergency"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: focused ? theme.primary + '15' : 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 2,
            }}>
              <Feather 
                name="user" 
                size={focused ? 24 : 20} 
                color={color}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

export default function TabsLayout() {
  return (
    <TabBarProvider>
      <TabsContent />
    </TabBarProvider>
  );
}
