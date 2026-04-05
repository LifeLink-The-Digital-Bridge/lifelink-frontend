import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

const BASE_URL = Constants.expoConfig?.extra?.API_URL;
const API_BASE = `${BASE_URL}/api`;
const HEALTH_RECORDS_BASE = `${API_BASE}/health`;
const HEALTH_ID_BASE = `${API_BASE}/health-id`;
const MIGRANT_PROFILE_BASE = `${API_BASE}/migrant-profile`;
const DOCTOR_PATIENT_ASSOC_BASE = `${API_BASE}/associations/doctor-patient`;
const NGO_MIGRANT_ASSOC_BASE = `${API_BASE}/associations/ngo-migrant`;
const CONNECTION_REQUESTS_BASE = `${API_BASE}/connection-requests`;

export interface ConnectionRequestDTO {
  id: string;
  requesterUserId: string;
  requesterRole: string;
  targetUserId: string;
  targetRole: string;
  requestType: string;
  status: string;
  message?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHealthIDRequest {
  userId: string;
  bloodGroup: string;
  rhFactor?: string;
  allergies?: string;
  chronicConditions?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyPin: string;
  heightCm?: number;
  weightKg?: number;
  currentMedications?: string;
  vaccinationStatus?: string;
  medicalHistory?: string;
  hasChronicDiseases?: boolean;
  hasDiabetes?: boolean;
  bloodPressure?: string;
  hemoglobinLevel?: number;
  lastCheckupDate?: string;
  currentCity?: string;
  currentState?: string;
  occupation?: string;
  preferredLanguage?: string;
}

export interface HealthIDDTO {
  id: string;
  userId: string;
  healthId: string;
  qrCodeData: string;
  bloodGroup: string;
  rhFactor?: string;
  allergies?: string;
  chronicConditions?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  heightCm?: number;
  weightKg?: number;
  currentMedications?: string;
  vaccinationStatus?: string;
  medicalHistory?: string;
  hasChronicDiseases?: boolean;
  hasDiabetes?: boolean;
  bloodPressure?: string;
  hemoglobinLevel?: number;
  creatinineLevel?: number;
  lastCheckupDate?: string;
  currentCity?: string;
  currentState?: string;
  occupation?: string;
  preferredLanguage?: string;
  isActive?: boolean;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface HealthRecordRequest {
  userId: string;
  healthId?: string;
  recordType: string;
  title: string;
  description?: string;
  diagnosis?: string;
  prescription?: string;
  testResults?: string;
  doctorName?: string;
  doctorId?: string;
  hospitalName?: string;
  hospitalLocation?: string;
  recordDate: string;
  documentUrl?: string;
  isEmergency?: boolean;
  notes?: string;
}

export interface HealthRecordDTO {
  id: string;
  userId: string;
  healthId?: string;
  recordType: string;
  title: string;
  description?: string;
  diagnosis?: string;
  prescription?: string;
  testResults?: string;
  doctorName?: string;
  doctorId?: string;
  hospitalName?: string;
  hospitalLocation?: string;
  recordDate: string;
  documentUrl?: string;
  isEmergency: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HealthRecordCommentDTO {
  id: string;
  healthRecordId: string;
  userId: string;
  userRole: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentUploadResponse {
  documentUrl: string;
  fileName: string;
  contentType: string;
  size: number;
  uploadedAt: string;
}

export interface SdgDashboardDTO {
  totalUsers: number;
  totalMigrants: number;
  totalDoctors: number;
  totalNGOs: number;
  totalHealthIds: number;
  totalHealthRecords: number;
  emergencyRecords: number;
  activeDoctorPatientConnections: number;
  activeNgoMigrantConnections: number;
  newUsersThisMonth: number;
  newHealthRecordsThisMonth: number;
  migrantHealthIdCoveragePercent: number;
  stateDistribution: Record<string, number>;
  sdgScorecard: Record<string, number>;
}

export interface MigrantRiskScoreDTO {
  id: string;
  userId: string;
  healthId: string;
  riskScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | string;
  topFactors: string[];
  recommendedActions: string[];
  modelVersion?: string;
  computedAt?: string;
  updatedAt?: string;
}

export interface MissingHealthFieldDTO {
  key: string;
  label: string;
  status: "MISSING" | "INCOMPLETE" | "STALE" | string;
  priority: "HIGH" | "MEDIUM" | "LOW" | string;
  whyImportant: string;
  recommendedAction: string;
}

export interface MigrantRiskInsightsDTO {
  userId: string;
  healthId: string;
  riskScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | string;
  topFactors: string[];
  recommendedActions: string[];
  missingHealthFields: MissingHealthFieldDTO[];
  statusSummary: string;
  improvementSteps: string[];
  priorityChecklist: string[];
  dataSources?: string[];
  recordsAnalyzed?: number;
  pdfSourcesAnalyzed?: number;
  evidencePreview?: string[];
  safetyNotice: string;
  modelVersion: string;
  generatedAt: string;
  language: string;
}

export interface RiskAssistantHistoryMessageDTO {
  role: "user" | "assistant";
  content: string;
}

export interface RiskAssistantChatRequestDTO {
  message: string;
  language?: string;
  history?: RiskAssistantHistoryMessageDTO[];
}

export interface RiskAssistantChatResponseDTO {
  userId: string;
  answer: string;
  suggestedNextSteps: string[];
  dataSources?: string[];
  recordsAnalyzed?: number;
  pdfSourcesAnalyzed?: number;
  evidencePreview?: string[];
  safetyNotice: string;
  modelVersion: string;
  generatedAt: string;
  language: string;
}

export interface MigrantProfileDTO {
  id?: string;
  userId: string;
  healthId?: string;
  bloodGroup?: string;
  heightCm?: number;
  weightKg?: number;
  allergies?: string;
  chronicConditions?: string;
  currentMedications?: string;
  vaccinationStatus?: string;
  healthRiskScore?: string;
  lastCheckupDate?: string;
}

export interface AudioGenerationRequest {
  language?: string;
  summaryOnly?: boolean;
  includePdfContent?: boolean;
  includeStructuredData?: boolean;
  voicePreferences?: {
    speed?: number;
  };
}

export interface AudioGenerationResponse {
  jobId: string;
  recordId: string;
  language: string;
  contentType?: "FULL" | "SUMMARY" | string;
  status: string;
}

export interface HealthRecordAudioDTO {
  jobId: string;
  healthRecordId: string;
  languageCode: string;
  contentType?: "FULL" | "SUMMARY" | string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | string;
  audioUrl?: string;
  audioFileName?: string;
  durationSeconds?: number;
  fileSizeBytes?: number;
  sourceType?: string;
  errorMessage?: string;
  requestedAt?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface AudioJobStatusResponse {
  jobId: string;
  healthRecordId: string;
  language: string;
  contentType?: "FULL" | "SUMMARY" | string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | string;
  audioUrl?: string;
  audioFileName?: string;
  durationSeconds?: number;
  fileSizeBytes?: number;
  errorMessage?: string;
  requestedAt?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface AudioLanguageDTO {
  code: string;
  name: string;
  enabled: boolean;
}

const getAuthHeaders = async () => {
  const token =
    (await SecureStore.getItemAsync("jwt")) ||
    (await SecureStore.getItemAsync("accessToken"));
  if (!token) throw new Error("Not authenticated");

  const userId = await SecureStore.getItemAsync("userId");
  const storedRoles = await SecureStore.getItemAsync("roles");
  let rolesHeader = "";
  let roleHeader = "";
  if (storedRoles) {
    try {
      const parsed = JSON.parse(storedRoles) as string[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        const normalizedRoles = parsed
          .map((role) => String(role || "").trim().toUpperCase().replace(/^ROLE_/, ""))
          .filter((role) => role.length > 0);
        rolesHeader = normalizedRoles.join(",");
        if (normalizedRoles.includes("DOCTOR")) {
          roleHeader = "DOCTOR";
        } else if (normalizedRoles.includes("NGO")) {
          roleHeader = "NGO";
        } else if (normalizedRoles.includes("MIGRANT")) {
          roleHeader = "MIGRANT";
        } else {
          roleHeader = normalizedRoles[0];
        }
      }
    } catch {
      roleHeader = "";
    }
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...(userId ? { id: userId } : {}),
    ...(rolesHeader ? { roles: rolesHeader } : {}),
    ...(roleHeader ? { role: roleHeader } : {}),
  };
};

const getAuthUploadHeaders = async () => {
  const token =
    (await SecureStore.getItemAsync("jwt")) ||
    (await SecureStore.getItemAsync("accessToken"));
  if (!token) throw new Error("Not authenticated");

  const userId = await SecureStore.getItemAsync("userId");
  const storedRoles = await SecureStore.getItemAsync("roles");
  let rolesHeader = "";
  let roleHeader = "";
  if (storedRoles) {
    try {
      const parsed = JSON.parse(storedRoles) as string[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        const normalizedRoles = parsed
          .map((role) => String(role || "").trim().toUpperCase().replace(/^ROLE_/, ""))
          .filter((role) => role.length > 0);
        rolesHeader = normalizedRoles.join(",");
        if (normalizedRoles.includes("DOCTOR")) {
          roleHeader = "DOCTOR";
        } else if (normalizedRoles.includes("NGO")) {
          roleHeader = "NGO";
        } else if (normalizedRoles.includes("MIGRANT")) {
          roleHeader = "MIGRANT";
        } else {
          roleHeader = normalizedRoles[0];
        }
      }
    } catch {
      roleHeader = "";
    }
  }

  return {
    Authorization: `Bearer ${token}`,
    ...(userId ? { id: userId } : {}),
    ...(rolesHeader ? { roles: rolesHeader } : {}),
    ...(roleHeader ? { role: roleHeader } : {}),
  };
};

const parseErrorMessage = async (response: Response, fallback: string) => {
  try {
    const data = await response.json();
    return data?.message || fallback;
  } catch {
    return fallback;
  }
};

const normalizeHealthRecord = (record: any): HealthRecordDTO => {
  const normalizedEmergency =
    typeof record?.isEmergency === "boolean"
      ? record.isEmergency
      : typeof record?.emergency === "boolean"
      ? record.emergency
      : false;

  return {
    ...record,
    isEmergency: normalizedEmergency,
  } as HealthRecordDTO;
};

const normalizeHealthRecords = (records: any[]): HealthRecordDTO[] => {
  return (records || []).map((record) => normalizeHealthRecord(record));
};

const normalizeAudioUrl = (url?: string): string | undefined => {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  if (!BASE_URL) return url;
  return url.startsWith("/") ? `${BASE_URL}${url}` : `${BASE_URL}/${url}`;
};

const normalizeLocalDateTime = (value?: string): string | undefined => {
  if (!value) return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return `${value}T00:00:00`;
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return `${value}:00`;
  return value;
};

export const healthApi = {
  async getSupportedAudioLanguages(): Promise<AudioLanguageDTO[]> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${HEALTH_RECORDS_BASE}/records/audio/languages`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response, "Failed to fetch audio languages");
      throw new Error(message);
    }

    return response.json();
  },

  async requestRecordAudioGeneration(
    recordId: string,
    request: AudioGenerationRequest = {}
  ): Promise<AudioGenerationResponse> {
    const headers = await getAuthHeaders();
    const payload: AudioGenerationRequest = {
      language: request.language || "en",
      summaryOnly: request.summaryOnly ?? false,
      includePdfContent: request.includePdfContent ?? true,
      includeStructuredData: request.includeStructuredData ?? true,
      voicePreferences: {
        speed: request.voicePreferences?.speed ?? 1.0,
      },
    };

    const response = await fetch(`${HEALTH_RECORDS_BASE}/records/${recordId}/audio/generate`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response, "Failed to request audio generation");
      throw new Error(message);
    }

    return response.json();
  },

  async getRecordAudios(recordId: string): Promise<HealthRecordAudioDTO[]> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${HEALTH_RECORDS_BASE}/records/${recordId}/audio`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response, "Failed to fetch record audios");
      throw new Error(message);
    }

    const data = (await response.json()) as HealthRecordAudioDTO[];
    return (data || []).map((item) => ({
      ...item,
      audioUrl: normalizeAudioUrl(item.audioUrl),
    }));
  },

  async getAudioJobStatus(jobId: string): Promise<AudioJobStatusResponse> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${HEALTH_RECORDS_BASE}/records/audio/jobs/${jobId}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response, "Failed to fetch audio job status");
      throw new Error(message);
    }

    const data = (await response.json()) as AudioJobStatusResponse;
    return {
      ...data,
      audioUrl: normalizeAudioUrl(data.audioUrl),
    };
  },

  async deleteRecordAudio(recordId: string, language: string, summaryOnly: boolean = false): Promise<void> {
    const headers = await getAuthHeaders();
    const query = summaryOnly ? "?summaryOnly=true" : "";
    const response = await fetch(`${HEALTH_RECORDS_BASE}/records/${recordId}/audio/${encodeURIComponent(language)}${query}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response, "Failed to delete record audio");
      throw new Error(message);
    }
  },

  async uploadHealthRecordDocument(file: {
    uri: string;
    name: string;
    type?: string;
  }): Promise<DocumentUploadResponse> {
    const headers = await getAuthUploadHeaders();
    const formData = new FormData();
    formData.append("file", {
      uri: file.uri,
      name: file.name,
      type: file.type || "application/octet-stream",
    } as any);

    const response = await fetch(`${HEALTH_RECORDS_BASE}/records/upload-document`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response, "Failed to upload document");
      throw new Error(message);
    }

    const data = (await response.json()) as DocumentUploadResponse;
    if (data.documentUrl && !/^https?:\/\//i.test(data.documentUrl) && BASE_URL) {
      data.documentUrl = `${BASE_URL}${data.documentUrl}`;
    }
    return data;
  },

  async getAdminSdgDashboard(): Promise<SdgDashboardDTO> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE}/admin/sdg-dashboard`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response, "Failed to fetch SDG dashboard");
      throw new Error(message);
    }

    return response.json();
  },

  async getLatestRiskScore(userId: string): Promise<MigrantRiskScoreDTO> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${HEALTH_RECORDS_BASE}/risk/${userId}/latest`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response, "Failed to fetch latest risk score");
      throw new Error(message);
    }

    return response.json();
  },

  async triggerRiskCompute(userId: string, trigger: string = "MANUAL"): Promise<{ success: boolean; status: string }> {
    const headers = await getAuthHeaders();
    const response = await fetch(
      `${HEALTH_RECORDS_BASE}/risk/${userId}/compute?trigger=${encodeURIComponent(trigger)}`,
      {
        method: "POST",
        headers,
      }
    );

    if (!response.ok) {
      const message = await parseErrorMessage(response, "Failed to trigger risk computation");
      throw new Error(message);
    }

    return response.json();
  },

  async getRiskInsights(userId: string, language: string = "en"): Promise<MigrantRiskInsightsDTO> {
    const headers = await getAuthHeaders();
    const response = await fetch(
      `${HEALTH_RECORDS_BASE}/risk/${userId}/insights?language=${encodeURIComponent(language)}`,
      {
        method: "GET",
        headers,
      }
    );

    if (!response.ok) {
      const message = await parseErrorMessage(response, "Failed to fetch risk insights");
      throw new Error(message);
    }

    return response.json();
  },

  async askRiskAssistant(userId: string, request: RiskAssistantChatRequestDTO): Promise<RiskAssistantChatResponseDTO> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${HEALTH_RECORDS_BASE}/risk/${userId}/assistant/chat`, {
      method: "POST",
      headers,
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response, "Failed to get assistant response");
      throw new Error(message);
    }

    return response.json();
  },

  async createHealthID(request: CreateHealthIDRequest): Promise<HealthIDDTO> {
    const headers = await getAuthHeaders();
    const payload: CreateHealthIDRequest = {
      ...request,
      lastCheckupDate: normalizeLocalDateTime(request.lastCheckupDate),
    };
    const response = await fetch(`${HEALTH_ID_BASE}`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response, "Failed to create Health ID");
      throw new Error(message);
    }

    return response.json();
  },

  async updateHealthID(healthId: string, request: CreateHealthIDRequest): Promise<HealthIDDTO> {
    const headers = await getAuthHeaders();
    const payload: CreateHealthIDRequest = {
      ...request,
      lastCheckupDate: normalizeLocalDateTime(request.lastCheckupDate),
    };
    const response = await fetch(`${HEALTH_ID_BASE}/${healthId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response, "Failed to update Health ID");
      throw new Error(message);
    }

    return response.json();
  },

  async getHealthIDByUserId(userId: string): Promise<HealthIDDTO | null> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${HEALTH_ID_BASE}/user/${userId}`, {
      headers,
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      const message = await parseErrorMessage(response, "Failed to fetch Health ID");
      throw new Error(message);
    }

    return response.json();
  },

  async getHealthIDByHealthId(healthId: string): Promise<HealthIDDTO> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${HEALTH_ID_BASE}/${healthId}`, {
      headers,
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response, "Failed to fetch Health ID");
      throw new Error(message);
    }

    return response.json();
  },

  async getQRCode(healthId: string): Promise<{ qrCode: string; healthId: string }> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${HEALTH_ID_BASE}/${healthId}/qr`, {
      headers,
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response, "Failed to fetch QR code");
      throw new Error(message);
    }

    return response.json();
  },

  async verifyEmergencyAccess(healthId: string, pin: string): Promise<boolean> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${HEALTH_ID_BASE}/${healthId}/verify-emergency`, {
      method: "POST",
      headers,
      body: JSON.stringify({ pin }),
    });

    if (!response.ok) {
      return false;
    }

    const result = await response.json();
    return result.verified;
  },

  async createHealthRecord(request: HealthRecordRequest): Promise<HealthRecordDTO> {
    const headers = await getAuthHeaders();
    const payload = {
      ...request,
      emergency: request.isEmergency ?? false,
      isEmergency: request.isEmergency ?? false,
    };
    const response = await fetch(`${HEALTH_RECORDS_BASE}/records`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response, "Failed to create health record");
      throw new Error(message);
    }

    const data = await response.json();
    return normalizeHealthRecord(data);
  },

  async getHealthRecordById(recordId: string): Promise<HealthRecordDTO> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${HEALTH_RECORDS_BASE}/records/${recordId}`, {
      headers,
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response, "Failed to fetch health record");
      throw new Error(message);
    }

    const data = await response.json();
    return normalizeHealthRecord(data);
  },

  async updateHealthRecord(recordId: string, request: HealthRecordRequest): Promise<HealthRecordDTO> {
    const headers = await getAuthHeaders();
    const payload = {
      ...request,
      emergency: request.isEmergency ?? false,
      isEmergency: request.isEmergency ?? false,
    };
    const response = await fetch(`${HEALTH_RECORDS_BASE}/records/${recordId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response, "Failed to update health record");
      throw new Error(message);
    }

    const data = await response.json();
    return normalizeHealthRecord(data);
  },

  async deleteHealthRecord(recordId: string, doctorId: string): Promise<void> {
    const headers = await getAuthHeaders();
    const response = await fetch(
      `${HEALTH_RECORDS_BASE}/records/${recordId}?doctorId=${encodeURIComponent(doctorId)}`,
      {
        method: "DELETE",
        headers,
      }
    );

    if (!response.ok) {
      const message = await parseErrorMessage(response, "Failed to delete health record");
      throw new Error(message);
    }
  },

  async getHealthRecordComments(recordId: string): Promise<HealthRecordCommentDTO[]> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${HEALTH_RECORDS_BASE}/records/${recordId}/comments`, {
      headers,
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response, "Failed to fetch record comments");
      throw new Error(message);
    }

    return response.json();
  },

  async addHealthRecordComment(
    recordId: string,
    userId: string,
    userRole: string,
    comment: string
  ): Promise<HealthRecordCommentDTO> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${HEALTH_RECORDS_BASE}/records/${recordId}/comments`, {
      method: "POST",
      headers,
      body: JSON.stringify({ userId, userRole, comment }),
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response, "Failed to add record comment");
      throw new Error(message);
    }

    return response.json();
  },

  async getHealthRecordsByUserId(userId: string): Promise<HealthRecordDTO[]> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${HEALTH_RECORDS_BASE}/records/user/${userId}`, {
      headers,
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response, "Failed to fetch health records");
      throw new Error(message);
    }

    const data = await response.json();
    return normalizeHealthRecords(data);
  },

  async getHealthRecordsByHealthId(healthId: string): Promise<HealthRecordDTO[]> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${HEALTH_RECORDS_BASE}/records/health-id/${healthId}`, {
      headers,
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response, "Failed to fetch health records");
      throw new Error(message);
    }

    const data = await response.json();
    return normalizeHealthRecords(data);
  },

  async getHealthTimeline(userId: string): Promise<HealthRecordDTO[]> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${HEALTH_RECORDS_BASE}/records/user/${userId}/timeline`, {
      headers,
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response, "Failed to fetch health timeline");
      throw new Error(message);
    }

    const data = await response.json();
    return normalizeHealthRecords(data);
  },

  async getEmergencyRecords(userId: string): Promise<HealthRecordDTO[]> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${HEALTH_RECORDS_BASE}/records/user/${userId}/emergency`, {
      headers,
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response, "Failed to fetch emergency records");
      throw new Error(message);
    }

    const data = await response.json();
    return normalizeHealthRecords(data);
  },

  async getDoctorEmergencyRecords(doctorId: string): Promise<HealthRecordDTO[]> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${HEALTH_RECORDS_BASE}/records/doctor/${doctorId}/emergency`, {
      headers,
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response, "Failed to fetch doctor emergency records");
      throw new Error(message);
    }

    const data = await response.json();
    return normalizeHealthRecords(data);
  },

  async getNGOEmergencyRecords(ngoId: string): Promise<HealthRecordDTO[]> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${HEALTH_RECORDS_BASE}/records/ngo/${ngoId}/emergency`, {
      headers,
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response, "Failed to fetch NGO emergency records");
      throw new Error(message);
    }

    const data = await response.json();
    return normalizeHealthRecords(data);
  },

  async createMigrantProfile(profile: MigrantProfileDTO): Promise<MigrantProfileDTO> {
    const headers = await getAuthHeaders();
    const payload: MigrantProfileDTO = {
      ...profile,
      lastCheckupDate: normalizeLocalDateTime(profile.lastCheckupDate),
    };
    const response = await fetch(`${MIGRANT_PROFILE_BASE}`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response, "Failed to create migrant profile");
      throw new Error(message);
    }

    return response.json();
  },

  async getMigrantProfileByUserId(userId: string): Promise<MigrantProfileDTO> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${MIGRANT_PROFILE_BASE}/user/${userId}`, {
      headers,
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response, "Failed to fetch migrant profile");
      throw new Error(message);
    }

    return response.json();
  },

  async updateMigrantProfile(userId: string, profile: MigrantProfileDTO): Promise<MigrantProfileDTO> {
    const headers = await getAuthHeaders();
    const payload: MigrantProfileDTO = {
      ...profile,
      lastCheckupDate: normalizeLocalDateTime(profile.lastCheckupDate),
    };
    const response = await fetch(`${MIGRANT_PROFILE_BASE}/user/${userId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response, "Failed to update migrant profile");
      throw new Error(message);
    }

    return response.json();
  },

  async createDoctorPatientAssociation(
    doctorId: string,
    patientHealthId: string,
    notes?: string
  ): Promise<any> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${DOCTOR_PATIENT_ASSOC_BASE}`, {
      method: "POST",
      headers,
      body: JSON.stringify({ doctorId, patientHealthId, notes }),
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response, "Failed to create doctor-patient association");
      throw new Error(message);
    }

    return response.json();
  },

  async getDoctorPatients(doctorId: string): Promise<any[]> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${DOCTOR_PATIENT_ASSOC_BASE}/doctor/${doctorId}/patients`, {
      headers,
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response, "Failed to fetch doctor's patients");
      throw new Error(message);
    }

    return response.json();
  },

  async getPatientDoctors(patientHealthId: string): Promise<any[]> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${DOCTOR_PATIENT_ASSOC_BASE}/patient/${patientHealthId}/doctors`, {
      headers,
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response, "Failed to fetch patient's doctors");
      throw new Error(message);
    }

    return response.json();
  },

  async getDoctorPatientCount(doctorId: string): Promise<{ totalPatients: number }> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${DOCTOR_PATIENT_ASSOC_BASE}/doctor/${doctorId}/count`, {
      headers,
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response, "Failed to fetch patient count");
      throw new Error(message);
    }

    return response.json();
  },

  async createNGOMigrantAssociation(data: {
    ngoId: string;
    migrantHealthId: string;
    supportType: string;
    status: string;
    description?: string;
  }): Promise<any> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${NGO_MIGRANT_ASSOC_BASE}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response, "Failed to create NGO-migrant association");
      throw new Error(message);
    }

    return response.json();
  },

  async getNGOMigrants(ngoId: string): Promise<any[]> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${NGO_MIGRANT_ASSOC_BASE}/ngo/${ngoId}/migrants`, {
      headers,
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response, "Failed to fetch NGO's migrants");
      throw new Error(message);
    }

    return response.json();
  },

  async getMigrantNGOs(migrantHealthId: string): Promise<any[]> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${NGO_MIGRANT_ASSOC_BASE}/migrant/${migrantHealthId}/ngos`, {
      headers,
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response, "Failed to fetch migrant's NGOs");
      throw new Error(message);
    }

    return response.json();
  },

  async getNGOMigrantCount(ngoId: string): Promise<{ totalMigrants: number }> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${NGO_MIGRANT_ASSOC_BASE}/ngo/${ngoId}/count`, {
      headers,
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response, "Failed to fetch migrant count");
      throw new Error(message);
    }

    return response.json();
  },

  async updateNGOMigrantAssociation(
    associationId: string,
    status?: string,
    notes?: string
  ): Promise<any> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${NGO_MIGRANT_ASSOC_BASE}/${associationId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ status, notes }),
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response, "Failed to update association");
      throw new Error(message);
    }

    return response.json();
  },

  async enrollAsDonor(additionalData: Record<string, any> = {}): Promise<any> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE}/health-profile/enroll-as-donor`, {
      method: "POST",
      headers,
      body: JSON.stringify(additionalData),
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response, "Failed to enroll as donor");
      throw new Error(message);
    }
    return response.json();
  },

  async enrollAsRecipient(additionalData: Record<string, any> = {}): Promise<any> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE}/health-profile/enroll-as-recipient`, {
      method: "POST",
      headers,
      body: JSON.stringify(additionalData),
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response, "Failed to enroll as recipient");
      throw new Error(message);
    }
    return response.json();
  },

  async sendConnectionRequest(
    targetUserId: string,
    targetRole: string,
    requestType: string,
    message?: string,
    requesterRoleOverride?: string
  ): Promise<ConnectionRequestDTO> {
    const headers = await getAuthHeaders();
    const requestHeaders =
      requesterRoleOverride && requesterRoleOverride.trim()
        ? { ...headers, role: requesterRoleOverride.trim().toUpperCase() }
        : headers;
    const response = await fetch(`${CONNECTION_REQUESTS_BASE}`, {
      method: "POST",
      headers: requestHeaders,
      body: JSON.stringify({
        targetUserId,
        targetRole,
        requestType,
        message,
      }),
    });

    if (!response.ok) {
      const errMsg = await parseErrorMessage(response, "Failed to send connection request");
      throw new Error(errMsg);
    }
    return response.json();
  },

  async getIncomingRequests(userId: string): Promise<ConnectionRequestDTO[]> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${CONNECTION_REQUESTS_BASE}/incoming/${userId}`, { headers });
    if (!response.ok) {
      const errMsg = await parseErrorMessage(response, "Failed to fetch incoming requests");
      throw new Error(errMsg);
    }
    return response.json();
  },

  async acceptConnectionRequest(requestId: string, userId: string): Promise<ConnectionRequestDTO> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${CONNECTION_REQUESTS_BASE}/${requestId}/accept`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ userId }),
    });
    if (!response.ok) {
      const errMsg = await parseErrorMessage(response, "Failed to accept request");
      throw new Error(errMsg);
    }
    return response.json();
  },

  async rejectConnectionRequest(requestId: string, userId: string): Promise<ConnectionRequestDTO> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${CONNECTION_REQUESTS_BASE}/${requestId}/reject`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ userId }),
    });
    if (!response.ok) {
      const errMsg = await parseErrorMessage(response, "Failed to reject request");
      throw new Error(errMsg);
    }
    return response.json();
  },
};
