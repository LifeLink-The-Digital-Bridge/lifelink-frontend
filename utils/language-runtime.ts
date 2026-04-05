export type RuntimeLanguage =
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

let activeLanguage: RuntimeLanguage = "en";

const translationCache = new Map<string, string>();

type LanguageConfig = {
  exact: Record<string, string>;
  phrases: [string, string][];
  words: Record<string, string>;
  letters: Record<string, string>;
};

const DEVANAGARI_LETTERS: Record<string, string> = {
  a: "अ", b: "ब", c: "क", d: "द", e: "ए", f: "फ", g: "ग", h: "ह",
  i: "इ", j: "ज", k: "क", l: "ल", m: "म", n: "न", o: "ओ", p: "प",
  q: "क", r: "र", s: "स", t: "त", u: "उ", v: "व", w: "व", x: "क्स",
  y: "य", z: "ज़",
};

const TELUGU_LETTERS: Record<string, string> = {
  a: "అ", b: "బ", c: "క", d: "ద", e: "ఎ", f: "ఫ", g: "గ", h: "హ",
  i: "ఇ", j: "జ", k: "క", l: "ల", m: "మ", n: "న", o: "ఒ", p: "ప",
  q: "క", r: "ర", s: "స", t: "ట", u: "ఉ", v: "వ", w: "వ", x: "క్స",
  y: "య", z: "జ",
};

const TAMIL_LETTERS: Record<string, string> = {
  a: "அ", b: "ப", c: "க", d: "ட", e: "எ", f: "ஃப", g: "க", h: "ஹ",
  i: "இ", j: "ஜ", k: "க", l: "ல", m: "ம", n: "ந", o: "ஒ", p: "ப",
  q: "க", r: "ர", s: "ஸ", t: "ட", u: "உ", v: "வ", w: "வ", x: "க்ஸ்",
  y: "ய", z: "ஜ",
};

const MALAYALAM_LETTERS: Record<string, string> = {
  a: "അ", b: "ബ", c: "ക", d: "ദ", e: "എ", f: "ഫ", g: "ഗ", h: "ഹ",
  i: "ഇ", j: "ജ", k: "ക", l: "ല", m: "മ", n: "ന", o: "ഒ", p: "പ",
  q: "ക", r: "ര", s: "സ", t: "ട", u: "ഉ", v: "വ", w: "വ", x: "ക്സ",
  y: "യ", z: "സ",
};

const KANNADA_LETTERS: Record<string, string> = {
  a: "ಅ", b: "ಬ", c: "ಕ", d: "ದ", e: "ಎ", f: "ಫ", g: "ಗ", h: "ಹ",
  i: "ಇ", j: "ಜ", k: "ಕ", l: "ಲ", m: "ಮ", n: "ನ", o: "ಒ", p: "ಪ",
  q: "ಕ", r: "ರ", s: "ಸ", t: "ಟ", u: "ಉ", v: "ವ", w: "ವ", x: "ಕ್ಸ",
  y: "ಯ", z: "ಜ",
};

const BENGALI_LETTERS: Record<string, string> = {
  a: "অ", b: "ব", c: "ক", d: "দ", e: "এ", f: "ফ", g: "গ", h: "হ",
  i: "ই", j: "জ", k: "ক", l: "ল", m: "ম", n: "ন", o: "ও", p: "প",
  q: "ক", r: "র", s: "স", t: "ত", u: "উ", v: "ভ", w: "ও", x: "ক্স",
  y: "য", z: "জ",
};

const GUJARATI_LETTERS: Record<string, string> = {
  a: "અ", b: "બ", c: "ક", d: "દ", e: "એ", f: "ફ", g: "ગ", h: "હ",
  i: "ઇ", j: "જ", k: "ક", l: "લ", m: "મ", n: "ન", o: "ઓ", p: "પ",
  q: "ક", r: "ર", s: "સ", t: "ત", u: "ઉ", v: "વ", w: "વ", x: "ક્સ",
  y: "ય", z: "ઝ",
};

const PUNJABI_LETTERS: Record<string, string> = {
  a: "ਅ", b: "ਬ", c: "ਕ", d: "ਦ", e: "ਏ", f: "ਫ", g: "ਗ", h: "ਹ",
  i: "ਇ", j: "ਜ", k: "ਕ", l: "ਲ", m: "ਮ", n: "ਨ", o: "ਓ", p: "ਪ",
  q: "ਕ", r: "ਰ", s: "ਸ", t: "ਤ", u: "ਉ", v: "ਵ", w: "ਵ", x: "ਕ੍ਸ",
  y: "ਯ", z: "ਜ਼",
};

const ODIA_LETTERS: Record<string, string> = {
  a: "ଅ", b: "ବ", c: "କ", d: "ଦ", e: "ଏ", f: "ଫ", g: "ଗ", h: "ହ",
  i: "ଇ", j: "ଜ", k: "କ", l: "ଲ", m: "ମ", n: "ନ", o: "ଓ", p: "ପ",
  q: "କ", r: "ର", s: "ସ", t: "ତ", u: "ଉ", v: "ଭ", w: "ୱ", x: "କ୍ସ",
  y: "ଯ", z: "ଜ",
};

const URDU_LETTERS: Record<string, string> = {
  a: "ا", b: "ب", c: "ک", d: "د", e: "ے", f: "ف", g: "گ", h: "ح",
  i: "ی", j: "ج", k: "ک", l: "ل", m: "م", n: "ن", o: "و", p: "پ",
  q: "ق", r: "ر", s: "س", t: "ت", u: "و", v: "و", w: "و", x: "کس",
  y: "ی", z: "ز",
};

const COMMON_WORDS_TE: Record<string, string> = {
  home: "హోమ్",
  health: "ఆరోగ్యం",
  records: "రికార్డులు",
  donate: "దానం",
  maps: "మ్యాప్స్",
  patients: "రోగులు",
  support: "సహాయం",
  request: "అభ్యర్థన",
  profile: "ప్రొఫైల్",
  admin: "అడ్మిన్",
  services: "సేవలు",
  settings: "సెట్టింగ్స్",
  theme: "థీమ్",
  language: "భాష",
  account: "ఖాతా",
  logout: "లాగౌట్",
  cancel: "రద్దు",
  search: "వెతకండి",
  filter: "వడపోత",
  update: "అప్‌డేట్",
  connect: "కనెక్ట్",
  notification: "నోటిఫికేషన్",
  notifications: "నోటిఫికేషన్లు",
  status: "స్థితి",
  loading: "లోడ్ అవుతోంది",
  no: "లేదు",
  user: "వినియోగదారు",
  users: "వినియోగదారులు",
  details: "వివరాలు",
  emergency: "అత్యవసర",
};

const COMMON_WORDS_HI: Record<string, string> = {
  home: "होम", health: "स्वास्थ्य", records: "रिकॉर्ड", donate: "दान", maps: "मैप्स",
  patients: "मरीज़", support: "सहायता", request: "अनुरोध", profile: "प्रोफाइल",
  admin: "एडमिन", services: "सेवाएँ", settings: "सेटिंग्स", theme: "थीम",
  language: "भाषा", account: "खाता", logout: "लॉगआउट", cancel: "रद्द करें",
  search: "खोजें", filter: "फ़िल्टर", update: "अपडेट", connect: "कनेक्ट",
  notifications: "सूचनाएँ", status: "स्थिति", loading: "लोड हो रहा है", no: "नहीं",
};

const COMMON_WORDS_TA: Record<string, string> = {
  home: "முகப்பு", health: "ஆரோக்கியம்", records: "பதிவுகள்", donate: "தானம்",
  maps: "வரைபடங்கள்", patients: "நோயாளிகள்", support: "ஆதரவு", request: "கோரிக்கை",
  profile: "சுயவிவரம்", settings: "அமைப்புகள்", language: "மொழி", account: "கணக்கு",
  logout: "வெளியேறு", cancel: "ரத்து", search: "தேடல்", update: "புதுப்பிப்பு",
  notifications: "அறிவிப்புகள்", status: "நிலை", loading: "ஏற்றுகிறது", no: "இல்லை",
};

const COMMON_WORDS_ML: Record<string, string> = {
  home: "ഹോം", health: "ആരോഗ്യം", records: "റെക്കോർഡുകൾ", donate: "ദാനം",
  maps: "മാപ്പുകൾ", patients: "രോഗികൾ", support: "സഹായം", request: "അഭ്യർത്ഥന",
  profile: "പ്രൊഫൈൽ", settings: "സെറ്റിംഗ്സ്", language: "ഭാഷ", account: "അക്കൗണ്ട്",
  logout: "ലോഗ്ഔട്ട്", cancel: "റദ്ദാക്കുക", search: "തിരയുക", update: "അപ്‌ഡേറ്റ്",
  notifications: "അറിയിപ്പുകൾ", status: "സ്ഥിതി", loading: "ലോഡ് ചെയ്യുന്നു", no: "ഇല്ല",
};

const COMMON_WORDS_KN: Record<string, string> = {
  home: "ಮುಖಪುಟ", health: "ಆರೋಗ್ಯ", records: "ದಾಖಲೆಗಳು", donate: "ದಾನ",
  support: "ಸಹಾಯ", request: "ವಿನಂತಿ", profile: "ಪ್ರೊಫೈಲ್", settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
  language: "ಭಾಷೆ", account: "ಖಾತೆ", logout: "ಲಾಗೌಟ್", cancel: "ರದ್ದು",
  search: "ಹುಡುಕಿ", update: "ನವೀಕರಿಸಿ", notifications: "ಅಧಿಸೂಚನೆಗಳು", status: "ಸ್ಥಿತಿ",
};

const COMMON_WORDS_BN: Record<string, string> = {
  home: "হোম", health: "স্বাস্থ্য", records: "রেকর্ড", donate: "দান", support: "সহায়তা",
  request: "অনুরোধ", profile: "প্রোফাইল", settings: "সেটিংস", language: "ভাষা",
  account: "অ্যাকাউন্ট", logout: "লগআউট", cancel: "বাতিল", search: "অনুসন্ধান",
  update: "আপডেট", notifications: "বিজ্ঞপ্তি", status: "অবস্থা",
};

const COMMON_WORDS_MR: Record<string, string> = {
  home: "होम", health: "आरोग्य", records: "रेकॉर्ड", donate: "दान", support: "मदत",
  request: "विनंती", profile: "प्रोफाइल", settings: "सेटिंग्ज", language: "भाषा",
  account: "खाते", logout: "लॉगआउट", cancel: "रद्द", search: "शोधा",
  update: "अपडेट", notifications: "सूचना", status: "स्थिती",
};

const COMMON_WORDS_GU: Record<string, string> = {
  home: "હોમ", health: "આરોગ્ય", records: "રેકોર્ડ", donate: "દાન", support: "સહાય",
  request: "વિનંતી", profile: "પ્રોફાઇલ", settings: "સેટિંગ્સ", language: "ભાષા",
  account: "એકાઉન્ટ", logout: "લોગઆઉટ", cancel: "રદ કરો", search: "શોધો",
  update: "અપડેટ", notifications: "સૂચનાઓ", status: "સ્થિતિ",
};

const COMMON_WORDS_PA: Record<string, string> = {
  home: "ਹੋਮ", health: "ਸਿਹਤ", records: "ਰਿਕਾਰਡ", donate: "ਦਾਨ", support: "ਸਹਾਇਤਾ",
  request: "ਬੇਨਤੀ", profile: "ਪ੍ਰੋਫ਼ਾਈਲ", settings: "ਸੈਟਿੰਗਜ਼", language: "ਭਾਸ਼ਾ",
  account: "ਖਾਤਾ", logout: "ਲੌਗਆਊਟ", cancel: "ਰੱਦ ਕਰੋ", search: "ਖੋਜੋ",
  update: "ਅੱਪਡੇਟ", notifications: "ਸੂਚਨਾਵਾਂ", status: "ਸਥਿਤੀ",
};

const COMMON_WORDS_OR: Record<string, string> = {
  home: "ହୋମ୍", health: "ସ୍ୱାସ୍ଥ୍ୟ", records: "ରେକର୍ଡ", donate: "ଦାନ", support: "ସହଯୋଗ",
  request: "ଅନୁରୋଧ", profile: "ପ୍ରୋଫାଇଲ୍", settings: "ସେଟିଂସ୍", language: "ଭାଷା",
  account: "ଖାତା", logout: "ଲଗଆଉଟ୍", cancel: "ବାତିଲ୍", search: "ସନ୍ଧାନ",
  update: "ଅପଡେଟ୍", notifications: "ସୂଚନା", status: "ସ୍ଥିତି",
};

const COMMON_WORDS_UR: Record<string, string> = {
  home: "ہوم", health: "صحت", records: "ریکارڈ", donate: "عطیہ", support: "مدد",
  request: "درخواست", profile: "پروفائل", settings: "ترتیبات", language: "زبان",
  account: "اکاؤنٹ", logout: "لاگ آؤٹ", cancel: "منسوخ", search: "تلاش",
  update: "اپ ڈیٹ", notifications: "اطلاعات", status: "حالت",
};

const LANGUAGE_CONFIGS: Record<Exclude<RuntimeLanguage, "en">, LanguageConfig> = {
  te: {
    exact: {
      "Home": "హోమ్",
      "Health": "ఆరోగ్యం",
      "Records": "రికార్డులు",
      "Donate": "దానం",
      "Maps": "మ్యాప్స్",
      "Patients": "రోగులు",
      "Support": "సహాయం",
      "Request": "అభ్యర్థన",
      "Profile": "ప్రొఫైల్",
      "Settings": "సెట్టింగ్స్",
      "Language": "భాష",
      "Account": "ఖాతా",
      "Logout": "లాగౌట్",
      "Cancel": "రద్దు",
      "Notifications": "నోటిఫికేషన్లు",
    },
    phrases: [
      ["Terms & Conditions", "నిబంధనలు మరియు షరతులు"],
      ["Health ID", "హెల్త్ ఐడి"],
      ["Sign In", "సైన్ ఇన్"],
      ["Create Account", "ఖాతా సృష్టించండి"],
      ["Create Request", "అభ్యర్థన సృష్టించండి"],
      ["No Notifications", "నోటిఫికేషన్లు లేవు"],
      ["Loading...", "లోడ్ అవుతోంది..."],
    ],
    words: COMMON_WORDS_TE,
    letters: TELUGU_LETTERS,
  },
  hi: {
    exact: { "Language": "भाषा", "Settings": "सेटिंग्स", "Profile": "प्रोफाइल" },
    phrases: [
      ["Terms & Conditions", "नियम और शर्तें"],
      ["Health ID", "हेल्थ आईडी"],
      ["Sign In", "साइन इन"],
      ["Create Account", "खाता बनाएं"],
      ["Create Request", "अनुरोध बनाएं"],
      ["No Notifications", "कोई सूचनाएँ नहीं"],
      ["Loading...", "लोड हो रहा है..."],
    ],
    words: COMMON_WORDS_HI,
    letters: DEVANAGARI_LETTERS,
  },
  ta: {
    exact: { "Language": "மொழி", "Settings": "அமைப்புகள்", "Profile": "சுயவிவரம்" },
    phrases: [
      ["Terms & Conditions", "விதிமுறைகள் மற்றும் நிபந்தனைகள்"],
      ["Health ID", "ஆரோக்கிய அட்டை"],
      ["Sign In", "உள்நுழைய"],
      ["Create Account", "கணக்கு உருவாக்கவும்"],
      ["Create Request", "கோரிக்கை உருவாக்கவும்"],
      ["No Notifications", "அறிவிப்புகள் இல்லை"],
      ["Loading...", "ஏற்றுகிறது..."],
    ],
    words: COMMON_WORDS_TA,
    letters: TAMIL_LETTERS,
  },
  ml: {
    exact: { "Language": "ഭാഷ", "Settings": "സെറ്റിംഗ്സ്", "Profile": "പ്രൊഫൈൽ" },
    phrases: [
      ["Terms & Conditions", "നിബന്ധനകളും വ്യവസ്ഥകളും"],
      ["Health ID", "ഹെൽത്ത് ഐഡി"],
      ["Sign In", "സൈൻ ഇൻ"],
      ["Create Account", "അക്കൗണ്ട് സൃഷ്ടിക്കുക"],
      ["Create Request", "അഭ്യർത്ഥന സൃഷ്ടിക്കുക"],
      ["No Notifications", "അറിയിപ്പുകളില്ല"],
      ["Loading...", "ലോഡ് ചെയ്യുന്നു..."],
    ],
    words: COMMON_WORDS_ML,
    letters: MALAYALAM_LETTERS,
  },
  kn: {
    exact: { "Language": "ಭಾಷೆ", "Settings": "ಸೆಟ್ಟಿಂಗ್‌ಗಳು", "Profile": "ಪ್ರೊಫೈಲ್" },
    phrases: [
      ["Terms & Conditions", "ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳು"],
      ["Health ID", "ಹೆಲ್ತ್ ಐಡಿ"],
      ["Sign In", "ಸೈನ್ ಇನ್"],
      ["Create Account", "ಖಾತೆ ರಚಿಸಿ"],
      ["Create Request", "ವಿನಂತಿ ರಚಿಸಿ"],
      ["No Notifications", "ಯಾವುದೇ ಅಧಿಸೂಚನೆಗಳಿಲ್ಲ"],
      ["Loading...", "ಲೋಡ್ ಆಗುತ್ತಿದೆ..."],
    ],
    words: COMMON_WORDS_KN,
    letters: KANNADA_LETTERS,
  },
  bn: {
    exact: { "Language": "ভাষা", "Settings": "সেটিংস", "Profile": "প্রোফাইল" },
    phrases: [
      ["Terms & Conditions", "শর্তাবলী"],
      ["Health ID", "হেলথ আইডি"],
      ["Sign In", "সাইন ইন"],
      ["Create Account", "অ্যাকাউন্ট তৈরি করুন"],
      ["Create Request", "অনুরোধ তৈরি করুন"],
      ["No Notifications", "কোনো বিজ্ঞপ্তি নেই"],
      ["Loading...", "লোড হচ্ছে..."],
    ],
    words: COMMON_WORDS_BN,
    letters: BENGALI_LETTERS,
  },
  mr: {
    exact: { "Language": "भाषा", "Settings": "सेटिंग्ज", "Profile": "प्रोफाइल" },
    phrases: [
      ["Terms & Conditions", "अटी आणि शर्ती"],
      ["Health ID", "हेल्थ आयडी"],
      ["Sign In", "साइन इन"],
      ["Create Account", "खाते तयार करा"],
      ["Create Request", "विनंती तयार करा"],
      ["No Notifications", "सूचना नाहीत"],
      ["Loading...", "लोड होत आहे..."],
    ],
    words: COMMON_WORDS_MR,
    letters: DEVANAGARI_LETTERS,
  },
  gu: {
    exact: { "Language": "ભાષા", "Settings": "સેટિંગ્સ", "Profile": "પ્રોફાઇલ" },
    phrases: [
      ["Terms & Conditions", "નિયમો અને શરતો"],
      ["Health ID", "હેલ્થ આઈડી"],
      ["Sign In", "સાઇન ઇન"],
      ["Create Account", "એકાઉન્ટ બનાવો"],
      ["Create Request", "વિનંતી બનાવો"],
      ["No Notifications", "કોઈ સૂચનાઓ નથી"],
      ["Loading...", "લોડ થઈ રહ્યું છે..."],
    ],
    words: COMMON_WORDS_GU,
    letters: GUJARATI_LETTERS,
  },
  pa: {
    exact: { "Language": "ਭਾਸ਼ਾ", "Settings": "ਸੈਟਿੰਗਜ਼", "Profile": "ਪ੍ਰੋਫ਼ਾਈਲ" },
    phrases: [
      ["Terms & Conditions", "ਨਿਯਮ ਅਤੇ ਸ਼ਰਤਾਂ"],
      ["Health ID", "ਹੈਲਥ ਆਈਡੀ"],
      ["Sign In", "ਸਾਈਨ ਇਨ"],
      ["Create Account", "ਖਾਤਾ ਬਣਾਓ"],
      ["Create Request", "ਬੇਨਤੀ ਬਣਾਓ"],
      ["No Notifications", "ਕੋਈ ਸੂਚਨਾਵਾਂ ਨਹੀਂ"],
      ["Loading...", "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ..."],
    ],
    words: COMMON_WORDS_PA,
    letters: PUNJABI_LETTERS,
  },
  or: {
    exact: { "Language": "ଭାଷା", "Settings": "ସେଟିଂସ୍", "Profile": "ପ୍ରୋଫାଇଲ୍" },
    phrases: [
      ["Terms & Conditions", "ନିୟମ ଓ ସର୍ତ୍ତାବଳୀ"],
      ["Health ID", "ହେଲ୍ଥ ଆଇଡି"],
      ["Sign In", "ସାଇନ୍ ଇନ୍"],
      ["Create Account", "ଖାତା ସୃଷ୍ଟି କରନ୍ତୁ"],
      ["Create Request", "ଅନୁରୋଧ ସୃଷ୍ଟି କରନ୍ତୁ"],
      ["No Notifications", "କୌଣସି ସୂଚନା ନାହିଁ"],
      ["Loading...", "ଲୋଡ୍ ହେଉଛି..."],
    ],
    words: COMMON_WORDS_OR,
    letters: ODIA_LETTERS,
  },
  ur: {
    exact: { "Language": "زبان", "Settings": "ترتیبات", "Profile": "پروفائل" },
    phrases: [
      ["Terms & Conditions", "شرائط و ضوابط"],
      ["Health ID", "ہیلتھ آئی ڈی"],
      ["Sign In", "سائن ان"],
      ["Create Account", "اکاؤنٹ بنائیں"],
      ["Create Request", "درخواست بنائیں"],
      ["No Notifications", "کوئی اطلاع نہیں"],
      ["Loading...", "لوڈ ہو رہا ہے..."],
    ],
    words: COMMON_WORDS_UR,
    letters: URDU_LETTERS,
  },
};

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const shouldSkipTranslation = (value: string): boolean => {
  const trimmed = value.trim();
  if (!trimmed) return true;
  if (/^https?:\/\//i.test(trimmed)) return true;
  if (/^[0-9\s.,:%+-]+$/.test(trimmed)) return true;
  if (/^[A-Z0-9_*:-]{4,}$/.test(trimmed)) return true;
  if (/^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(trimmed)) return true;
  return false;
};

const applyPhraseReplacements = (input: string, phrases: [string, string][]) => {
  let output = input;
  for (const [from, to] of phrases) {
    const fromEscaped = escapeRegExp(from);
    const startsWord = /[A-Za-z0-9]/.test(from[0]);
    const endsWord = /[A-Za-z0-9]/.test(from[from.length - 1]);
    const pattern = `${startsWord ? "\\b" : ""}${fromEscaped}${endsWord ? "\\b" : ""}`;
    output = output.replace(new RegExp(pattern, "gi"), to);
  }
  return output;
};

const transliterateEnglishWord = (
  word: string,
  words: Record<string, string>,
  letters: Record<string, string>
): string => {
  const lower = word.toLowerCase();
  const fromDictionary = words[lower];
  if (fromDictionary) return fromDictionary;

  let converted = "";
  for (const char of lower) {
    converted += letters[char] ?? char;
  }
  return converted || word;
};

const applyWordFallback = (
  input: string,
  words: Record<string, string>,
  letters: Record<string, string>
): string => {
  return input.replace(/[A-Za-z][A-Za-z'-]*/g, (word) =>
    transliterateEnglishWord(word, words, letters)
  );
};

const getConfig = (language: RuntimeLanguage): LanguageConfig | null => {
  if (language === "en") return null;
  return LANGUAGE_CONFIGS[language];
};

export const setRuntimeLanguage = (language: RuntimeLanguage) => {
  activeLanguage = language;
  translationCache.clear();
};

export const getRuntimeLanguage = (): RuntimeLanguage => activeLanguage;

export const translateUiText = (value: string): string => {
  if (activeLanguage === "en") return value;
  if (!value || shouldSkipTranslation(value)) return value;

  const cacheKey = `${activeLanguage}::${value}`;
  const cached = translationCache.get(cacheKey);
  if (cached) return cached;

  const config = getConfig(activeLanguage);
  if (!config) return value;

  const exact = config.exact[value];
  if (exact) {
    translationCache.set(cacheKey, exact);
    return exact;
  }

  const translated = applyWordFallback(
    applyPhraseReplacements(value, config.phrases),
    config.words,
    config.letters
  );

  translationCache.set(cacheKey, translated);
  return translated;
};
