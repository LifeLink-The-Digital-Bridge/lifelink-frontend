import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
  Dimensions,
  PixelRatio,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { updateUserProfile, fetchUserProfile, UserDTO } from "../../api/profile";
import { Feather } from "@expo/vector-icons";
import AppLayout from "@/components/AppLayout";
import { Picker } from "@react-native-picker/picker";
import { useTheme } from "../../../utils/theme-context";
import { lightTheme, darkTheme } from "../../../constants/styles/authStyles";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;
const widthScale = SCREEN_WIDTH / BASE_WIDTH;
const heightScale = SCREEN_HEIGHT / BASE_HEIGHT;
const scale = Math.min(widthScale, heightScale);

function normalize(size: number): number {
  const newSize = size * scale;
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

function normalizeFont(size: number, factor = 0.5): number {
  const newSize = size + (widthScale * size - size) * factor;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

function normalizeWidth(size: number): number {
  return SCREEN_WIDTH * (size / BASE_WIDTH);
}

function normalizeHeight(size: number): number {
  return SCREEN_HEIGHT * (size / BASE_HEIGHT);
}

const genderOptions = [
  { label: "Select Gender", value: "" },
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
  { label: "Other", value: "OTHER" },
];

const validateForm = (form: any, requiredFields: string[]) => {
  const errors: { [key: string]: string } = {};
  requiredFields.forEach((field) => {
    if (!form[field]) {
      errors[field] = `${
        field.charAt(0).toUpperCase() + field.slice(1)
      } is required`;
    }
  });
  if (form.phone && !/^\d{10}$/.test(form.phone)) {
    errors.phone = "Phone must be 10 digits";
  }
  if (form.dob && !/^\d{4}-\d{2}-\d{2}$/.test(form.dob)) {
    errors.dob = "Date must be in YYYY-MM-DD format";
  }
  return errors;
};

const pickImage = async (callback: (uri: string) => void) => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    Alert.alert(
      "Permission denied",
      "We need camera roll permissions to select a profile image."
    );
    return;
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    base64: true,
    quality: 0.7,
  });
  if (!result.canceled && result.assets[0].base64) {
    callback(`data:image/jpeg;base64,${result.assets[0].base64}`);
  }
};

const EditProfile: React.FC = () => {
  const router = useRouter();
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;
  
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    dob: "",
    gender: "",
    profileImageUrl: "",
    profileVisibility: "PUBLIC",
  });
  const [userId, setUserId] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const styles = {
    container: {
      flexGrow: 1,
      backgroundColor: theme.background,
      paddingHorizontal: normalize(24),
      paddingVertical: normalize(40),
    },
    title: {
      fontSize: normalizeFont(28),
      fontWeight: "700" as const,
      color: theme.text,
      textAlign: "center" as const,
      marginBottom: normalize(32),
    },
    input: {
      backgroundColor: theme.inputBackground,
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: normalize(12),
      paddingVertical: normalize(16),
      paddingHorizontal: normalize(16),
      fontSize: normalizeFont(16),
      color: theme.text,
      marginBottom: normalize(16),
      minHeight: normalize(52),
    },
    errorText: {
      color: theme.error,
      fontSize: normalizeFont(14),
      fontWeight: "500" as const,
      marginTop: normalize(-12),
      marginBottom: normalize(8),
      paddingHorizontal: normalize(4),
    },
    imagePicker: {
      backgroundColor: theme.success,
      paddingVertical: normalize(14),
      paddingHorizontal: normalize(20),
      borderRadius: normalize(12),
      alignItems: "center" as const,
      justifyContent: "center" as const,
      marginBottom: normalize(20),
      flexDirection: "row" as const,
      minHeight: normalize(52),
      ...Platform.select({
        ios: {
          shadowColor: theme.shadow,
          shadowOffset: { width: 0, height: normalize(2) },
          shadowOpacity: 0.15,
          shadowRadius: normalize(4),
        },
        android: {
          elevation: 4,
        },
      }),
    },
    imagePickerText: {
      color: "#ffffff",
      fontSize: normalizeFont(15),
      fontWeight: "600" as const,
      marginLeft: normalize(6),
    },
    button: {
      backgroundColor: theme.primary,
      paddingVertical: normalize(16),
      paddingHorizontal: normalize(24),
      borderRadius: normalize(12),
      alignItems: "center" as const,
      justifyContent: "center" as const,
      marginTop: normalize(12),
      minHeight: normalize(52),
      ...Platform.select({
        ios: {
          shadowColor: theme.primary,
          shadowOffset: { width: 0, height: normalize(4) },
          shadowOpacity: 0.2,
          shadowRadius: normalize(8),
        },
        android: {
          elevation: 4,
        },
      }),
    },
    buttonText: {
      fontSize: normalizeFont(16),
      fontWeight: "600" as const,
      color: "#ffffff",
      textAlign: "center" as const,
      letterSpacing: 0.5,
    },
    linkContainer: {
      flex: 1,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      paddingVertical: normalize(40),
    },
    profileImageContainer: {
      alignItems: "center" as const,
      marginVertical: normalize(20),
    },
    profileImage: {
      width: normalizeWidth(120),
      height: normalizeWidth(120),
      borderRadius: normalizeWidth(60),
      borderWidth: normalize(4),
      borderColor: theme.primary,
    },
  };

  useEffect(() => {
    const loadUserData = async () => {
      const id = await SecureStore.getItemAsync("userId");
      const username = await SecureStore.getItemAsync("username");
      const token = await SecureStore.getItemAsync("jwt");
      if (!id || !username || !token) {
        Alert.alert("Error", "User data not found. Please log in again.");
        return;
      }
      setUserId(id);
      try {
        const userProfile: UserDTO = await fetchUserProfile(username, token);
        setForm({
          name: userProfile.name || "",
          phone: userProfile.phone || "",
          dob: userProfile.dob || "",
          gender: userProfile.gender || "",
          profileImageUrl: userProfile.profileImageUrl || "",
          profileVisibility: userProfile.profileVisibility || "PUBLIC",
        });
      } catch (error) {
        Alert.alert("Error", "Failed to load profile data.");
      } finally {
        setProfileLoading(false);
      }
    };
    loadUserData();
  }, []);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const updateProfile = async () => {
    if (!userId) {
      Alert.alert("Error", "User ID not found.");
      return;
    }
    const requiredFields = [
      "name",
      "phone",
      "dob",
      "gender",
      "profileImageUrl",
      "profileVisibility",
    ];
    const validationErrors = validateForm(form, requiredFields);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      await updateUserProfile(userId, {
        name: form.name,
        phone: form.phone,
        dob: form.dob,
        gender: form.gender,
        profileImageUrl: form.profileImageUrl,
        profileVisibility: form.profileVisibility,
      });
      Alert.alert("Success", "Profile updated successfully!");
      router.back();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <AppLayout>
        <View style={styles.linkContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.errorText, { marginTop: normalize(10) }]}>
            Loading profile...
          </Text>
        </View>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Edit Profile</Text>
        
        {form.profileImageUrl && (
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: form.profileImageUrl }}
              style={styles.profileImage}
            />
          </View>
        )}

        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor={theme.textSecondary}
          value={form.name}
          onChangeText={(text) => handleChange("name", text)}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        
        <TextInput
          style={styles.input}
          placeholder="Phone"
          placeholderTextColor={theme.textSecondary}
          value={form.phone}
          keyboardType="phone-pad"
          onChangeText={(text) => handleChange("phone", text)}
        />
        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        
        <TextInput
          style={styles.input}
          placeholder="Date of Birth (YYYY-MM-DD)"
          placeholderTextColor={theme.textSecondary}
          value={form.dob}
          onChangeText={(text) => handleChange("dob", text)}
        />
        {errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}
        
        <View style={[styles.input, { padding: 0, justifyContent: "center" }]}>
          <Picker
            selectedValue={form.gender}
            onValueChange={(value) => handleChange("gender", value)}
            style={{ color: theme.text }}
          >
            {genderOptions.map((option) => (
              <Picker.Item
                label={option.label}
                value={option.value}
                key={option.value}
              />
            ))}
          </Picker>
        </View>
        {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
        
        <TextInput
          style={styles.input}
          placeholder="Profile Visibility (PUBLIC or PRIVATE)"
          placeholderTextColor={theme.textSecondary}
          value={form.profileVisibility}
          onChangeText={(text) => handleChange("profileVisibility", text)}
        />
        {errors.profileVisibility && (
          <Text style={styles.errorText}>{errors.profileVisibility}</Text>
        )}
        
        <TouchableOpacity
          style={styles.imagePicker}
          onPress={() =>
            pickImage((uri) => handleChange("profileImageUrl", uri))
          }
        >
          <Feather name="camera" size={normalize(20)} color="#fff" />
          <Text style={styles.imagePickerText}>
            {form.profileImageUrl
              ? "Change Profile Image"
              : "Upload Profile Image"}
          </Text>
        </TouchableOpacity>
        
        {errors.profileImageUrl && (
          <Text style={styles.errorText}>{errors.profileImageUrl}</Text>
        )}
        
        <TouchableOpacity
          style={styles.button}
          onPress={updateProfile}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </AppLayout>
  );
};

export default EditProfile;
