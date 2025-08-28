import { Tabs } from "expo-router/tabs";
import { useAuth } from '../../utils/auth-context';
import { MaterialIcons, Feather, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { Redirect } from "expo-router";
import { useTheme } from "../../utils/theme-context";
import { lightTheme, darkTheme } from "../../constants/styles/authStyles";
import { Platform, View } from "react-native";

export default function TabsLayout() {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;
  if (!isAuthenticated) return <Redirect href="/(auth)/loginScreen" />;
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.card,
          height: Platform.OS === 'ios' ? 88 : 85,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
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
        },
        tabBarItemStyle: {
          height: Platform.OS === 'ios' ? 60 : 60,
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
                size={focused ? 20 : 21} 
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
                size={focused ? 24 : 26} 
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
                size={focused ? 22 : 26} 
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
                size={focused ? 22 : 26} 
                color={color}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
