import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { setRuntimeLanguage, translateUiText } from "./language-runtime";

export type AppLanguage =
  | "en"
  | "te"
  | "ta"
  | "hi"
  | "ml"
  | "kn"
  | "bn"
  | "mr"
  | "gu"
  | "pa"
  | "or"
  | "ur";

type TranslationParams = Record<string, string | number>;
type TranslateFn = (key: string, params?: TranslationParams) => string;

interface LanguageContextType {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => Promise<void>;
  t: TranslateFn;
}

const STORAGE_KEY = "app_language";
const DEFAULT_LANGUAGE: AppLanguage = "en";

export const LANGUAGE_OPTIONS: {
  value: AppLanguage;
  labelKey: string;
}[] = [
  { value: "en", labelKey: "settings.language.english" },
  { value: "hi", labelKey: "settings.language.hindi" },
  { value: "ta", labelKey: "settings.language.tamil" },
  { value: "ml", labelKey: "settings.language.malayalam" },
  { value: "te", labelKey: "settings.language.telugu" },
  { value: "kn", labelKey: "settings.language.kannada" },
  { value: "bn", labelKey: "settings.language.bengali" },
  { value: "mr", labelKey: "settings.language.marathi" },
  { value: "gu", labelKey: "settings.language.gujarati" },
  { value: "pa", labelKey: "settings.language.punjabi" },
  { value: "or", labelKey: "settings.language.odia" },
  { value: "ur", labelKey: "settings.language.urdu" },
];

const translations: Partial<Record<AppLanguage, Record<string, string>>> = {
  en: {
    "settings.title": "Settings",
    "settings.theme": "Theme",
    "settings.theme.light": "Light Mode",
    "settings.theme.dark": "Dark Mode",
    "settings.theme.system": "System Default",
    "settings.language": "Language",
    "settings.language.english": "English (English)",
    "settings.language.hindi": "Hindi (हिन्दी)",
    "settings.language.tamil": "Tamil (தமிழ்)",
    "settings.language.malayalam": "Malayalam (മലയാളം)",
    "settings.language.telugu": "Telugu (తెలుగు)",
    "settings.language.kannada": "Kannada (ಕನ್ನಡ)",
    "settings.language.bengali": "Bengali (বাংলা)",
    "settings.language.marathi": "Marathi (मराठी)",
    "settings.language.gujarati": "Gujarati (ગુજરાતી)",
    "settings.language.punjabi": "Punjabi (ਪੰਜਾਬੀ)",
    "settings.language.odia": "Odia (ଓଡ଼ିଆ)",
    "settings.language.urdu": "Urdu (اردو)",
    "settings.account": "Account",
    "settings.account.logout": "Logout",
    "profile.loading": "Loading profile...",
    "profile.notFound.title": "User Not Found",
    "profile.notFound.message":
      "The user you're looking for doesn't exist or has been removed",
    "profile.notFound.goBack": "Go Back",
    "profile.sessionExpired.title": "Session Expired",
    "profile.sessionExpired.message":
      "Your profile could not be loaded. Please login again.",
    "profile.logout.confirmTitle": "Confirm Logout",
    "profile.logout.confirmMessage":
      "Are you sure you want to logout? You will need to sign in again to access your account.",
    "profile.common.cancel": "Cancel",
    "profile.common.logout": "Logout",
    "profile.notifications.title": "Notifications",
    "profile.notifications.emptyMessage": "No new notifications at the moment",
    "profile.notifications.gotIt": "Got it",
    "profile.header.dateOfBirth": "Date Of Birth",
    "profile.header.followers": "Followers",
    "profile.header.following": "Following",
    "profile.header.livesSaved": "Lives Saved",
    "profile.actions.following": "Following",
    "profile.actions.follow": "Follow",
    "profile.actions.editProfile": "Edit Profile",
    "profile.actions.myStatus": "My Status",
    "profile.tabs.donations": "Donations",
    "profile.tabs.reviews": "Reviews",
    "profile.tabs.receives": "Requests",
    "profile.permissions.checking": "Checking permissions...",
    "profile.private.title": "Private Profile",
    "profile.private.message": "This user's {tab} are private",
    "profile.donations.loading": "Loading donations...",
    "profile.donations.emptyTitle": "No Donations Yet",
    "profile.donations.emptyOwnDescription":
      "Register as a donor and make your first donation to see it here",
    "profile.donations.emptyOtherDescription":
      "This user hasn't made any donations yet",
    "profile.donations.registerButton": "Register as Donor",
    "profile.donations.defaultType": "Blood Donation",
    "profile.fields.bloodType": "Blood Type",
    "profile.fields.organ": "Organ",
    "profile.fields.quantity": "Quantity",
    "profile.fields.date": "Date",
    "profile.fields.status": "Status",
    "profile.donations.viewAll": "View All Donations",
    "profile.receives.loading": "Loading requests...",
    "profile.receives.emptyTitle": "No Receive Requests Yet",
    "profile.receives.emptyOwnDescription":
      "Register as a recipient and create your first request to see it here",
    "profile.receives.emptyOtherDescription":
      "This user hasn't made any requests yet",
    "profile.receives.registerButton": "Register as Recipient",
    "profile.receives.viewAll": "View All Requests",
  },
  te: {
    "settings.title": "సెట్టింగ్స్",
    "settings.theme": "థీమ్",
    "settings.theme.light": "లైట్ మోడ్",
    "settings.theme.dark": "డార్క్ మోడ్",
    "settings.theme.system": "సిస్టమ్ డిఫాల్ట్",
    "settings.language": "భాష",
    "settings.language.english": "ఇంగ్లీష్",
    "settings.language.telugu": "తెలుగు",
    "settings.account": "ఖాతా",
    "settings.account.logout": "లాగౌట్",
    "profile.loading": "ప్రొఫైల్ లోడ్ అవుతోంది...",
    "profile.notFound.title": "వినియోగదారు కనపడలేదు",
    "profile.notFound.message":
      "మీరు వెతుకుతున్న వినియోగదారు లేరు లేదా తొలగించబడ్డారు",
    "profile.notFound.goBack": "వెనక్కి వెళ్లండి",
    "profile.sessionExpired.title": "సెషన్ ముగిసింది",
    "profile.sessionExpired.message":
      "మీ ప్రొఫైల్‌ను లోడ్ చేయలేకపోయాం. దయచేసి మళ్లీ లాగిన్ అవ్వండి.",
    "profile.logout.confirmTitle": "లాగౌట్ నిర్ధారణ",
    "profile.logout.confirmMessage":
      "మీరు ఖచ్చితంగా లాగౌట్ కావాలనుకుంటున్నారా? మళ్లీ యాక్సెస్ చేయడానికి తిరిగి సైన్ ఇన్ చేయాలి.",
    "profile.common.cancel": "రద్దు",
    "profile.common.logout": "లాగౌట్",
    "profile.notifications.title": "నోటిఫికేషన్లు",
    "profile.notifications.emptyMessage": "ప్రస్తుతం కొత్త నోటిఫికేషన్లు లేవు",
    "profile.notifications.gotIt": "సరే",
    "profile.header.dateOfBirth": "పుట్టిన తేదీ",
    "profile.header.followers": "ఫాలోవర్స్",
    "profile.header.following": "ఫాలోయింగ్",
    "profile.header.livesSaved": "రక్షించిన ప్రాణాలు",
    "profile.actions.following": "ఫాలోయింగ్",
    "profile.actions.follow": "ఫాలో",
    "profile.actions.editProfile": "ప్రొఫైల్ సవరించు",
    "profile.actions.myStatus": "నా స్టేటస్",
    "profile.tabs.donations": "దానాలు",
    "profile.tabs.reviews": "రివ్యూలు",
    "profile.tabs.receives": "అభ్యర్థనలు",
    "profile.permissions.checking": "అనుమతులు తనిఖీ చేస్తోంది...",
    "profile.private.title": "ప్రైవేట్ ప్రొఫైల్",
    "profile.private.message": "ఈ వినియోగదారుడి {tab} ప్రైవేట్‌గా ఉన్నాయి",
    "profile.donations.loading": "దానాలు లోడ్ అవుతున్నాయి...",
    "profile.donations.emptyTitle": "ఇంకా దానాలు లేవు",
    "profile.donations.emptyOwnDescription":
      "ఇక్కడ చూడడానికి ముందుగా డోనర్‌గా నమోదు అయి మీ మొదటి దానం చేయండి",
    "profile.donations.emptyOtherDescription":
      "ఈ వినియోగదారు ఇంకా ఎలాంటి దానాలు చేయలేదు",
    "profile.donations.registerButton": "డోనర్‌గా నమోదు అవ్వండి",
    "profile.donations.defaultType": "రక్త దానం",
    "profile.fields.bloodType": "రక్త గుంపు",
    "profile.fields.organ": "అవయవం",
    "profile.fields.quantity": "పరిమాణం",
    "profile.fields.date": "తేదీ",
    "profile.fields.status": "స్థితి",
    "profile.donations.viewAll": "అన్ని దానాలు చూడండి",
    "profile.receives.loading": "అభ్యర్థనలు లోడ్ అవుతున్నాయి...",
    "profile.receives.emptyTitle": "ఇంకా రిసీవ్ అభ్యర్థనలు లేవు",
    "profile.receives.emptyOwnDescription":
      "ఇక్కడ చూడడానికి ముందుగా రిసిపియెంట్‌గా నమోదు అయి మీ మొదటి అభ్యర్థన సృష్టించండి",
    "profile.receives.emptyOtherDescription":
      "ఈ వినియోగదారు ఇంకా ఎలాంటి అభ్యర్థనలు చేయలేదు",
    "profile.receives.registerButton": "రిసిపియెంట్‌గా నమోదు అవ్వండి",
    "profile.receives.viewAll": "అన్ని అభ్యర్థనలు చూడండి",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const interpolate = (
  text: string,
  params: TranslationParams = {}
): string => {
  return text.replace(/\{(\w+)\}/g, (_, token) =>
    Object.prototype.hasOwnProperty.call(params, token)
      ? String(params[token])
      : `{${token}}`
  );
};

const translate = (
  language: AppLanguage,
  key: string,
  params?: TranslationParams
): string => {
  const languageTemplate = translations[language]?.[key];
  const defaultTemplate = translations[DEFAULT_LANGUAGE]?.[key];
  const template = languageTemplate ?? defaultTemplate;

  if (!template) {
    return language !== DEFAULT_LANGUAGE ? translateUiText(key) : key;
  }

  const resolved = params ? interpolate(template, params) : template;

  // Keep language names canonical in the picker regardless of active locale.
  if (key.startsWith("settings.language.")) {
    return translations[DEFAULT_LANGUAGE]?.[key] ?? resolved;
  }

  if (language !== DEFAULT_LANGUAGE && !languageTemplate) {
    return translateUiText(resolved);
  }

  return resolved;
};

const isSupportedLanguage = (value: string): value is AppLanguage =>
  LANGUAGE_OPTIONS.some((option) => option.value === value);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>(DEFAULT_LANGUAGE);

  useEffect(() => {
    setRuntimeLanguage(language);
  }, [language]);

  useEffect(() => {
    const loadSavedLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedLanguage && isSupportedLanguage(savedLanguage)) {
          setRuntimeLanguage(savedLanguage);
          setLanguageState(savedLanguage);
        } else {
          setRuntimeLanguage(DEFAULT_LANGUAGE);
          setLanguageState(DEFAULT_LANGUAGE);
          await AsyncStorage.setItem(STORAGE_KEY, DEFAULT_LANGUAGE);
        }
      } catch (error) {
        console.log("Error loading language preference:", error);
      }
    };

    loadSavedLanguage();
  }, []);

  const setLanguage = async (newLanguage: AppLanguage) => {
    try {
      setRuntimeLanguage(newLanguage);
      setLanguageState(newLanguage);
      await AsyncStorage.setItem(STORAGE_KEY, newLanguage);
    } catch (error) {
      console.log("Error saving language preference:", error);
    }
  };

  const t: TranslateFn = useMemo(
    () => (key: string, params?: TranslationParams) =>
      translate(language, key, params),
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <React.Fragment key={language}>{children}</React.Fragment>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
