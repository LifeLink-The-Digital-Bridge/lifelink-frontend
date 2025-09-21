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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { updateUserProfile, fetchUserProfile, UserDTO } from "../api/profile";
import { Feather } from "@expo/vector-icons";
import AppLayout from "@/components/AppLayout";
import { Picker } from "@react-native-picker/picker";
import styles from "../../constants/styles/authStyles";

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
          <ActivityIndicator size="large" color="#0984e3" />
          <Text style={styles.errorText}>Loading profile...</Text>
        </View>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Edit Profile</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={form.name}
          onChangeText={(text) => handleChange("name", text)}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={form.phone}
          onChangeText={(text) => handleChange("phone", text)}
        />
        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        <TextInput
          style={styles.input}
          placeholder="Date of Birth (YYYY-MM-DD)"
          value={form.dob}
          onChangeText={(text) => handleChange("dob", text)}
        />
        {errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}
        <View style={[styles.input, { padding: 0 }]}>
          <Picker
            selectedValue={form.gender}
            onValueChange={(value) => handleChange("gender", value)}
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
        {errors.profileImageUrl && (
          <Text style={styles.errorText}>{errors.profileImageUrl}</Text>
        )}

        <TextInput
          style={styles.input}
          placeholder="Profile Visibility (PUBLIC or PRIVATE)"
          value={form.profileVisibility}
          onChangeText={(text) => handleChange("profileVisibility", text)}
        />
        {errors.profileVisibility && (
          <Text style={styles.errorText}>{errors.profileVisibility}</Text>
        )}
        <TouchableOpacity
          style={[styles.imagePicker, { backgroundColor: "#00b894" }]}
          onPress={() =>
            pickImage((uri) => handleChange("profileImageUrl", uri))
          }
        >
          <Text style={[styles.imagePickerText, { color: "#fff" }]}>
            {form.profileImageUrl
              ? "Change Profile Image"
              : "Upload Profile Image"}
          </Text>
        </TouchableOpacity>
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
