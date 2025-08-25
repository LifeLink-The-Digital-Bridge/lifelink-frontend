import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export function useImagePicker() {
  const [imageUri, setImageUri] = useState<string>('');

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
      setImageUri(uri);
      return uri;
    }
  };

  return {
    imageUri,
    pickImage,
    setImageUri,
  };
}
