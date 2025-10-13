import { Tabs } from "expo-router/tabs";
import { useAuth } from '../../utils/auth-context';
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
  const { tabBarTranslateY } = useTabBar();
  const insets = useSafeAreaInsets();

  if (isLoading) return null;
  if (!isAuthenticated) return <Redirect href="/(auth)/loginScreen" />;
  
  const tabBarHeight = Platform.OS === 'ios' 
    ? 60 + insets.bottom 
    : 60 + Math.max(insets.bottom, 0);
  
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
          height: 60,
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
          title: "Home",
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
                name="home" 
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
          title: "Donate",
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
        name="receive"
        options={{
          title: "Request",
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
                name="medical-services" 
                size={focused ? 24 : 20} 
                color={color}
              />
            </View>
          ),
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
