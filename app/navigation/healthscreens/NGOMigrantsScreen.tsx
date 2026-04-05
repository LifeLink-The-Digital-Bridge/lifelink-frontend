import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { SidebarMenu } from "../../../components/dashboard/SidebarMenu";
import { useTheme } from "../../../utils/theme-context";
import { darkTheme, lightTheme, createHealthStyles } from "../../../constants/styles/healthStyles";
import { healthApi, HealthIDDTO, HealthRecordDTO } from "../../api/healthApi";
import { getUsersByIds } from "../../api/userApi";

type FilterState = "ALL" | "ACTIVE" | "IN_PROGRESS" | "COMPLETED";

type MigrantSupportCard = {
  id: string;
  migrantUserId: string;
  migrantHealthId: string;
  supportType: string;
  status: string;
  description?: string;
  notes?: string;
  supportStartDate: string;
  healthID?: HealthIDDTO;
  records: HealthRecordDTO[];
  emergencyCount: number;
  migrantName?: string;
};

export default function NGOMigrantsScreen() {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createHealthStyles(theme);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [filter, setFilter] = useState<FilterState>("ALL");
  const [searchText, setSearchText] = useState("");
  const [cards, setCards] = useState<MigrantSupportCard[]>([]);
  const [supportActionTarget, setSupportActionTarget] = useState<MigrantSupportCard | null>(null);

  useEffect(() => {
    loadMigrantSupport();
  }, []);

  const loadMigrantSupport = async () => {
    try {
      setLoading(true);
      const ngoId = await SecureStore.getItemAsync("userId");
      if (!ngoId) {
        throw new Error("NGO session missing");
      }

      const associations = await healthApi.getNGOMigrants(ngoId);
      const mapped: MigrantSupportCard[] = await Promise.all(
        (associations || []).map(async (association: any) => {
          const [healthID, records] = await Promise.all([
            healthApi.getHealthIDByHealthId(String(association.migrantHealthId)),
            healthApi.getHealthRecordsByHealthId(String(association.migrantHealthId)),
          ]);

          return {
            id: String(association.id),
            migrantUserId: String(association.migrantUserId),
            migrantHealthId: String(association.migrantHealthId),
            supportType: String(association.supportType || "GENERAL"),
            status: String(association.status || "ACTIVE"),
            description: association.description,
            notes: association.notes,
            supportStartDate: String(association.supportStartDate || association.createdAt || new Date().toISOString()),
            healthID,
            records,
            emergencyCount: (records || []).filter((record) => record.isEmergency).length,
          };
        }),
      );

      const userIds = Array.from(new Set(mapped.map((card) => card.migrantUserId)));
      const users = userIds.length > 0 ? await getUsersByIds(userIds) : [];
      const nameMap = users.reduce<Record<string, string>>((acc, user) => {
        acc[user.id] = user.name || user.username || user.id;
        return acc;
      }, {});

      const enriched = mapped.map((card) => ({
        ...card,
        migrantName: nameMap[card.migrantUserId] || "Unknown Migrant",
      }));

      setCards(enriched);
    } catch (error: any) {
      Alert.alert("Load Failed", error?.message || "Unable to load supported migrants");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      if (filter !== "ALL" && card.status !== filter) {
        return false;
      }
      if (!searchText.trim()) {
        return true;
      }
      const query = searchText.trim().toLowerCase();
      return (
        (card.migrantName || "").toLowerCase().includes(query) ||
        (card.migrantHealthId || "").toLowerCase().includes(query) ||
        (card.healthID?.currentCity || "").toLowerCase().includes(query)
      );
    });
  }, [cards, filter, searchText]);

  const statusColor = (status: string) => {
    if (status === "ACTIVE") return theme.success;
    if (status === "IN_PROGRESS") return theme.warning;
    if (status === "COMPLETED") return theme.textSecondary;
    return theme.primary;
  };

  const updateSupportStatus = async (associationId: string, status: string, notes: string) => {
    try {
      await healthApi.updateNGOMigrantAssociation(associationId, status, notes);
      await loadMigrantSupport();
    } catch (error: any) {
      Alert.alert("Update Failed", error?.message || "Unable to update support status");
    }
  };

  const openSupportActions = (card: MigrantSupportCard) => {
    setSupportActionTarget(card);
  };

  const applySupportStatus = async (status: string, notes: string) => {
    if (!supportActionTarget) {
      return;
    }
    await updateSupportStatus(supportActionTarget.id, status, notes);
    setSupportActionTarget(null);
  };

  if (loading) {
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
          <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ marginRight: 10, padding: 4 }}>
            <MaterialIcons name="menu" size={22} color={theme.text} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={[styles.headerTitle, { fontSize: 21 }]}>Supported Migrants</Text>
            <Text style={[styles.headerSubtitle, { fontSize: 12 }]}>Track and manage NGO support lifecycle</Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/navigation/notifications" as any)} style={{ padding: 4 }}>
            <MaterialIcons name="notifications-none" size={22} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadMigrantSupport(); }} />}
      >
        <View style={[styles.card, { marginBottom: 12 }]}>
          <Text style={styles.cardTitle}>Search and Filter</Text>
          <TextInput
            style={[styles.input, { marginTop: 10 }]}
            placeholder="Search by migrant name, Health ID or city"
            placeholderTextColor={theme.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
          />
          <View style={{ flexDirection: "row", marginTop: 10, flexWrap: "wrap" }}>
            {(["ALL", "ACTIVE", "IN_PROGRESS", "COMPLETED"] as FilterState[]).map((state) => (
              <TouchableOpacity
                key={state}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 7,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: theme.border,
                  marginRight: 8,
                  marginBottom: 8,
                  backgroundColor: filter === state ? theme.primary : theme.card,
                }}
                onPress={() => setFilter(state)}
              >
                <Text style={{ color: filter === state ? "#fff" : theme.text, fontSize: 12 }}>{state}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {filteredCards.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="groups" size={72} color={theme.textSecondary} style={styles.emptyStateIcon} />
            <Text style={styles.emptyStateText}>No migrants match this filter</Text>
            <Text style={styles.emptyStateSubtext}>Try changing status filter or search text.</Text>
          </View>
        ) : (
          filteredCards.map((card) => (
            <View key={card.id} style={[styles.card, { marginBottom: 12 }]}> 
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{card.migrantName || "Unknown Migrant"}</Text>
                  <Text style={styles.cardSubtitle}>Health ID: {card.migrantHealthId}</Text>
                  <Text style={styles.cardSubtitle}>Support Type: {card.supportType}</Text>
                </View>
                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 12,
                    backgroundColor: statusColor(card.status) + "20",
                  }}
                >
                  <Text style={{ color: statusColor(card.status), fontWeight: "600", fontSize: 12 }}>{card.status}</Text>
                </View>
              </View>

              <View style={{ marginTop: 8 }}>
                <Text style={styles.infoLabel}>Emergency Cases</Text>
                <Text style={styles.infoValue}>{card.emergencyCount}</Text>
                {card.notes ? <Text style={[styles.cardSubtitle, { marginTop: 6 }]}>Notes: {card.notes}</Text> : null}
                <Text style={[styles.cardSubtitle, { marginTop: 6 }]}>Started: {new Date(card.supportStartDate).toLocaleString()}</Text>
              </View>

              <View style={{ flexDirection: "row", marginTop: 12 }}>
                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton, { flex: 1, marginRight: 8, minHeight: 34, marginVertical: 0, paddingVertical: 8 }]}
                  onPress={() =>
                    router.push({
                      pathname: "/navigation/healthscreens/HealthRecordsScreen",
                      params: { userId: card.migrantUserId, healthId: card.migrantHealthId },
                    })
                  }
                >
                  <Text style={[styles.buttonText, styles.secondaryButtonText, { fontSize: 13 }]}>View Records</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { flex: 1, marginLeft: 8, minHeight: 34, marginVertical: 0, paddingVertical: 8 }]}
                  onPress={() => openSupportActions(card)}
                >
                  <Text style={[styles.buttonText, { fontSize: 13 }]}>Update Support</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Modal
        visible={!!supportActionTarget}
        transparent
        animationType="fade"
        onRequestClose={() => setSupportActionTarget(null)}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", padding: 20 }}>
          <View style={{ backgroundColor: theme.card, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: theme.border }}>
            <Text style={[styles.cardTitle, { marginBottom: 4 }]}>Update Support Status</Text>
            <Text style={[styles.cardSubtitle, { marginBottom: 14 }]}>
              {supportActionTarget?.migrantName || supportActionTarget?.migrantHealthId}
            </Text>

            <TouchableOpacity
              style={[styles.button, { marginVertical: 0, minHeight: 38, paddingVertical: 8 }]}
              onPress={() =>
                applySupportStatus(
                  "IN_PROGRESS",
                  `Support actively in progress at ${new Date().toLocaleString()}`,
                )
              }
            >
              <Text style={[styles.buttonText, { fontSize: 13 }]}>Mark In Progress</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton, { marginVertical: 8, minHeight: 38, paddingVertical: 8 }]}
              onPress={() =>
                applySupportStatus(
                  "ACTIVE",
                  `Follow-up requested at ${new Date().toLocaleString()}`,
                )
              }
            >
              <Text style={[styles.buttonText, styles.secondaryButtonText, { fontSize: 13 }]}>Request Follow-up</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.success, marginVertical: 0, minHeight: 38, paddingVertical: 8 }]}
              onPress={() =>
                applySupportStatus(
                  "COMPLETED",
                  `Support completed at ${new Date().toLocaleString()}`,
                )
              }
            >
              <Text style={[styles.buttonText, { fontSize: 13 }]}>Mark Completed</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ alignSelf: "center", marginTop: 12, paddingVertical: 4, paddingHorizontal: 8 }}
              onPress={() => setSupportActionTarget(null)}
            >
              <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: "600" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <SidebarMenu isVisible={menuVisible} onClose={() => setMenuVisible(false)} />
    </View>
  );
}
