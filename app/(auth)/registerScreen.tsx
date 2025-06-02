import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import styles from "../../constants/styles/loginStyles";
import { router } from "expo-router";
import { registerUser } from "../../scripts/api/registerApi";
import type { RegisterRequest } from "../../scripts/api/registerApi";
import AppLayout from "../../components/AppLayout";
import { Feather } from "@expo/vector-icons";

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
  if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = "Invalid email format";
  }
  if (form.dob && !/^\d{4}-\d{2}-\d{2}$/.test(form.dob)) {
    errors.dob = "Date must be in YYYY-MM-DD format";
  }
  if (form.phone && !/^\d{10}$/.test(form.phone)) {
    errors.phone = "Phone must be 10 digits";
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

export default function RegisterScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<RegisterRequest>({
    name: "",
    email: "",
    username: "",
    password: "",
    phone: "",
    dob: "",
    gender: "",
    profileImageUrl: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (key: keyof RegisterRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleRegister = async () => {
    const requiredFields: (keyof RegisterRequest)[] = [
      "name",
      "email",
      "username",
      "password",
      "phone",
      "dob",
      "gender",
      "profileImageUrl",
    ];
    const validationErrors = validateForm(formData, requiredFields);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      const data = await registerUser(formData);
      Alert.alert("Registration Successful", `Welcome, ${data.username}`);
      router.push("./loginScreen");
    } catch (error: any) {
      Alert.alert("Registration Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout hideHeader={true}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Register for LifeLink</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={formData.name}
          onChangeText={(text) => handleChange("name", text)}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={formData.email}
          onChangeText={(text) => handleChange("email", text)}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        <TextInput
          style={styles.input}
          placeholder="Username"
          autoCapitalize="none"
          value={formData.username}
          onChangeText={(text) => handleChange("username", text)}
        />
        {errors.username && (
          <Text style={styles.errorText}>{errors.username}</Text>
        )}
        <View style={{ position: "relative" }}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={formData.password}
            onChangeText={(text) => handleChange("password", text)}
          />
          <TouchableOpacity
            style={{
              position: "absolute",
              right: 15,
              top: 8,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1,
            }}
            onPress={() => setShowPassword((prev) => !prev)}
          >
            <Feather
              name={showPassword ? "eye" : "eye-off"}
              size={22}
              color="#636e72"
            />
          </TouchableOpacity>
        </View>
        {errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}
        <TextInput
          style={styles.input}
          placeholder="Phone"
          keyboardType="phone-pad"
          value={formData.phone}
          onChangeText={(text) => handleChange("phone", text)}
        />
        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        <TextInput
          style={styles.input}
          placeholder="Date of Birth (YYYY-MM-DD)"
          value={formData.dob}
          onChangeText={(text) => handleChange("dob", text)}
        />
        {errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}
        <View style={[styles.input, { padding: 0 }]}>
          <Picker
            selectedValue={formData.gender}
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
        <TouchableOpacity
          style={[styles.imagePicker, { backgroundColor: "#00b894" }]}
          onPress={() =>
            pickImage((uri) => handleChange("profileImageUrl", uri))
          }
        >
          <Text style={[styles.imagePickerText, { color: "#fff" }]}>
            {formData.profileImageUrl
              ? "Change Profile Image"
              : "Upload Profile Image"}
          </Text>
        </TouchableOpacity>
        {errors.profileImageUrl && (
          <Text style={styles.errorText}>{errors.profileImageUrl}</Text>
        )}
        {formData.profileImageUrl && (
          <Image
            source={{ uri: formData.profileImageUrl }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              alignSelf: "center",
              marginBottom: 10,
            }}
          />
        )}
        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("./loginScreen")}>
          <Text style={styles.linkText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </AppLayout>
  );
}
