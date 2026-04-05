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
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useTheme } from "../../../utils/theme-context";
import { darkTheme, lightTheme, createHealthStyles } from "../../../constants/styles/healthStyles";
import {
  healthApi,
  MigrantRiskInsightsDTO,
  RiskAssistantHistoryMessageDTO,
} from "../../api/healthApi";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function MigrantHealthStatusScreen() {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createHealthStyles(theme);
  const params = useLocalSearchParams<{ userId?: string }>();

  const [resolvedUserId, setResolvedUserId] = useState<string>("");
  const [insights, setInsights] = useState<MigrantRiskInsightsDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [recomputing, setRecomputing] = useState(false);
  const [error, setError] = useState("");

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [sending, setSending] = useState(false);

  const riskBadge = useMemo(() => {
    const level = insights?.riskLevel;
    if (level === "HIGH") {
      return { label: "High Risk", color: theme.error, background: theme.error + "20" };
    }
    if (level === "MEDIUM") {
      return { label: "Needs Attention", color: theme.warning, background: theme.warning + "20" };
    }
    return { label: "Stable", color: theme.success, background: theme.success + "20" };
  }, [insights?.riskLevel, theme.error, theme.warning, theme.success]);

  const hydrateInsights = async (userId: string, forceCompute: boolean = false) => {
    if (!userId) {
      setError("Unable to resolve user context");
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      setError("");
      if (forceCompute) {
        setRecomputing(true);
        await healthApi.triggerRiskCompute(userId, "MANUAL");
        await sleep(1200);
      }
      const data = await healthApi.getRiskInsights(userId, "en");
      setInsights(data);
      setChatMessages((prev) => {
        if (prev.length > 0) return prev;
        return [
          {
            id: `assistant-init-${Date.now()}`,
            role: "assistant",
            text: data.statusSummary,
          },
        ];
      });
    } catch (e: any) {
      setError(e?.message || "Failed to load health status insights");
    } finally {
      setLoading(false);
      setRefreshing(false);
      setRecomputing(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const fromParams = String(params.userId || "").trim();
      const userId = fromParams || (await SecureStore.getItemAsync("userId")) || "";
      setResolvedUserId(userId);
      await hydrateInsights(userId);
    };
    init();
  }, [params.userId]);

  const onRefresh = async () => {
    if (!resolvedUserId) return;
    setRefreshing(true);
    await hydrateInsights(resolvedUserId);
  };

  const onRecompute = async () => {
    if (!resolvedUserId) return;
    await hydrateInsights(resolvedUserId, true);
  };

  const handleSend = async () => {
    const text = messageInput.trim();
    if (!text || !resolvedUserId || sending) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text,
    };

    const nextHistory: RiskAssistantHistoryMessageDTO[] = [...chatMessages, userMessage]
      .slice(-8)
      .map((msg) => ({ role: msg.role, content: msg.text }));

    setChatMessages((prev) => [...prev, userMessage]);
    setMessageInput("");
    setSending(true);

    try {
      const response = await healthApi.askRiskAssistant(resolvedUserId, {
        message: text,
        language: insights?.language || "en",
        history: nextHistory,
      });

      const responseText =
        response.suggestedNextSteps?.length > 0
          ? `${response.answer}\n\nNext steps:\n- ${response.suggestedNextSteps.join("\n- ")}`
          : response.answer;

      setChatMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          text: responseText,
        },
      ]);
    } catch (e: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          text: e?.message || "I could not process that right now. Please try again.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.cardSubtitle, { marginTop: 8, marginBottom: 0 }]}>Loading your health status...</Text>
      </View>
    );
  }

  if (error && !insights) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center", paddingHorizontal: 24 }]}>
        <MaterialIcons name="error-outline" size={44} color={theme.error} />
        <Text style={[styles.cardTitle, { marginTop: 12, textAlign: "center" }]}>Unable to load status</Text>
        <Text style={[styles.cardSubtitle, { marginTop: 8, textAlign: "center" }]}>{error}</Text>
        <TouchableOpacity style={[styles.button, { marginTop: 16 }]} onPress={() => hydrateInsights(resolvedUserId)}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 10, padding: 4 }}>
            <MaterialIcons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Health Status Coach</Text>
            <Text style={styles.headerSubtitle}>Understand your risk and improve your profile</Text>
          </View>
          <TouchableOpacity onPress={onRecompute} disabled={recomputing} style={{ padding: 4 }}>
            {recomputing ? (
              <ActivityIndicator size="small" color={theme.primary} />
            ) : (
              <MaterialIcons name="refresh" size={22} color={theme.text} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {error ? (
          <View style={[styles.card, { borderColor: theme.warning }]}>
            <Text style={[styles.cardTitle, { color: theme.warning }]}>Status notice</Text>
            <Text style={[styles.cardSubtitle, { marginTop: 8, marginBottom: 0 }]}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current Status</Text>
          <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View>
              <Text style={styles.infoLabel}>Risk Score</Text>
              <Text style={[styles.statValue, { fontSize: 32 }]}>{(insights?.riskScore || 0).toFixed(1)}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <View style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, backgroundColor: riskBadge.background }}>
                <Text style={{ color: riskBadge.color, fontWeight: "700", fontSize: 12 }}>{riskBadge.label}</Text>
              </View>
              <Text style={[styles.cardSubtitle, { marginTop: 6, marginBottom: 0 }]}>
                Level: {insights?.riskLevel || "-"}
              </Text>
            </View>
          </View>
          <Text style={[styles.cardSubtitle, { marginTop: 8, marginBottom: 0 }]}>
            Data sources: {(insights?.dataSources || ["HEALTH_ID"]).join(", ")}
          </Text>
          <Text style={[styles.cardSubtitle, { marginTop: 4, marginBottom: 0 }]}>
            Records analyzed: {insights?.recordsAnalyzed ?? 0} | PDF extracts: {insights?.pdfSourcesAnalyzed ?? 0}
          </Text>

          {insights?.topFactors?.length ? (
            <View style={{ marginTop: 12 }}>
              <Text style={styles.infoLabel}>Top Risk Factors</Text>
              {insights.topFactors.slice(0, 3).map((factor, index) => (
                <Text key={`${factor}-${index}`} style={[styles.cardSubtitle, { marginTop: 6, marginBottom: 0 }]}>
                  {index + 1}. {factor}
                </Text>
              ))}
            </View>
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Missing Health ID Data</Text>
          {!insights?.missingHealthFields?.length ? (
            <Text style={[styles.cardSubtitle, { marginTop: 8, marginBottom: 0 }]}>
              Great work. Your key health profile fields are complete.
            </Text>
          ) : (
            insights.missingHealthFields.map((field) => (
              <View
                key={`${field.key}-${field.status}`}
                style={{
                  marginTop: 10,
                  backgroundColor: theme.background,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: theme.border,
                  padding: 10,
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Text style={[styles.infoLabel, { flex: 1, marginRight: 6 }]}>{field.label}</Text>
                  <View
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      borderRadius: 10,
                      backgroundColor:
                        field.priority === "HIGH"
                          ? theme.error + "20"
                          : field.priority === "MEDIUM"
                          ? theme.warning + "20"
                          : theme.success + "20",
                    }}
                  >
                    <Text
                      style={{
                        color:
                          field.priority === "HIGH"
                            ? theme.error
                            : field.priority === "MEDIUM"
                            ? theme.warning
                            : theme.success,
                        fontSize: 11,
                        fontWeight: "700",
                      }}
                    >
                      {field.priority}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.cardSubtitle, { marginTop: 5, marginBottom: 0 }]}>{field.whyImportant}</Text>
                <Text style={[styles.cardSubtitle, { marginTop: 6, marginBottom: 0, color: theme.text }]}>
                  Action: {field.recommendedAction}
                </Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>How to Improve</Text>
          <Text style={[styles.cardSubtitle, { marginTop: 8, marginBottom: 0 }]}>{insights?.statusSummary}</Text>

          {insights?.priorityChecklist?.length ? (
            <View style={{ marginTop: 12 }}>
              <Text style={styles.infoLabel}>Priority Checklist</Text>
              {insights.priorityChecklist.map((step, index) => (
                <Text key={`${step}-${index}`} style={[styles.cardSubtitle, { marginTop: 6, marginBottom: 0 }]}>
                  {index + 1}. {step}
                </Text>
              ))}
            </View>
          ) : null}

          {insights?.improvementSteps?.length ? (
            <View style={{ marginTop: 12 }}>
              <Text style={styles.infoLabel}>Improvement Steps</Text>
              {insights.improvementSteps.map((step, index) => (
                <Text key={`${step}-${index}`} style={[styles.cardSubtitle, { marginTop: 6, marginBottom: 0 }]}>
                  {index + 1}. {step}
                </Text>
              ))}
            </View>
          ) : null}

          {insights?.safetyNotice ? (
            <Text style={[styles.cardSubtitle, { marginTop: 12, marginBottom: 0 }]}>{insights.safetyNotice}</Text>
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>AI Health Assistant</Text>
          <Text style={[styles.cardSubtitle, { marginTop: 6 }]}>
            Ask anything about improving your status, missing health fields, or your next steps.
          </Text>

          <View style={{ marginTop: 8 }}>
            {chatMessages.map((msg) => (
              <View
                key={msg.id}
                style={{
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "90%",
                  backgroundColor: msg.role === "user" ? theme.primary : theme.background,
                  borderRadius: 12,
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                  marginTop: 8,
                  borderWidth: msg.role === "assistant" ? 1 : 0,
                  borderColor: theme.border,
                }}
              >
                <Text style={{ color: msg.role === "user" ? "#fff" : theme.text }}>{msg.text}</Text>
              </View>
            ))}
          </View>

          <View style={{ flexDirection: "row", alignItems: "flex-end", marginTop: 12 }}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0, marginRight: 8, minHeight: 44, maxHeight: 120 }]}
              placeholder="Ask your health assistant..."
              placeholderTextColor={theme.textSecondary}
              value={messageInput}
              onChangeText={setMessageInput}
              multiline
            />
            <TouchableOpacity
              style={[styles.button, { marginVertical: 0, minHeight: 44, paddingHorizontal: 14, opacity: sending ? 0.7 : 1 }]}
              onPress={handleSend}
              disabled={sending}
            >
              {sending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <MaterialIcons name="send" size={18} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
