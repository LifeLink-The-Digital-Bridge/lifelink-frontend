import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../../utils/theme-context";
import { darkTheme, lightTheme, createHealthStyles } from "../../../constants/styles/healthStyles";
import { healthApi, SdgDashboardDTO } from "../../api/healthApi";
import { SidebarMenu } from "../../../components/dashboard/SidebarMenu";

const MAX_STATES_TARGET = 14;

type SdgEntry = {
  key: string;
  value: number;
  title: string;
  description: string;
  formula: string;
};

const SDG_META: Record<string, Omit<SdgEntry, "key" | "value">> = {
  sdg3_health_coverage: {
    title: "SDG 3: Health Coverage",
    description: "Measures how many migrants have a Health ID.",
    formula: "Health IDs / Total migrants x 100",
  },
  sdg10_inclusion_connections: {
    title: "SDG 10: Inclusion Connections",
    description: "Tracks active care/support links per migrant.",
    formula: "(Doctor links + NGO links) / Migrants x 100",
  },
  sdg11_state_reach: {
    title: "SDG 11: State Reach",
    description: "Shows how broadly the system is active across states.",
    formula: "States covered / 14 target states x 100",
  },
  sdg17_partnership_density: {
    title: "SDG 17: Partnership Density",
    description: "Measures collaboration intensity in the full network.",
    formula: "((Doctor links + NGO links) / Users x 100) x 4",
  },
};

const scoreLabel = (value: number): string => {
  if (value >= 80) return "Excellent";
  if (value >= 60) return "Good";
  if (value >= 40) return "Moderate";
  return "Needs Focus";
};

const clampPercent = (value: number): number => Math.max(0, Math.min(value, 100));

const toFallbackSdgTitle = (key: string): string =>
  key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function AdminDashboardScreen() {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createHealthStyles(theme);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [dashboard, setDashboard] = useState<SdgDashboardDTO | null>(null);
  const [error, setError] = useState("");

  const sdgEntries = useMemo(() => {
    if (!dashboard?.sdgScorecard) {
      return [] as SdgEntry[];
    }

    return Object.entries(dashboard.sdgScorecard).map(([key, value]) => {
      const safeValue = Number.isFinite(value) ? value : 0;
      const meta = SDG_META[key];

      return {
        key,
        value: safeValue,
        title: meta?.title ?? toFallbackSdgTitle(key),
        description: meta?.description ?? "Derived from current dashboard data.",
        formula: meta?.formula ?? "Calculated from available records and relationships.",
      };
    });
  }, [dashboard]);

  const topStates = useMemo(() => {
    if (!dashboard?.stateDistribution) {
      return [] as { state: string; count: number }[];
    }
    return Object.entries(dashboard.stateDistribution)
      .map(([state, count]) => ({ state, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [dashboard]);

  const totalConnections = useMemo(() => {
    if (!dashboard) return 0;
    return dashboard.activeDoctorPatientConnections + dashboard.activeNgoMigrantConnections;
  }, [dashboard]);

  const statesCovered = useMemo(
    () => Object.keys(dashboard?.stateDistribution ?? {}).length,
    [dashboard]
  );

  const stateCoveragePercent = useMemo(
    () => clampPercent((statesCovered * 100) / MAX_STATES_TARGET),
    [statesCovered]
  );

  const overallSdgScore = useMemo(() => {
    if (sdgEntries.length === 0) return 0;
    const total = sdgEntries.reduce((acc, item) => acc + item.value, 0);
    return total / sdgEntries.length;
  }, [sdgEntries]);

  const primaryMetrics = useMemo(() => {
    if (!dashboard) return [] as { key: string; label: string; value: string }[];

    return [
      { key: "users", label: "Total Users", value: dashboard.totalUsers.toLocaleString() },
      { key: "migrants", label: "Migrants", value: dashboard.totalMigrants.toLocaleString() },
      { key: "doctors", label: "Doctors", value: dashboard.totalDoctors.toLocaleString() },
      { key: "ngos", label: "NGOs", value: dashboard.totalNGOs.toLocaleString() },
    ];
  }, [dashboard]);

  const insightMetrics = useMemo(() => {
    if (!dashboard) return [] as { key: string; label: string; value: string; helper: string }[];

    const recordsPerMigrant =
      dashboard.totalMigrants > 0 ? dashboard.totalHealthRecords / dashboard.totalMigrants : 0;

    const emergencyRate =
      dashboard.totalHealthRecords > 0
        ? (dashboard.emergencyRecords * 100) / dashboard.totalHealthRecords
        : 0;

    const supportCoverage =
      dashboard.totalMigrants > 0 ? (totalConnections * 100) / dashboard.totalMigrants : 0;

    const monthlyActivity = dashboard.newUsersThisMonth + dashboard.newHealthRecordsThisMonth;

    return [
      {
        key: "records-per-migrant",
        label: "Records per Migrant",
        value: recordsPerMigrant.toFixed(2),
        helper: "Total records / migrants",
      },
      {
        key: "emergency-rate",
        label: "Emergency Rate",
        value: `${emergencyRate.toFixed(1)}%`,
        helper: "Emergency records share",
      },
      {
        key: "support-coverage",
        label: "Support Link Coverage",
        value: `${supportCoverage.toFixed(1)}%`,
        helper: "Active links per migrant",
      },
      {
        key: "monthly-activity",
        label: "Monthly Activity",
        value: monthlyActivity.toLocaleString(),
        helper: "New users + new records (30d)",
      },
      {
        key: "states-covered",
        label: "States Covered",
        value: `${statesCovered}/${MAX_STATES_TARGET}`,
        helper: "Geo spread progress",
      },
      {
        key: "overall-sdg",
        label: "Overall SDG Score",
        value: `${overallSdgScore.toFixed(1)}%`,
        helper: scoreLabel(overallSdgScore),
      },
    ];
  }, [dashboard, totalConnections, statesCovered, overallSdgScore]);

  const loadDashboard = async () => {
    try {
      setError("");
      const data = await healthApi.getAdminSdgDashboard();
      setDashboard(data);
    } catch (e: any) {
      setError(e?.message || "Unable to load SDG dashboard");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}> 
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.headerSubtitle, { marginTop: 10, color: theme.textSecondary }]}>Loading SDG dashboard...</Text>
      </View>
    );
  }

  if (error || !dashboard) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center", paddingHorizontal: 24 }]}> 
        <MaterialIcons name="error-outline" size={44} color={theme.error} />
        <Text style={[styles.cardTitle, { marginTop: 12, textAlign: "center" }]}>Failed to load dashboard</Text>
        <Text style={[styles.cardSubtitle, { textAlign: "center", marginTop: 6 }]}>{error || "No data available"}</Text>
        <TouchableOpacity style={[styles.button, { marginTop: 18 }]} onPress={loadDashboard}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ marginRight: 10, padding: 4 }}>
            <MaterialIcons name="menu" size={24} color={theme.text} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Admin Dashboard</Text>
            <Text style={styles.headerSubtitle}>SDG and platform impact metrics</Text>
          </View>
          <TouchableOpacity onPress={() => { setRefreshing(true); loadDashboard(); }} style={{ padding: 4 }}>
            <MaterialIcons name="refresh" size={22} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadDashboard(); }} />}
      >
        <View style={{ marginTop: 12 }}>
          <Text style={[styles.cardTitle, { marginBottom: 10 }]}>Platform Snapshot</Text>
          <View style={[styles.statsGrid, { justifyContent: "space-between", marginVertical: 0 }]}> 
            {primaryMetrics.map((metric) => (
              <View
                key={metric.key}
                style={[
                  styles.statCard,
                  { width: "48%", marginRight: 0, marginBottom: 10, alignItems: "flex-start" },
                ]}
              >
                <Text style={[styles.statValue, { fontSize: 26 }]}>{metric.value}</Text>
                <Text style={[styles.statLabel, { textAlign: "left" }]}>{metric.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Health Coverage</Text>
          <Text style={[styles.cardSubtitle, { marginTop: 4 }]}>Health ID coverage among migrants</Text>
          <View style={{ marginTop: 10 }}>
            <Text style={{ color: theme.text, fontSize: 28, fontWeight: "800" }}>
              {dashboard.migrantHealthIdCoveragePercent.toFixed(2)}%
            </Text>
            <Text style={{ color: theme.textSecondary, marginTop: 4 }}>
              {dashboard.totalHealthIds} health IDs | {dashboard.totalHealthRecords} records
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Monthly Growth</Text>
          <View style={{ marginTop: 10 }}>
            <Text style={styles.infoLabel}>New users (30 days)</Text>
            <Text style={styles.cardSubtitle}>{dashboard.newUsersThisMonth}</Text>
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={styles.infoLabel}>New health records (30 days)</Text>
            <Text style={styles.cardSubtitle}>{dashboard.newHealthRecordsThisMonth}</Text>
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={styles.infoLabel}>Emergency records</Text>
            <Text style={styles.cardSubtitle}>{dashboard.emergencyRecords}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Partnership Network</Text>
          <View style={{ marginTop: 10 }}>
            <Text style={styles.infoLabel}>Doctor {"<->"} Migrant active links</Text>
            <Text style={styles.cardSubtitle}>{dashboard.activeDoctorPatientConnections}</Text>
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={styles.infoLabel}>NGO {"<->"} Migrant active links</Text>
            <Text style={styles.cardSubtitle}>{dashboard.activeNgoMigrantConnections}</Text>
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={styles.infoLabel}>Total active links</Text>
            <Text style={styles.cardSubtitle}>{totalConnections}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Admin Insights</Text>
          <Text style={[styles.cardSubtitle, { marginTop: 4 }]}>Additional metrics for faster decision-making</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: 8 }}>
            {insightMetrics.map((metric) => (
              <View
                key={metric.key}
                style={{
                  width: "48%",
                  backgroundColor: theme.background,
                  borderWidth: 1,
                  borderColor: theme.border,
                  borderRadius: 12,
                  paddingVertical: 10,
                  paddingHorizontal: 10,
                  marginBottom: 10,
                }}
              >
                <Text style={{ color: theme.textSecondary, fontSize: 12 }}>{metric.label}</Text>
                <Text style={{ color: theme.text, fontSize: 18, fontWeight: "700", marginTop: 4 }}>
                  {metric.value}
                </Text>
                <Text style={{ color: theme.textSecondary, fontSize: 11, marginTop: 2 }}>{metric.helper}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>SDG Scorecard</Text>
          <Text style={[styles.cardSubtitle, { marginTop: 4 }]}>Combined SDG readiness score</Text>
          <Text style={{ color: theme.text, fontSize: 28, fontWeight: "800", marginTop: 6 }}>
            {overallSdgScore.toFixed(2)}%
          </Text>
          <Text style={{ color: theme.textSecondary, marginTop: 2 }}>
            {scoreLabel(overallSdgScore)} | {sdgEntries.length} indicators
          </Text>
          <View
            style={{
              marginTop: 10,
              backgroundColor: theme.border + "55",
              borderRadius: 10,
              overflow: "hidden",
              height: 10,
            }}
          >
            <View
              style={{
                width: `${clampPercent(overallSdgScore)}%`,
                backgroundColor: theme.primary,
                height: 10,
              }}
            />
          </View>

          <View
            style={{
              marginTop: 14,
              backgroundColor: theme.background,
              borderWidth: 1,
              borderColor: theme.border,
              borderRadius: 10,
              padding: 10,
            }}
          >
            <Text style={{ color: theme.text, fontWeight: "700", fontSize: 13 }}>How this score works</Text>
            <Text style={{ color: theme.textSecondary, marginTop: 4, fontSize: 12 }}>
              Each SDG metric is converted to a 0-100 score. The overall SDG score is the average of those scores.
            </Text>
            {sdgEntries.map((item) => (
              <Text key={`${item.key}-formula`} style={{ color: theme.textSecondary, marginTop: 4, fontSize: 12 }}>
                {item.title}: {item.formula}
              </Text>
            ))}
          </View>

          {sdgEntries.map((item) => {
            const metricColor =
              item.value >= 80 ? theme.success : item.value >= 60 ? theme.primary : item.value >= 40 ? theme.warning : theme.error;

            return (
              <View key={item.key} style={{ marginTop: 12 }}>
                <Text style={styles.infoLabel}>{item.title}</Text>
                <Text style={{ color: theme.textSecondary, marginTop: 2, fontSize: 12 }}>{item.description}</Text>
                <View
                  style={{
                    marginTop: 6,
                    backgroundColor: theme.border + "55",
                    borderRadius: 8,
                    overflow: "hidden",
                    height: 10,
                  }}
                >
                  <View
                    style={{
                      width: `${clampPercent(item.value)}%`,
                      backgroundColor: metricColor,
                      height: 10,
                    }}
                  />
                </View>
                <Text style={[styles.timelineDescription, { marginTop: 4 }]}> 
                  {item.value.toFixed(2)}% | {scoreLabel(item.value)}
                </Text>
              </View>
            );
          })}

          {sdgEntries.length === 0 && (
            <Text style={[styles.cardSubtitle, { marginTop: 10 }]}>No SDG indicators are available yet.</Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Geographic Reach</Text>
          <Text style={[styles.cardSubtitle, { marginTop: 4 }]}>
            {statesCovered} / {MAX_STATES_TARGET} target states ({stateCoveragePercent.toFixed(1)}%)
          </Text>
          <View
            style={{
              marginTop: 10,
              backgroundColor: theme.border + "55",
              borderRadius: 8,
              overflow: "hidden",
              height: 10,
            }}
          >
            <View
              style={{
                width: `${clampPercent(stateCoveragePercent)}%`,
                backgroundColor: theme.info,
                height: 10,
              }}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>State Reach (Top)</Text>
          {topStates.length === 0 ? (
            <Text style={[styles.cardSubtitle, { marginTop: 8 }]}>No state distribution data yet</Text>
          ) : (
            topStates.map((entry) => (
              <View
                key={entry.state}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 10,
                  paddingBottom: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: theme.border + "40",
                }}
              >
                <Text style={{ color: theme.text, fontWeight: "600" }}>{entry.state}</Text>
                <Text style={{ color: theme.textSecondary }}>{entry.count}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <SidebarMenu isVisible={menuVisible} onClose={() => setMenuVisible(false)} />
    </View>
  );
}
