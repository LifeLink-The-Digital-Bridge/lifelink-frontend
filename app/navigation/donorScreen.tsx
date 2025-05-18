import React, { useEffect, useState } from 'react';
import {
  Alert,
  Text,
  View,
  ScrollView,
  TextInput,
  Switch,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../utils/auth-context';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import styles from '../../constants/styles/dashboardStyles';
import { registerDonor } from '../../scripts/api/donorApi';

const calculateAge = (dobString: string): number => {
  const today = new Date();
  const dob = new Date(dobString);
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};


const DonorScreen: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

  
  const [hemoglobinLevel, setHemoglobinLevel] = useState<string>('');
  const [bloodPressure, setBloodPressure] = useState<string>('');
  const [hasDiseases, setHasDiseases] = useState<boolean>(false);
  const [takingMedication, setTakingMedication] = useState<boolean>(false);
  const [diseaseDescription, setDiseaseDescription] = useState<string>('');
  const [recentlyIll, setRecentlyIll] = useState<boolean>(false);
  const [isPregnant, setIsPregnant] = useState<boolean>(false);

  const [dob, setDob] = useState<string>('');
  const [age, setAge] = useState<number | null>(null);
  const [weight, setWeight] = useState<string>('');
  const [weightEligible, setWeightEligible] = useState<boolean>(false);
  const [medicalClearance, setMedicalClearance] = useState<boolean>(false);
  const [recentTattooOrPiercing, setRecentTattooOrPiercing] = useState<boolean>(false);
  const [recentTravel, setRecentTravel] = useState<boolean>(false);
  const [recentTravelDetails, setRecentTravelDetails] = useState<string>('');
  const [recentVaccination, setRecentVaccination] = useState<boolean>(false);
  const [recentSurgery, setRecentSurgery] = useState<boolean>(false);
  const [chronicDiseases, setChronicDiseases] = useState<string>('');
  const [allergies, setAllergies] = useState<string>('');
  const [lastDonationDate, setLastDonationDate] = useState<string>('');


  const [isConsented, setIsConsented] = useState<boolean>(false);

  const [city, setCity] = useState<string>('');
  const [stateVal, setStateVal] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [pincode, setPincode] = useState<string>('');

  const [gender, setGender] = useState<string>('');
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const w = parseFloat(weight);
    setWeightEligible(!isNaN(w) && w >= 50);
  }, [weight]);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedGender = await SecureStore.getItemAsync('gender');
      if (storedGender) setGender(storedGender);
      const storedUserId = await SecureStore.getItemAsync('userId');
      if (storedUserId) setUserId(storedUserId);
    };
    fetchUserData();
  }, []);
    useEffect(() => {
    const fetchDob = async () => {
      const storedDob = await SecureStore.getItemAsync('dob');
      if (storedDob) {
        setDob(storedDob);
        setAge(calculateAge(storedDob));
      }
    };
    fetchDob();
  }, []);
  const isFormValid = (): boolean => {
    if (
      !hemoglobinLevel ||
      isNaN(Number(hemoglobinLevel)) ||
      !bloodPressure ||
      !weight ||
      isNaN(Number(weight)) ||
      (hasDiseases && !diseaseDescription) ||
      !isConsented ||
      !dob ||
      !age ||
      !city ||
      !stateVal ||
      !country ||
      !pincode
    ) {
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      Alert.alert('Incomplete Form', 'Please fill all required fields.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        registrationDate: new Date().toISOString().slice(0, 10),
        status: "ACTIVE",
        medicalDetails: {
          hemoglobinLevel: Number(hemoglobinLevel),
          bloodPressure,
          hasDiseases,
          takingMedication,
          diseaseDescription,
          recentlyIll,
          ...(gender && gender.toUpperCase() === 'FEMALE' && { isPregnant }),
        },
        eligibilityCriteria: {
          ageEligible: Number(age) >= 18,
          age: Number(age),
          dob,
          weightEligible,
          weight: Number(weight),
          medicalClearance,
          recentTattooOrPiercing,
          recentTravel,
          recentTravelDetails,
          recentVaccination,
          recentSurgery,
          chronicDiseases,
          allergies,
          lastDonationDate: lastDonationDate || null,
        },
        consentForm: {
          userId,
          isConsented,
          consentedAt: new Date().toISOString(),
          consentType: "BLOOD_DONATION",
        },
        location: {
          city,
          state: stateVal,
          country,
          pincode,
        }
      };

      const response = await registerDonor(payload);
      if (response && response.id) {
        await SecureStore.setItemAsync('donorId', response.id);
        Alert.alert('Success', 'You are now registered as a donor!');
        router.replace('./donate'); 
      } else {
        throw new Error('Registration succeeded but donorId missing in response.');
      }
    } catch (error : any) {
      Alert.alert('Registration Failed', error.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ScrollView style={styles.bg} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.sectionTitle}>Medical Details</Text>
      <TextInput
        style={styles.input}
        placeholder="Hemoglobin Level (g/dL)"
        keyboardType="numeric"
        value={hemoglobinLevel}
        onChangeText={setHemoglobinLevel}
      />
      <TextInput
        style={styles.input}
        placeholder="Blood Pressure (e.g., 120/80)"
        value={bloodPressure}
        onChangeText={setBloodPressure}
      />
      <View style={styles.switchRow}>
        <Text style={styles.label}>Any diseases?</Text>
        <Switch value={hasDiseases} onValueChange={setHasDiseases} />
      </View>
      {hasDiseases && (
        <TextInput
          style={styles.input}
          placeholder="Describe diseases"
          value={diseaseDescription}
          onChangeText={setDiseaseDescription}
        />
      )}
      <View style={styles.switchRow}>
        <Text style={styles.label}>Taking Medication?</Text>
        <Switch value={takingMedication} onValueChange={setTakingMedication} />
      </View>
      <View style={styles.switchRow}>
        <Text style={styles.label}>Recently Ill?</Text>
        <Switch value={recentlyIll} onValueChange={setRecentlyIll} />
      </View>
      {gender && gender.toUpperCase() === 'FEMALE' && (
        <View style={styles.switchRow}>
          <Text style={styles.label}>Currently Pregnant?</Text>
          <Switch value={isPregnant} onValueChange={setIsPregnant} />
        </View>
      )}

      <Text style={styles.sectionTitle}>Eligibility Criteria</Text>
      <TextInput
        value={dob}
        editable={false}
        style={{ backgroundColor: '#f1f2f6', color: '#636e72', marginBottom: 8 }}
      />
      {age !== null && (
        <Text style={{ color: age >= 18 ? 'green' : 'red' }}>
          Age: {age} ({age >= 18 ? 'Eligible' : 'Not eligible'})
        </Text>
      )}
      <TextInput
        style={styles.input}
        placeholder="Weight (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />
      <Text style={{
        color: weight ? (weightEligible ? 'green' : 'red') : '#636e72',
        marginBottom: 8
      }}>
        {weight
          ? weightEligible
            ? 'Eligible for donation (weight ≥ 50kg)'
            : 'Not eligible (weight < 50kg)'
          : ''}
      </Text>
      <View style={styles.switchRow}>
        <Text style={styles.label}>Medical Clearance?</Text>
        <Switch value={medicalClearance} onValueChange={setMedicalClearance} />
      </View>
      <View style={styles.switchRow}>
        <Text style={styles.label}>Recent Tattoo or Piercing?</Text>
        <Switch value={recentTattooOrPiercing} onValueChange={setRecentTattooOrPiercing} />
      </View>
      <View style={styles.switchRow}>
        <Text style={styles.label}>Recent Travel?</Text>
        <Switch value={recentTravel} onValueChange={setRecentTravel} />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Recent Travel Details"
        value={recentTravelDetails}
        onChangeText={setRecentTravelDetails}
      />
      <View style={styles.switchRow}>
        <Text style={styles.label}>Recent Vaccination?</Text>
        <Switch value={recentVaccination} onValueChange={setRecentVaccination} />
      </View>
      <View style={styles.switchRow}>
        <Text style={styles.label}>Recent Surgery?</Text>
        <Switch value={recentSurgery} onValueChange={setRecentSurgery} />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Chronic Diseases (if any)"
        value={chronicDiseases}
        onChangeText={setChronicDiseases}
      />
      <TextInput
        style={styles.input}
        placeholder="Allergies (if any)"
        value={allergies}
        onChangeText={setAllergies}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Donation Date (YYYY-MM-DD, optional)"
        value={lastDonationDate}
        onChangeText={setLastDonationDate}
      />

      <Text style={styles.sectionTitle}>Consent</Text>
      <View style={styles.switchRow}>
        <Text style={styles.label}>I consent to donate blood</Text>
        <Switch value={isConsented} onValueChange={setIsConsented} />
      </View>

      <Text style={styles.sectionTitle}>Location</Text>
      <TextInput
        style={styles.input}
        placeholder="City"
        value={city}
        onChangeText={setCity}
      />
      <TextInput
        style={styles.input}
        placeholder="State"
        value={stateVal}
        onChangeText={setStateVal}
      />
      <TextInput
        style={styles.input}
        placeholder="Country"
        value={country}
        onChangeText={setCountry}
      />
      <TextInput
        style={styles.input}
        placeholder="Pincode"
        value={pincode}
        onChangeText={setPincode}
      />

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isFormValid() && !loading ? "#00b894" : "#b2bec3" }
        ]}
        onPress={handleSubmit}
        disabled={!isFormValid() || loading}
        activeOpacity={0.8}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.buttonText}>Register as Donor</Text>
        }
      </TouchableOpacity>
    </ScrollView>
  );
};

export default DonorScreen;
