import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Linking,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { Audio } from "expo-av";
import { useTheme } from "../../../utils/theme-context";
import {
  lightTheme,
  darkTheme,
  createHealthStyles,
} from "../../../constants/styles/healthStyles";
import {
  healthApi,
  AudioLanguageDTO,
  HealthRecordAudioDTO,
  HealthRecordCommentDTO,
  HealthRecordDTO,
} from "../../api/healthApi";
import { SidebarMenu } from "../../../components/dashboard/SidebarMenu";
import { CustomAlert } from "../../../components/common/CustomAlert";
import { useRole } from "../../../utils/role-context";
import { getUsersByIds } from "../../api/userApi";

type AudioLanguageCatalogItem = {
  code: string;
  englishName: string;
  nativeName: string;
  aliases: string[];
};

type AudioContentType = "FULL" | "SUMMARY";

const DEFAULT_AUDIO_LANGUAGE = "en";
const AUDIO_CONTENT_FULL: AudioContentType = "FULL";
const AUDIO_CONTENT_SUMMARY: AudioContentType = "SUMMARY";

const AUDIO_LANGUAGE_CATALOG: AudioLanguageCatalogItem[] = [
  { code: "en", englishName: "English", nativeName: "English", aliases: ["english", "eng"] },
  { code: "hi", englishName: "Hindi", nativeName: "हिंदी", aliases: ["hindi", "hindhi", "hin"] },
  { code: "ta", englishName: "Tamil", nativeName: "தமிழ்", aliases: ["tamil", "tam"] },
  { code: "te", englishName: "Telugu", nativeName: "తెలుగు", aliases: ["telugu", "tel"] },
  { code: "ml", englishName: "Malayalam", nativeName: "മലയാളം", aliases: ["malayalam", "mal"] },
  { code: "kn", englishName: "Kannada", nativeName: "ಕನ್ನಡ", aliases: ["kannada", "kan"] },
  { code: "bn", englishName: "Bengali", nativeName: "বাংলা", aliases: ["bengali", "bangla", "ben"] },
  { code: "mr", englishName: "Marathi", nativeName: "मराठी", aliases: ["marathi", "mar"] },
  { code: "gu", englishName: "Gujarati", nativeName: "ગુજરાતી", aliases: ["gujarati", "guj"] },
  { code: "pa", englishName: "Punjabi", nativeName: "ਪੰਜਾਬੀ", aliases: ["punjabi", "panjabi", "pun"] },
  { code: "or", englishName: "Odia", nativeName: "ଓଡ଼ିଆ", aliases: ["odia", "oriya", "ori"] },
  { code: "ur", englishName: "Urdu", nativeName: "اردو", aliases: ["urdu", "urd"] },
];

const toLanguageKey = (value?: string) =>
  String(value || "").trim().toLowerCase().replace(/[_\s-]+/g, "");

const LANGUAGE_ALIAS_TO_CODE = AUDIO_LANGUAGE_CATALOG.reduce<Record<string, string>>((acc, item) => {
  acc[toLanguageKey(item.code)] = item.code;
  acc[toLanguageKey(item.englishName)] = item.code;
  acc[toLanguageKey(item.nativeName)] = item.code;
  item.aliases.forEach((alias) => {
    acc[toLanguageKey(alias)] = item.code;
  });
  return acc;
}, {});

const resolveLanguageCode = (value?: string) => {
  if (!value) return DEFAULT_AUDIO_LANGUAGE;

  const raw = String(value).trim().toLowerCase();
  const normalized = toLanguageKey(raw);
  const direct = LANGUAGE_ALIAS_TO_CODE[normalized];
  if (direct) return direct;

  if (raw.includes("-")) {
    const prefix = raw.split("-")[0].trim().toLowerCase();
    const prefixed = LANGUAGE_ALIAS_TO_CODE[toLanguageKey(prefix)];
    if (prefixed) return prefixed;
    if (prefix.length === 2) return prefix;
  }

  if (raw.length === 2) return raw;
  return DEFAULT_AUDIO_LANGUAGE;
};

const getCatalogLanguageLabel = (code: string) => {
  const normalizedCode = resolveLanguageCode(code);
  const item = AUDIO_LANGUAGE_CATALOG.find((entry) => entry.code === normalizedCode);
  if (!item) return normalizedCode.toUpperCase();
  if (item.englishName.toLowerCase() === item.nativeName.toLowerCase()) {
    return item.englishName;
  }
  return `${item.englishName} (${item.nativeName})`;
};

const toAudioLanguageOption = (code: string, enabled = true): AudioLanguageDTO => {
  const normalizedCode = resolveLanguageCode(code);
  const fallbackLabel = getCatalogLanguageLabel(normalizedCode);
  return {
    code: normalizedCode,
    name: fallbackLabel,
    enabled,
  };
};

const dedupeAudioLanguages = (languages: AudioLanguageDTO[]) => {
  const seen = new Set<string>();
  const deduped: AudioLanguageDTO[] = [];

  for (const language of languages) {
    const code = resolveLanguageCode(language.code);
    if (seen.has(code)) continue;
    seen.add(code);
    deduped.push({
      code,
      name: language.name || getCatalogLanguageLabel(code),
      enabled: language.enabled !== false,
    });
  }

  return deduped;
};

export default function HealthRecordsScreen() {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createHealthStyles(theme);

  const { isDoctor, isMigrant } = useRole();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [records, setRecords] = useState<HealthRecordDTO[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<HealthRecordDTO[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");
  const [targetPatientName, setTargetPatientName] = useState("");
  const [targetResolvedHealthId, setTargetResolvedHealthId] = useState("");
  const [doctorCanModify, setDoctorCanModify] = useState(false);
  const [commentsByRecord, setCommentsByRecord] = useState<Record<string, HealthRecordCommentDTO[]>>({});
  const [commentsLoadingByRecord, setCommentsLoadingByRecord] = useState<Record<string, boolean>>({});
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [commentSubmittingRecordId, setCommentSubmittingRecordId] = useState<string | null>(null);
  const [recordAudiosByRecord, setRecordAudiosByRecord] = useState<Record<string, HealthRecordAudioDTO[]>>({});
  const [audioLoadingByRecord, setAudioLoadingByRecord] = useState<Record<string, boolean>>({});
  const [audioGeneratingByRecord, setAudioGeneratingByRecord] = useState<Record<string, boolean>>({});
  const [supportedAudioLanguages, setSupportedAudioLanguages] = useState<AudioLanguageDTO[]>(
    AUDIO_LANGUAGE_CATALOG.map((item) => toAudioLanguageOption(item.code, true))
  );
  const [preferredAudioLanguage, setPreferredAudioLanguage] = useState(DEFAULT_AUDIO_LANGUAGE);
  const [selectedAudioLanguageByRecord, setSelectedAudioLanguageByRecord] = useState<Record<string, string>>({});
  const [playingAudioJobId, setPlayingAudioJobId] = useState<string | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertConfirmText, setAlertConfirmText] = useState<string | undefined>(undefined);
  const [alertCancelText, setAlertCancelText] = useState<string | undefined>(undefined);
  const [alertOnConfirm, setAlertOnConfirm] = useState<(() => void) | undefined>(undefined);
  const audioRef = useRef<Audio.Sound | null>(null);
  const params = useLocalSearchParams<{ userId?: string; healthId?: string }>();
  const targetUserId = useMemo(() => (params.userId ? String(params.userId) : ""), [params.userId]);
  const targetHealthId = useMemo(() => (params.healthId ? String(params.healthId) : ""), [params.healthId]);
  const isInternalView = Boolean(targetUserId || targetHealthId);
  const canShowDoctorActions = isDoctor && (!isInternalView || doctorCanModify);

  const closeAlert = () => {
    setAlertVisible(false);
    setAlertOnConfirm(undefined);
    setAlertConfirmText(undefined);
    setAlertCancelText(undefined);
  };

  const showAlert = (
    title: string,
    message: string,
    options?: {
      confirmText?: string;
      cancelText?: string;
      onConfirm?: () => void;
    }
  ) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertConfirmText(options?.confirmText);
    setAlertCancelText(options?.cancelText);
    setAlertOnConfirm(() => options?.onConfirm);
    setAlertVisible(true);
  };

  const normalizeLanguageCode = (value?: string) => resolveLanguageCode(value);

  const getSelectedLanguageForRecord = (recordId: string) => {
    return normalizeLanguageCode(
      selectedAudioLanguageByRecord[recordId] || preferredAudioLanguage || DEFAULT_AUDIO_LANGUAGE
    );
  };

  const getLanguageLabel = (value?: string) => {
    const code = normalizeLanguageCode(value);
    const match = supportedAudioLanguages.find(
      (language) => normalizeLanguageCode(language.code) === code
    );
    return match?.name || getCatalogLanguageLabel(code);
  };

  const isLanguageEnabled = (value?: string) => {
    const code = normalizeLanguageCode(value);
    const match = supportedAudioLanguages.find(
      (language) => normalizeLanguageCode(language.code) === code
    );
    return match ? match.enabled !== false : true;
  };

  const normalizeAudioContentType = (value?: string): AudioContentType => {
    const normalized = String(value || "").trim().toUpperCase();
    return normalized === AUDIO_CONTENT_SUMMARY ? AUDIO_CONTENT_SUMMARY : AUDIO_CONTENT_FULL;
  };

  const isSummaryAudio = (audio: HealthRecordAudioDTO) => {
    return normalizeAudioContentType(audio.contentType) === AUDIO_CONTENT_SUMMARY;
  };

  const getAudiosForRecord = (recordId: string, summaryOnly: boolean) => {
    const audios = recordAudiosByRecord[recordId] || [];
    return audios.filter((audio) => (summaryOnly ? isSummaryAudio(audio) : !isSummaryAudio(audio)));
  };

  const getAudioGenerationKey = (recordId: string, summaryOnly: boolean) => {
    return `${recordId}:${summaryOnly ? AUDIO_CONTENT_SUMMARY : AUDIO_CONTENT_FULL}`;
  };

  const isAudioGenerating = (recordId: string, summaryOnly: boolean) => {
    return !!audioGeneratingByRecord[getAudioGenerationKey(recordId, summaryOnly)];
  };

  const orderedAudioLanguages = useMemo(() => {
    const preferredCode = normalizeLanguageCode(preferredAudioLanguage);
    return [...supportedAudioLanguages].sort((a, b) => {
      const aPreferred = normalizeLanguageCode(a.code) === preferredCode ? 1 : 0;
      const bPreferred = normalizeLanguageCode(b.code) === preferredCode ? 1 : 0;
      return bPreferred - aPreferred;
    });
  }, [preferredAudioLanguage, supportedAudioLanguages]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.unloadAsync().catch(() => {});
      }
    };
  }, []);

  const loadCurrentUserId = async () => {
    const storedUserId = await SecureStore.getItemAsync("userId");
    if (storedUserId) {
      setCurrentUserId(storedUserId);
    }
  };

  const loadSupportedAudioLanguages = useCallback(async () => {
    try {
      const languages = await healthApi.getSupportedAudioLanguages();
      const backendLanguages = dedupeAudioLanguages(
        (languages || []).map((language) =>
          toAudioLanguageOption(
            language.code || language.name || DEFAULT_AUDIO_LANGUAGE,
            language.enabled !== false
          )
        )
      );

      const backendLanguageCodes = new Set(
        backendLanguages.map((language) => normalizeLanguageCode(language.code))
      );

      const catalogLanguages = AUDIO_LANGUAGE_CATALOG
        .filter((item) => !backendLanguageCodes.has(item.code))
        .map((item) => toAudioLanguageOption(item.code, true));

      const mergedLanguages = dedupeAudioLanguages([...backendLanguages, ...catalogLanguages]);
      if (mergedLanguages.length > 0) {
        setSupportedAudioLanguages(mergedLanguages);
      }
    } catch (error) {
      console.error("Error loading supported audio languages:", error);
      setSupportedAudioLanguages(
        dedupeAudioLanguages(
          AUDIO_LANGUAGE_CATALOG.map((item) => toAudioLanguageOption(item.code, true))
        )
      );
    }
  }, []);

  const loadRecords = useCallback(async () => {
    try {
      setTargetPatientName("");
      setTargetResolvedHealthId("");
      setRecordAudiosByRecord({});
      let data: HealthRecordDTO[] = [];
      if (targetHealthId) {
        data = await healthApi.getHealthRecordsByHealthId(targetHealthId);
        try {
          const healthID = await healthApi.getHealthIDByHealthId(targetHealthId);
          setTargetResolvedHealthId(healthID.healthId || targetHealthId);
          setPreferredAudioLanguage(normalizeLanguageCode(healthID.preferredLanguage));
          if (healthID.userId) {
            const users = await getUsersByIds([healthID.userId]);
            setTargetPatientName(users?.[0]?.name || users?.[0]?.username || "");
          }
        } catch {
          setTargetResolvedHealthId(targetHealthId);
          setPreferredAudioLanguage(DEFAULT_AUDIO_LANGUAGE);
        }
      } else {
        const userId = targetUserId || (await SecureStore.getItemAsync("userId"));
        if (!userId) return;
        data = await healthApi.getHealthTimeline(userId);
        if (targetUserId) {
          try {
            const users = await getUsersByIds([targetUserId]);
            setTargetPatientName(users?.[0]?.name || users?.[0]?.username || "");
            const healthID = await healthApi.getHealthIDByUserId(targetUserId);
            setTargetResolvedHealthId(healthID?.healthId || "");
            setPreferredAudioLanguage(normalizeLanguageCode(healthID?.preferredLanguage));
          } catch {
            setTargetResolvedHealthId("");
            setPreferredAudioLanguage(DEFAULT_AUDIO_LANGUAGE);
          }
        } else {
          setTargetPatientName("");
          setTargetResolvedHealthId("");
          try {
            const healthID = await healthApi.getHealthIDByUserId(userId);
            setPreferredAudioLanguage(normalizeLanguageCode(healthID?.preferredLanguage));
          } catch {
            setPreferredAudioLanguage(DEFAULT_AUDIO_LANGUAGE);
          }
        }
      }
      setRecords(data);
      setFilteredRecords(data);
    } catch (error) {
      console.error("Error loading records:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [targetHealthId, targetUserId]);

  const loadDoctorAccess = useCallback(async () => {
    if (!isDoctor || !targetHealthId || !currentUserId) {
      setDoctorCanModify(false);
      return;
    }
    try {
      const associations = await healthApi.getDoctorPatients(currentUserId);
      const connected = (associations || []).some(
        (association: any) =>
          String(association.patientHealthId || "").toUpperCase() === targetHealthId.toUpperCase()
      );
      setDoctorCanModify(connected);
    } catch {
      setDoctorCanModify(false);
    }
  }, [isDoctor, targetHealthId, currentUserId]);

  const filterRecords = useCallback(() => {
    let filtered = records;

    if (filterType !== "ALL") {
      filtered = filtered.filter((r) => r.recordType === filterType);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.doctorName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredRecords(filtered);
  }, [records, filterType, searchQuery]);

  useEffect(() => {
    loadRecords();
    loadCurrentUserId();
    loadSupportedAudioLanguages();
  }, [loadRecords, loadSupportedAudioLanguages, targetUserId, targetHealthId]);

  useEffect(() => {
    loadDoctorAccess();
  }, [loadDoctorAccess, isDoctor, currentUserId, targetHealthId]);

  useEffect(() => {
    filterRecords();
  }, [filterRecords]);

  const onRefresh = () => {
    setRefreshing(true);
    loadRecords();
  };

  const loadComments = async (recordId: string) => {
    setCommentsLoadingByRecord((prev) => ({ ...prev, [recordId]: true }));
    try {
      const comments = await healthApi.getHealthRecordComments(recordId);
      setCommentsByRecord((prev) => ({ ...prev, [recordId]: comments }));
    } catch (error: any) {
      showAlert("Error", error.message || "Failed to load comments");
    } finally {
      setCommentsLoadingByRecord((prev) => ({ ...prev, [recordId]: false }));
    }
  };

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const loadRecordAudios = async (recordId: string) => {
    setAudioLoadingByRecord((prev) => ({ ...prev, [recordId]: true }));
    try {
      const audios = await healthApi.getRecordAudios(recordId);
      setRecordAudiosByRecord((prev) => ({ ...prev, [recordId]: audios }));
    } catch (error) {
      console.error("Error loading record audios:", error);
    } finally {
      setAudioLoadingByRecord((prev) => ({ ...prev, [recordId]: false }));
    }
  };

  const mergeJobStatusIntoRecordAudio = (
    recordId: string,
    statusPayload: {
      jobId: string;
      language: string;
      contentType?: string;
      status: string;
      audioUrl?: string;
      audioFileName?: string;
      durationSeconds?: number;
      fileSizeBytes?: number;
      errorMessage?: string;
      requestedAt?: string;
      startedAt?: string;
      completedAt?: string;
    }
  ) => {
    setRecordAudiosByRecord((prev) => {
      const existing = prev[recordId] || [];
      const index = existing.findIndex((audio) => audio.jobId === statusPayload.jobId);
      const merged: HealthRecordAudioDTO = {
        ...(index >= 0 ? existing[index] : {}),
        jobId: statusPayload.jobId,
        healthRecordId: recordId,
        languageCode: normalizeLanguageCode(statusPayload.language || DEFAULT_AUDIO_LANGUAGE),
        contentType: normalizeAudioContentType(statusPayload.contentType),
        status: statusPayload.status,
        audioUrl: statusPayload.audioUrl,
        audioFileName: statusPayload.audioFileName,
        durationSeconds: statusPayload.durationSeconds,
        fileSizeBytes: statusPayload.fileSizeBytes,
        errorMessage: statusPayload.errorMessage,
        requestedAt: statusPayload.requestedAt,
        startedAt: statusPayload.startedAt,
        completedAt: statusPayload.completedAt,
      };

      if (index >= 0) {
        const next = [...existing];
        next[index] = merged;
        return { ...prev, [recordId]: next };
      }
      return { ...prev, [recordId]: [merged, ...existing] };
    });
  };

  const pollAudioJob = async (jobId: string, recordId: string, summaryOnly: boolean = false) => {
    const terminal = new Set(["COMPLETED", "FAILED"]);
    for (let attempt = 0; attempt < 30; attempt++) {
      const status = await healthApi.getAudioJobStatus(jobId);
      mergeJobStatusIntoRecordAudio(recordId, {
        jobId: status.jobId,
        language: status.language,
        contentType: status.contentType || (summaryOnly ? AUDIO_CONTENT_SUMMARY : AUDIO_CONTENT_FULL),
        status: status.status,
        audioUrl: status.audioUrl,
        audioFileName: status.audioFileName,
        durationSeconds: status.durationSeconds,
        fileSizeBytes: status.fileSizeBytes,
        errorMessage: status.errorMessage,
        requestedAt: status.requestedAt,
        startedAt: status.startedAt,
        completedAt: status.completedAt,
      });

      if (terminal.has(String(status.status).toUpperCase())) {
        break;
      }
      await delay(3000);
    }

    await loadRecordAudios(recordId);
  };

  const handleGenerateAudio = async (record: HealthRecordDTO, summaryOnly: boolean = false) => {
    const selectedLanguage = getSelectedLanguageForRecord(record.id);
    if (!isLanguageEnabled(selectedLanguage)) {
      showAlert(
        "Language Not Available",
        `${getLanguageLabel(selectedLanguage)} is not enabled for audio generation yet.`
      );
      return;
    }

    const generationKey = getAudioGenerationKey(record.id, summaryOnly);
    setAudioGeneratingByRecord((prev) => ({ ...prev, [generationKey]: true }));
    try {
      const generation = await healthApi.requestRecordAudioGeneration(record.id, {
        language: selectedLanguage,
        summaryOnly,
        includePdfContent: true,
        includeStructuredData: true,
        voicePreferences: { speed: 1.0 },
      });
      await pollAudioJob(generation.jobId, record.id, summaryOnly);
    } catch (error: any) {
      showAlert("Audio Generation Failed", error?.message || "Unable to generate audio");
    } finally {
      setAudioGeneratingByRecord((prev) => ({ ...prev, [generationKey]: false }));
    }
  };

  const stopPlayingAudio = async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.stopAsync();
      } catch {}
      try {
        await audioRef.current.unloadAsync();
      } catch {}
      audioRef.current = null;
    }
    setPlayingAudioJobId(null);
  };

  const handlePlayAudio = async (audio: HealthRecordAudioDTO) => {
    if (!audio.audioUrl) {
      showAlert("Audio Unavailable", "Audio URL is missing.");
      return;
    }

    if (playingAudioJobId === audio.jobId) {
      await stopPlayingAudio();
      return;
    }

    try {
      await stopPlayingAudio();
      const token =
        (await SecureStore.getItemAsync("jwt")) ||
        (await SecureStore.getItemAsync("accessToken"));
      const source = token
        ? { uri: audio.audioUrl, headers: { Authorization: `Bearer ${token}` } }
        : { uri: audio.audioUrl };
      const { sound } = await Audio.Sound.createAsync(
        source,
        { shouldPlay: true }
      );
      audioRef.current = sound;
      setPlayingAudioJobId(audio.jobId);
      sound.setOnPlaybackStatusUpdate((status: any) => {
        if (status?.isLoaded && status.didJustFinish) {
          sound.unloadAsync().catch(() => {});
          if (audioRef.current === sound) {
            audioRef.current = null;
          }
          setPlayingAudioJobId(null);
        }
      });
    } catch (error: any) {
      showAlert("Playback Failed", error?.message || "Unable to play audio");
      await stopPlayingAudio();
    }
  };

  const handleDeleteAudio = async (
    recordId: string,
    languageCode: string,
    summaryOnly: boolean = false
  ) => {
    try {
      await healthApi.deleteRecordAudio(recordId, languageCode, summaryOnly);
      await loadRecordAudios(recordId);
      if (playingAudioJobId) {
        await stopPlayingAudio();
      }
    } catch (error: any) {
      showAlert("Delete Failed", error?.message || "Unable to delete audio");
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds || seconds <= 0) return "-";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  const toggleExpand = (id: string) => {
    const willExpand = expandedId !== id;
    setExpandedId(willExpand ? id : null);
    if (willExpand) {
      setSelectedAudioLanguageByRecord((prev) =>
        prev[id]
          ? prev
          : { ...prev, [id]: normalizeLanguageCode(preferredAudioLanguage) }
      );
    }
    if (willExpand && !commentsByRecord[id]) {
      loadComments(id);
    }
    if (willExpand && !recordAudiosByRecord[id]) {
      loadRecordAudios(id);
    }
  };

  const handleEditRecord = (record: HealthRecordDTO) => {
    router.push({
      pathname: "/navigation/healthscreens/AddHealthRecordScreen",
      params: {
        recordId: record.id,
        ...(targetUserId ? { userId: targetUserId } : {}),
        ...(targetHealthId ? { healthId: targetHealthId } : {}),
      },
    });
  };

  const handleDeleteRecord = (record: HealthRecordDTO) => {
    showAlert("Delete Record", "Are you sure you want to delete this health record?", {
      cancelText: "Cancel",
      confirmText: "Delete",
      onConfirm: () => {
        void (async () => {
          try {
            if (!currentUserId) {
              throw new Error("Doctor session not found");
            }
            await healthApi.deleteHealthRecord(record.id, currentUserId);
            setRecords((prev) => prev.filter((r) => r.id !== record.id));
            setFilteredRecords((prev) => prev.filter((r) => r.id !== record.id));
          } catch (error: any) {
            showAlert("Failed", error.message || "Unable to delete record");
          }
        })();
      },
    });
  };

  const handleAddComment = async (recordId: string) => {
    const commentText = (commentDrafts[recordId] || "").trim();
    if (!commentText) {
      showAlert("Required", "Comment cannot be empty.");
      return;
    }
    if (!currentUserId) {
      showAlert("Error", "User session not found. Please login again.");
      return;
    }

    try {
      setCommentSubmittingRecordId(recordId);
      await healthApi.addHealthRecordComment(recordId, currentUserId, "MIGRANT", commentText);
      setCommentDrafts((prev) => ({ ...prev, [recordId]: "" }));
      await loadComments(recordId);
    } catch (error: any) {
      showAlert("Failed", error.message || "Unable to add comment");
    } finally {
      setCommentSubmittingRecordId(null);
    }
  };

  const handleOpenDocument = async (documentUrl?: string) => {
    if (!documentUrl) {
      return;
    }

    try {
      const supported = await Linking.canOpenURL(documentUrl);
      if (!supported) {
        showAlert("Cannot Open", "This document link is not supported on your device.");
        return;
      }
      await Linking.openURL(documentUrl);
    } catch (error: any) {
      showAlert("Open Failed", error?.message || "Unable to open document");
    }
  };

  const getRecordIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      CONSULTATION: "medical-services",
      PRESCRIPTION: "medication",
      LAB_TEST: "biotech",
      DIAGNOSIS: "assignment",
      VACCINATION: "vaccines",
      CHECKUP: "health-and-safety",
      EMERGENCY: "emergency",
      SURGERY: "local-hospital",
      ADMISSION: "meeting-room",
      DISCHARGE: "exit-to-app",
      OTHER: "description",
    };
    return icons[type] || "description";
  };

  const filterOptions = [
    "ALL",
    "CONSULTATION",
    "PRESCRIPTION",
    "LAB_TEST",
    "DIAGNOSIS",
    "VACCINATION",
    "CHECKUP",
    "EMERGENCY",
  ];

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
        {isInternalView ? (
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
            <MaterialIcons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ marginRight: 16 }}>
            <MaterialIcons name="menu" size={24} color={theme.text} />
          </TouchableOpacity>
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{isInternalView ? "Patient Records" : "Health Records"}</Text>
          {isInternalView ? (
            <>
              <Text style={[styles.headerSubtitle, { fontSize: 11 }]}>
                {targetPatientName || "Migrant"}
              </Text>
              <Text style={[styles.headerTitle, { fontSize: 22, color: theme.emergencyRed, marginTop: 2 }]}>
                {targetResolvedHealthId || targetHealthId || "HEALTH-ID"}
              </Text>
              <Text style={[styles.headerSubtitle, { fontSize: 11, marginTop: 2 }]}>{filteredRecords.length} records</Text>
            </>
          ) : (
            <Text style={styles.headerSubtitle}>{filteredRecords.length} records</Text>
          )}
        </View>
      </View>

      <View style={{ paddingHorizontal: 20, paddingVertical: 12, backgroundColor: theme.card }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
          <MaterialIcons name="search" size={20} color={theme.textSecondary} />
          <TextInput
            style={[styles.input, { flex: 1, marginLeft: 8, marginBottom: 0 }]}
            placeholder="Search records..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.badge,
                {
                  marginRight: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  backgroundColor: filterType === option ? theme.primary : theme.border + "40",
                },
              ]}
              onPress={() => setFilterType(option)}
            >
              <Text
                style={[
                  styles.badgeText,
                  {
                    color: filterType === option ? "#fff" : theme.text,
                    fontSize: 12,
                  },
                ]}
              >
                {option.replace("_", " ")}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {isInternalView && (
        <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4, backgroundColor: theme.card }}>
          <View
            style={{
              borderRadius: 10,
              borderWidth: 1,
              borderColor: theme.border,
              padding: 10,
              backgroundColor: theme.background,
            }}
          >
            <Text style={[styles.infoLabel, { marginBottom: 4 }]}>Patient Context</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={[styles.infoValue, { flex: 1 }]}>
                {targetPatientName || "Migrant"}{(targetResolvedHealthId || targetHealthId) ? ` • ${targetResolvedHealthId || targetHealthId}` : ""}
              </Text>
            </View>
            {isDoctor && (
              doctorCanModify ? (
                <Text style={[styles.cardSubtitle, { marginTop: 8 }]}>Use the floating + button to add a new record for this patient.</Text>
              ) : (
                <Text style={[styles.cardSubtitle, { marginTop: 8 }]}>
                  Connect with this migrant first to add or edit records.
                </Text>
              )
            )}
          </View>
        </View>
      )}

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filteredRecords.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={80} color={theme.textSecondary} style={styles.emptyStateIcon} />
            <Text style={styles.emptyStateText}>
              {searchQuery || filterType !== "ALL" ? "No matching records" : "No health records yet"}
            </Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery || filterType !== "ALL"
                ? "Try adjusting your search or filters"
                : "Your health records will appear here"}
            </Text>
          </View>
        ) : (
          <View style={styles.timelineContainer}>
            {filteredRecords.map((record, index) => (
              <View key={record.id} style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                {index < filteredRecords.length - 1 && <View style={styles.timelineLine} />}
                
                <TouchableOpacity
                  style={styles.timelineContent}
                  onPress={() => toggleExpand(record.id)}
                >
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.timelineDate}>
                        {new Date(record.recordDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </Text>
                      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                        <MaterialIcons
                          name={getRecordIcon(record.recordType) as any}
                          size={20}
                          color={theme.primary}
                        />
                        <Text style={[styles.timelineTitle, { marginLeft: 8 }]}>
                          {record.title}
                        </Text>
                      </View>
                    </View>
                    {record.isEmergency && (
                      <View style={[styles.badge, styles.emergencyBadge, { marginLeft: 8 }]}>
                        <Text style={[styles.badgeText, styles.emergencyBadgeText]}>
                          Emergency
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
                    <View
                      style={[
                        styles.badge,
                        { backgroundColor: theme.primary + "20", marginRight: 8 },
                      ]}
                    >
                      <Text style={[styles.badgeText, { color: theme.primary, fontSize: 10 }]}>
                        {record.recordType.replace("_", " ")}
                      </Text>
                    </View>
                    {record.doctorName && (
                      <Text style={[styles.timelineDescription, { fontSize: 12 }]}>
                        Dr. {record.doctorName}
                      </Text>
                    )}
                  </View>

                  {expandedId === record.id && (
                    <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: theme.border }}>
                      {record.description && (
                        <View style={{ marginBottom: 8 }}>
                          <Text style={[styles.infoLabel, { fontSize: 12 }]}>Description</Text>
                          <Text style={styles.timelineDescription}>{record.description}</Text>
                        </View>
                      )}

                      {record.diagnosis && (
                        <View style={{ marginBottom: 8 }}>
                          <Text style={[styles.infoLabel, { fontSize: 12 }]}>Diagnosis</Text>
                          <Text style={styles.timelineDescription}>{record.diagnosis}</Text>
                        </View>
                      )}

                      {record.prescription && (
                        <View style={{ marginBottom: 8 }}>
                          <Text style={[styles.infoLabel, { fontSize: 12 }]}>Prescription</Text>
                          <Text style={styles.timelineDescription}>{record.prescription}</Text>
                        </View>
                      )}

                      {record.testResults && (
                        <View style={{ marginBottom: 8 }}>
                          <Text style={[styles.infoLabel, { fontSize: 12 }]}>Test Results</Text>
                          <Text style={styles.timelineDescription}>{record.testResults}</Text>
                        </View>
                      )}

                      {record.hospitalName && (
                        <View style={{ marginBottom: 8 }}>
                          <Text style={[styles.infoLabel, { fontSize: 12 }]}>Hospital</Text>
                          <Text style={styles.timelineDescription}>
                            {record.hospitalName}
                            {record.hospitalLocation && ` - ${record.hospitalLocation}`}
                          </Text>
                        </View>
                      )}

                      {record.notes && (
                        <View style={{ marginBottom: 8 }}>
                          <Text style={[styles.infoLabel, { fontSize: 12 }]}>Notes</Text>
                          <Text style={styles.timelineDescription}>{record.notes}</Text>
                        </View>
                      )}

                      {record.documentUrl && (
                        <View style={{ marginBottom: 8 }}>
                          <Text style={[styles.infoLabel, { fontSize: 12 }]}>Document</Text>
                          <TouchableOpacity
                            style={[styles.badge, { alignSelf: "flex-start", backgroundColor: theme.primary + "20" }]}
                            onPress={() => handleOpenDocument(record.documentUrl)}
                          >
                            <Text style={[styles.badgeText, { color: theme.primary }]}>Open Attached Document</Text>
                          </TouchableOpacity>
                        </View>
                      )}

                      <View style={{ marginBottom: 8 }}>
                        <Text style={[styles.infoLabel, { fontSize: 12 }]}>Detailed Audio</Text>
                        {audioLoadingByRecord[record.id] ? (
                          <ActivityIndicator size="small" color={theme.primary} />
                        ) : (
                          <>
                            <View style={{ marginBottom: 10 }}>
                              <Text style={[styles.timelineDescription, { fontSize: 11, marginBottom: 6 }]}>
                                Preferred language: {getLanguageLabel(preferredAudioLanguage)}
                              </Text>
                              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {(orderedAudioLanguages || []).map((language) => {
                                  const code = normalizeLanguageCode(language.code);
                                  const selected = getSelectedLanguageForRecord(record.id) === code;
                                  const enabled = language.enabled !== false;
                                  return (
                                    <TouchableOpacity
                                      key={`${record.id}-${code}`}
                                      style={[
                                        styles.badge,
                                        {
                                          marginRight: 8,
                                          paddingHorizontal: 12,
                                          paddingVertical: 6,
                                          opacity: enabled ? 1 : 0.55,
                                          backgroundColor: selected
                                            ? theme.primary
                                            : enabled
                                            ? theme.border + "40"
                                            : theme.border + "20",
                                        },
                                      ]}
                                      onPress={() => {
                                        if (!enabled) return;
                                        setSelectedAudioLanguageByRecord((prev) => ({
                                          ...prev,
                                          [record.id]: code,
                                        }));
                                      }}
                                    >
                                      <Text
                                        style={[
                                          styles.badgeText,
                                          {
                                            color: selected ? "#fff" : theme.text,
                                            fontSize: 11,
                                          },
                                        ]}
                                      >
                                        {language.name}
                                      </Text>
                                    </TouchableOpacity>
                                  );
                                })}
                              </ScrollView>
                            </View>

                            {getAudiosForRecord(record.id, false).length === 0 ? (
                              <Text style={styles.timelineDescription}>
                                No detailed audio yet. Create a {getLanguageLabel(getSelectedLanguageForRecord(record.id))} detailed audio.
                              </Text>
                            ) : (
                              getAudiosForRecord(record.id, false).map((audio) => (
                                <View
                                  key={audio.jobId}
                                  style={{
                                    backgroundColor: theme.background,
                                    borderRadius: 8,
                                    padding: 10,
                                    marginBottom: 8,
                                  }}
                                >
                                  <Text style={styles.timelineDescription}>
                                    {getLanguageLabel(audio.languageCode)} • {audio.status}
                                  </Text>
                                  <Text style={[styles.timelineDescription, { fontSize: 11, marginTop: 4 }]}>
                                    Duration: {formatDuration(audio.durationSeconds)}{" "}
                                    {audio.fileSizeBytes ? `• ${Math.round(audio.fileSizeBytes / 1024)} KB` : ""}
                                  </Text>
                                  {!!audio.errorMessage && (
                                    <Text style={[styles.timelineDescription, { fontSize: 11, marginTop: 4, color: theme.error }]}>
                                      {audio.errorMessage}
                                    </Text>
                                  )}

                                  <View style={{ flexDirection: "row", marginTop: 10 }}>
                                    {audio.status === "COMPLETED" && (
                                      <TouchableOpacity
                                        style={[styles.button, { flex: 1, marginRight: 8 }]}
                                        onPress={() => handlePlayAudio(audio)}
                                      >
                                        <Text style={styles.buttonText}>
                                          {playingAudioJobId === audio.jobId ? "Stop" : "Play"}
                                        </Text>
                                      </TouchableOpacity>
                                    )}
                                    <TouchableOpacity
                                      style={[
                                        styles.button,
                                        { flex: 1, marginLeft: audio.status === "COMPLETED" ? 8 : 0, backgroundColor: theme.error },
                                      ]}
                                      onPress={() =>
                                        handleDeleteAudio(
                                          record.id,
                                          audio.languageCode || DEFAULT_AUDIO_LANGUAGE,
                                          false
                                        )
                                      }
                                    >
                                      <Text style={styles.buttonText}>Delete Audio</Text>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              ))
                            )}

                            <TouchableOpacity
                              style={[
                                styles.button,
                                {
                                  marginTop: 6,
                                  opacity:
                                    isAudioGenerating(record.id, false) ||
                                    !isLanguageEnabled(getSelectedLanguageForRecord(record.id))
                                      ? 0.7
                                      : 1,
                                },
                              ]}
                              disabled={
                                isAudioGenerating(record.id, false) ||
                                !isLanguageEnabled(getSelectedLanguageForRecord(record.id))
                              }
                              onPress={() => handleGenerateAudio(record, false)}
                            >
                              {isAudioGenerating(record.id, false) ? (
                                <ActivityIndicator color="#fff" />
                              ) : (
                                <Text style={styles.buttonText}>
                                  Generate {getLanguageLabel(getSelectedLanguageForRecord(record.id))} Detailed Audio
                                </Text>
                              )}
                            </TouchableOpacity>
                          </>
                        )}
                      </View>

                      <View style={{ marginBottom: 8 }}>
                        <Text style={[styles.infoLabel, { fontSize: 12 }]}>Summarized Audio (Groq Qwen)</Text>
                        {audioLoadingByRecord[record.id] ? (
                          <ActivityIndicator size="small" color={theme.primary} />
                        ) : (
                          <>
                            {getAudiosForRecord(record.id, true).length === 0 ? (
                              <Text style={styles.timelineDescription}>
                                No summarized audio yet. Create a {getLanguageLabel(getSelectedLanguageForRecord(record.id))} summary audio.
                              </Text>
                            ) : (
                              getAudiosForRecord(record.id, true).map((audio) => (
                                <View
                                  key={audio.jobId}
                                  style={{
                                    backgroundColor: theme.background,
                                    borderRadius: 8,
                                    padding: 10,
                                    marginBottom: 8,
                                  }}
                                >
                                  <Text style={styles.timelineDescription}>
                                    {getLanguageLabel(audio.languageCode)} â€¢ {audio.status}
                                  </Text>
                                  <Text style={[styles.timelineDescription, { fontSize: 11, marginTop: 4 }]}>
                                    Duration: {formatDuration(audio.durationSeconds)}{" "}
                                    {audio.fileSizeBytes ? `â€¢ ${Math.round(audio.fileSizeBytes / 1024)} KB` : ""}
                                  </Text>
                                  {!!audio.errorMessage && (
                                    <Text style={[styles.timelineDescription, { fontSize: 11, marginTop: 4, color: theme.error }]}>
                                      {audio.errorMessage}
                                    </Text>
                                  )}

                                  <View style={{ flexDirection: "row", marginTop: 10 }}>
                                    {audio.status === "COMPLETED" && (
                                      <TouchableOpacity
                                        style={[styles.button, { flex: 1, marginRight: 8 }]}
                                        onPress={() => handlePlayAudio(audio)}
                                      >
                                        <Text style={styles.buttonText}>
                                          {playingAudioJobId === audio.jobId ? "Stop" : "Play"}
                                        </Text>
                                      </TouchableOpacity>
                                    )}
                                    <TouchableOpacity
                                      style={[
                                        styles.button,
                                        { flex: 1, marginLeft: audio.status === "COMPLETED" ? 8 : 0, backgroundColor: theme.error },
                                      ]}
                                      onPress={() =>
                                        handleDeleteAudio(
                                          record.id,
                                          audio.languageCode || DEFAULT_AUDIO_LANGUAGE,
                                          true
                                        )
                                      }
                                    >
                                      <Text style={styles.buttonText}>Delete Summary</Text>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              ))
                            )}

                            <TouchableOpacity
                              style={[
                                styles.button,
                                {
                                  marginTop: 6,
                                  opacity:
                                    isAudioGenerating(record.id, true) ||
                                    !isLanguageEnabled(getSelectedLanguageForRecord(record.id))
                                      ? 0.7
                                      : 1,
                                },
                              ]}
                              disabled={
                                isAudioGenerating(record.id, true) ||
                                !isLanguageEnabled(getSelectedLanguageForRecord(record.id))
                              }
                              onPress={() => handleGenerateAudio(record, true)}
                            >
                              {isAudioGenerating(record.id, true) ? (
                                <ActivityIndicator color="#fff" />
                              ) : (
                                <Text style={styles.buttonText}>
                                  Generate {getLanguageLabel(getSelectedLanguageForRecord(record.id))} Summary Audio
                                </Text>
                              )}
                            </TouchableOpacity>
                          </>
                        )}
                      </View>

                      <View style={{ marginBottom: 8 }}>
                        <Text style={[styles.infoLabel, { fontSize: 12 }]}>Created At</Text>
                        <Text style={styles.timelineDescription}>
                          {record.createdAt ? new Date(record.createdAt).toLocaleString() : "-"}
                        </Text>
                      </View>

                      <View style={{ marginBottom: 8 }}>
                        <Text style={[styles.infoLabel, { fontSize: 12 }]}>Updated At</Text>
                        <Text style={styles.timelineDescription}>
                          {record.updatedAt ? new Date(record.updatedAt).toLocaleString() : "-"}
                        </Text>
                      </View>

                      <View style={{ marginBottom: 8 }}>
                        <Text style={[styles.infoLabel, { fontSize: 12 }]}>Migrant Comments</Text>
                        {commentsLoadingByRecord[record.id] ? (
                          <ActivityIndicator size="small" color={theme.primary} />
                        ) : (
                          <>
                            {(commentsByRecord[record.id] || []).length === 0 ? (
                              <Text style={styles.timelineDescription}>No comments yet</Text>
                            ) : (
                              (commentsByRecord[record.id] || []).map((comment) => (
                                <View
                                  key={comment.id}
                                  style={{
                                    backgroundColor: theme.background,
                                    borderRadius: 8,
                                    padding: 10,
                                    marginBottom: 8,
                                  }}
                                >
                                  <Text style={styles.timelineDescription}>{comment.comment}</Text>
                                  <Text style={[styles.timelineDescription, { fontSize: 11, marginTop: 4 }]}>
                                    {comment.userRole} • {new Date(comment.updatedAt || comment.createdAt).toLocaleString()}
                                  </Text>
                                </View>
                              ))
                            )}
                          </>
                        )}
                      </View>

                      {isMigrant && (
                        <View style={{ marginTop: 8 }}>
                          <TextInput
                            style={[styles.input, { marginBottom: 8 }]}
                            placeholder="Add your comment for the doctor..."
                            placeholderTextColor={theme.textSecondary}
                            value={commentDrafts[record.id] || ""}
                            onChangeText={(value) =>
                              setCommentDrafts((prev) => ({ ...prev, [record.id]: value }))
                            }
                          />
                          <TouchableOpacity
                            style={[styles.button, commentSubmittingRecordId === record.id && { opacity: 0.7 }]}
                            disabled={commentSubmittingRecordId === record.id}
                            onPress={() => handleAddComment(record.id)}
                          >
                            {commentSubmittingRecordId === record.id ? (
                              <ActivityIndicator color="#fff" />
                            ) : (
                              <Text style={styles.buttonText}>Post Comment</Text>
                            )}
                          </TouchableOpacity>
                        </View>
                      )}

                      {canShowDoctorActions && (
                        <View style={{ flexDirection: "row", marginTop: 12 }}>
                          <TouchableOpacity
                            style={[styles.button, { flex: 1, marginRight: 8 }]}
                            onPress={() => handleEditRecord(record)}
                          >
                            <Text style={styles.buttonText}>Edit</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.button, { flex: 1, marginLeft: 8, backgroundColor: theme.error }]}
                            onPress={() => handleDeleteRecord(record)}
                          >
                            <Text style={styles.buttonText}>Delete</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  )}

                  <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 8 }}>
                    <Text style={[styles.timelineDescription, { fontSize: 11 }]}>
                      {expandedId === record.id ? "Tap to collapse" : "Tap to expand"}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={closeAlert}
        onConfirm={alertOnConfirm}
        confirmText={alertConfirmText}
        cancelText={alertCancelText}
      />

      {isInternalView && isDoctor && doctorCanModify && (
        <TouchableOpacity
          style={{
            position: "absolute",
            right: 20,
            bottom: 28,
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: theme.primary,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: theme.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.35,
            shadowRadius: 8,
            elevation: 10,
          }}
          onPress={() =>
            router.push({
              pathname: "/navigation/healthscreens/AddHealthRecordScreen",
              params: {
                ...(targetUserId ? { userId: targetUserId } : {}),
                ...(targetHealthId ? { healthId: targetHealthId } : {}),
              },
            })
          }
        >
          <MaterialIcons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      )}
      {!isInternalView && <SidebarMenu isVisible={menuVisible} onClose={() => setMenuVisible(false)} />}
    </View>
  );
}

