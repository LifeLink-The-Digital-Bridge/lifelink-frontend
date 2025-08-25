import { Tabs } from "expo-router/tabs";
import { useAuth } from '../../utils/auth-context';
import { MaterialIcons, Feather, Ionicons } from "@expo/vector-icons";
import { Redirect } from "expo-router";

export default function TabsLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;
  if (!isAuthenticated) return <Redirect href="/(auth)/loginScreen" />;
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#0984e3",
        tabBarStyle: {
          backgroundColor: "#f6f8fa",
          borderTopWidth: 0.5,
          borderTopColor: "#dfe4ea",
        },
        tabBarLabelStyle: { fontWeight: "bold", fontSize: 13 },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="donate"
        options={{
          title: "Donate",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="add-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="maps"
        options={{
          title: "Maps",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="map" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="receive"
        options={{
          title: "Receive",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="gift-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
