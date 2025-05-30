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

const genderOptions = [
  { label: "Select Gender", value: "" },
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
  { label: "Other", value: "OTHER" },
];

export default function RegisterScreen() {
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

  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
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
      base64: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setFormData((prev) => ({
        ...prev,
        profileImageUrl: `data:image/jpeg;base64,${result.assets[0].base64}`,
      }));
    }
  };

  const handleChange = (key: keyof RegisterRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
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
    const emptyField = requiredFields.find((field) => !formData[field]);

    if (emptyField) {
      Alert.alert(
        "Validation Error",
        `Please fill in the ${emptyField} field.`
      );
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
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={formData.email}
          onChangeText={(text) => handleChange("email", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Username"
          autoCapitalize="none"
          value={formData.username}
          onChangeText={(text) => handleChange("username", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={formData.password}
          onChangeText={(text) => handleChange("password", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          keyboardType="phone-pad"
          value={formData.phone}
          onChangeText={(text) => handleChange("phone", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Date of Birth (YYYY-MM-DD)"
          value={formData.dob}
          onChangeText={(text) => handleChange("dob", text)}
        />

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

        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <Text style={styles.imagePickerText}>
            {formData.profileImageUrl
              ? "Change Profile Image"
              : "Upload Profile Image"}
          </Text>
        </TouchableOpacity>
        {formData.profileImageUrl ? (
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
        ) : null}

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
