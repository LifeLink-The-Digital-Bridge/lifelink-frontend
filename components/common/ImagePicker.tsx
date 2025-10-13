import React from 'react';
import { View, TouchableOpacity, Text, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import authStyles from '../../constants/styles/authStyles';

interface ImagePickerComponentProps {
  imageUri?: string;
  onImageSelected: (uri: string) => void;
  placeholder?: string;
}

export function ImagePickerComponent({ 
  imageUri, 
  onImageSelected, 
  placeholder = "Upload Profile Image" 
}: ImagePickerComponentProps) {
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission denied',
        'We need camera roll permissions to select a profile image.'
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
      const uri = `data:image/jpeg;base64,${result.assets[0].base64}`;
      onImageSelected(uri);
    }
  };

  return (
    <View style={authStyles.inputContainer}>
      <TouchableOpacity
        style={authStyles.imagePicker}
        onPress={pickImage}
        activeOpacity={0.8}
      >
        <Feather name="camera" size={18} color="#fff" />
        <Text style={authStyles.imagePickerText}>
          {imageUri ? "Change Photo" : placeholder}
        </Text>
      </TouchableOpacity>
      
      {imageUri && (
        <View style={authStyles.profileImageContainer}>
          <Image
            source={{ uri: imageUri }}
            style={authStyles.profileImage}
          />
        </View>
      )}
    </View>
  );
}
