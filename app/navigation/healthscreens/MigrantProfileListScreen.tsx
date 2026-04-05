import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useTheme } from "../../../utils/theme-context";
import { darkTheme, lightTheme, createHealthStyles } from "../../../constants/styles/healthStyles";
import { healthApi, HealthIDDTO } from "../../api/healthApi";
import { searchUsers, UserProfile } from "../../api/userApi";
import { ValidationAlert } from "../../../components/common/ValidationAlert";

export default function MigrantProfileListScreen() {
  const { colorScheme } = useTheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  const styles = createHealthStyles(theme);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState("");
  const [migrants, setMigrants] = useState<UserProfile[]>([]);
  const [healthByUser, setHealthByUser] = useState<Record<string, HealthIDDTO>>({});
  const [popup, setPopup] = useState<{ visible: boolean; title: string; message: string; type: "success" | "error" | "warning" | "info" }>({
    visible: false,
    title: "",
    message: "",
    type: "info",
  });

  const loadMigrants = async (searchText?: string) => {
    try {
      setLoading(true);
      const users = await searchUsers((searchText || query).trim());
      const migrantUsers = users.filter((user) => (user.roles || []).includes("MIGRANT"));
      setMigrants(migrantUsers);

      const healthEntries = await Promise.all(
        migrantUsers.map(async (user) => {
          try {
            const health = await healthApi.getHealthIDByUserId(user.id);
            return { id: user.id, health };
          } catch {
            return { id: user.id, health: null };
          }
        })
      );
      const map: Record<string, HealthIDDTO> = {};
      healthEntries.forEach((entry) => {
        if (entry.health) {
          map[entry.id] = entry.health;
        }
      });
      setHealthByUser(map);
    } catch (error: any) {
      setPopup({
        visible: true,
        title: "Load Failed",
        message: error.message || "Unable to load migrants",
        type: "error",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMigrants("");
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadMigrants();
  };

  const filteredMigrants = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) return migrants;
    return migrants.filter((migrant) => {
      const health = healthByUser[migrant.id];
      return (
        (migrant.name || "").toLowerCase().includes(text) ||
        (migrant.username || "").toLowerCase().includes(text) ||
        (health?.healthId || "").toLowerCase().includes(text) ||
        (health?.currentCity || "").toLowerCase().includes(text)
      );
    });
  }, [migrants, healthByUser, query]);

  const handleConnect = async (migrant: UserProfile) => {
    try {
      await healthApi.sendConnectionRequest(
        migrant.id,
        "MIGRANT",
        "NGO_MIGRANT",
        undefined,
        "NGO"
      );
      setPopup({
        visible: true,
        title: "Request Sent",
        message: `Support request sent to ${migrant.name || migrant.username}.`,
        type: "success",
      });
    } catch (error: any) {
      setPopup({
        visible: true,
        title: "Request Failed",
        message: error.message || "Unable to send request",
        type: "error",
      });
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
            <MaterialIcons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <View>
            <Text style={[styles.headerTitle, { fontSize: 21 }]}>Find Migrants</Text>
          </View>
        </View>
      </View>
      <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 2 }}>
        <Text style={[styles.headerSubtitle, { fontSize: 12 }]}>Basic migrant details for NGO outreach</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={[styles.card, { marginBottom: 12 }]}> 
          <TextInput
            style={[styles.input, { marginBottom: 0 }]}
            placeholder="Search by name, username, health ID or city"
            placeholderTextColor={theme.textSecondary}
            value={query}
            onChangeText={setQuery}
          />
        </View>

        {filteredMigrants.length === 0 ? (
          <View style={styles.emptyState}>
            <FontAwesome5 name="users" size={72} color={theme.textSecondary} style={styles.emptyStateIcon} />
            <Text style={styles.emptyStateText}>No migrants found</Text>
          </View>
        ) : (
          filteredMigrants.map((migrant) => {
            const health = healthByUser[migrant.id];
            return (
              <View key={migrant.id} style={[styles.card, { marginBottom: 12 }]}> 
                <Text style={styles.cardTitle}>{migrant.name || migrant.username}</Text>
                <Text style={styles.cardSubtitle}>Username: {migrant.username}</Text>
                {health?.healthId ? <Text style={styles.cardSubtitle}>Health ID: {health.healthId}</Text> : null}
                {health?.bloodGroup ? <Text style={styles.cardSubtitle}>Blood Group: {health.bloodGroup}</Text> : null}
                {health?.currentCity ? <Text style={styles.cardSubtitle}>City: {health.currentCity}</Text> : null}
                {health?.currentState ? <Text style={styles.cardSubtitle}>State: {health.currentState}</Text> : null}
                {health?.occupation ? <Text style={styles.cardSubtitle}>Occupation: {health.occupation}</Text> : null}

                <TouchableOpacity
                  style={[styles.button, { marginTop: 10, minHeight: 40, marginVertical: 0 }]}
                  onPress={() => handleConnect(migrant)}
                >
                  <Text style={styles.buttonText}>Connect</Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </ScrollView>

      <ValidationAlert
        visible={popup.visible}
        title={popup.title}
        message={popup.message}
        type={popup.type}
        onClose={() => setPopup((prev) => ({ ...prev, visible: false }))}
      />
    </View>
  );
}
