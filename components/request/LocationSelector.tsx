import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, TextInput, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { createUnifiedStyles } from '../../constants/styles/unifiedStyles';
import { fetchRecipientAddresses, addRecipientAddress } from '../../app/api/requestApi';

interface Location {
  id: string;
  addressLine: string;
  city: string;
  state: string;
  country: string;
  landmark?: string;
  area?: string;
  district?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
}

interface LocationSelectorProps {
  selectedLocationId: string;
  onLocationSelect: (locationId: string) => void;
  recipientId: string;
}

export function LocationSelector({ selectedLocationId, onLocationSelect, recipientId }: LocationSelectorProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createUnifiedStyles(theme);

  const [modalVisible, setModalVisible] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [addingLocation, setAddingLocation] = useState(false);

  const [newLocation, setNewLocation] = useState({
    addressLine: '',
    landmark: '',
    area: '',
    city: '',
    district: '',
    state: '',
    country: '',
    pincode: '',
    latitude: null as number | null,
    longitude: null as number | null
  });
  useEffect(() => {
    setLocations([]);
    setSelectedLocation(null);
    setModalVisible(false);
    setShowAddForm(false);
  }, [recipientId]);

  useEffect(() => {
    if (modalVisible && recipientId) {
      fetchLocations();
    }
  }, [modalVisible, recipientId]);

  useEffect(() => {
    if (selectedLocationId && locations.length > 0) {
      const location = locations.find(loc => loc.id === selectedLocationId);
      setSelectedLocation(location || null);
    }
  }, [selectedLocationId, locations]);

  const fetchLocations = async () => {
    if (!recipientId) return;

    setLoading(true);
    try {
      console.log('🔄 Fetching locations for recipient:', recipientId);
      const data = await fetchRecipientAddresses(recipientId);
      setLocations(data);
      console.log('✅ Fetched recipient locations:', data.length);
    } catch (error: any) {
      console.error('❌ Error fetching recipient locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    onLocationSelect(location.id);
    setModalVisible(false);
  };

  const handleAddNewLocation = async () => {
    if (!newLocation.addressLine || !newLocation.city || !newLocation.state) {
      alert('Please fill in required fields (Address Line, City, State)');
      return;
    }

    setAddingLocation(true);
    try {
      const payload = {
        addressLine: newLocation.addressLine,
        landmark: newLocation.landmark || '',
        area: newLocation.area || '',
        city: newLocation.city,
        district: newLocation.district || '',
        state: newLocation.state,
        country: newLocation.country || 'India',
        pincode: newLocation.pincode || '',
        latitude: newLocation.latitude || 0,
        longitude: newLocation.longitude || 0,
      };

      const newLocationData = await addRecipientAddress(recipientId, payload);
      const updatedLocations = [...locations, newLocationData];
      setLocations(updatedLocations);
      handleLocationSelect(newLocationData);
      resetAddForm();
    } catch (error: any) {
      console.error('❌ Error adding recipient location:', error);
      alert('Failed to add location: ' + error.message);
    } finally {
      setAddingLocation(false);
    }
  };

  const resetAddForm = () => {
    setShowAddForm(false);
    setNewLocation({
      addressLine: '',
      landmark: '',
      area: '',
      city: '',
      district: '',
      state: '',
      country: '',
      pincode: '',
      latitude: null,
      longitude: null
    });
  };

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconContainer}>
          <Feather name="map-pin" size={18} color={theme.primary} />
        </View>
        <Text style={styles.sectionTitle}>Request Location *</Text>
      </View>

      <TouchableOpacity
        style={[styles.input, styles.locationSelector]}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.locationSelectorContent}>
          <Text style={[styles.inputText, selectedLocation ? {} : { color: theme.textSecondary }]}>
            {selectedLocation
              ? `${selectedLocation.addressLine}, ${selectedLocation.city}`
              : 'Select request location'
            }
          </Text>
          <Feather name="chevron-down" size={20} color={theme.textSecondary} />
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setModalVisible(false);
          resetAddForm();
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {showAddForm ? 'Add New Location' : 'Select Location'}
              </Text>
              <TouchableOpacity onPress={() => {
                setModalVisible(false);
                resetAddForm();
              }}>
                <Feather name="x" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            {!showAddForm ? (
              <>
                {loading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.primary} />
                    <Text style={styles.loadingText}>Loading locations...</Text>
                  </View>
                ) : (
                  <>
                    <FlatList
                      data={locations}
                      keyExtractor={(item) => item.id}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={[
                            styles.locationItem,
                            selectedLocationId === item.id && styles.selectedLocationItem
                          ]}
                          onPress={() => handleLocationSelect(item)}
                        >
                          <View style={styles.locationItemContent}>
                            <Text style={styles.locationAddress}>{item.addressLine}</Text>
                            <Text style={styles.locationDetails}>
                              {item.city}, {item.state}, {item.country}
                            </Text>
                          </View>
                          {selectedLocationId === item.id && (
                            <Feather name="check" size={20} color={theme.primary} />
                          )}
                        </TouchableOpacity>
                      )}
                      ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                          <Feather name="map-pin" size={48} color={theme.textSecondary} />
                          <Text style={styles.emptyText}>No saved locations</Text>
                          <Text style={styles.emptySubtext}>Add your first location to get started</Text>
                        </View>
                      }
                    />

                    <TouchableOpacity
                      style={styles.addNewButton}
                      onPress={() => setShowAddForm(true)}
                    >
                      <Feather name="plus" size={20} color={theme.primary} />
                      <Text style={styles.addNewText}>Add New Location</Text>
                    </TouchableOpacity>
                  </>
                )}
              </>
            ) : (
              <View style={styles.addForm}>
                <Text style={styles.addFormTitle}>Add New Address</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Address Line *"
                  placeholderTextColor={theme.textSecondary}
                  value={newLocation.addressLine}
                  onChangeText={(text) => setNewLocation({ ...newLocation, addressLine: text })}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Landmark"
                  placeholderTextColor={theme.textSecondary}
                  value={newLocation.landmark}
                  onChangeText={(text) => setNewLocation({ ...newLocation, landmark: text })}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Area"
                  placeholderTextColor={theme.textSecondary}
                  value={newLocation.area}
                  onChangeText={(text) => setNewLocation({ ...newLocation, area: text })}
                />

                <View style={styles.row}>
                  <TextInput
                    style={[styles.input, { flex: 1, marginRight: 8 }]}
                    placeholder="City *"
                    placeholderTextColor={theme.textSecondary}
                    value={newLocation.city}
                    onChangeText={(text) => setNewLocation({ ...newLocation, city: text })}
                  />
                  <TextInput
                    style={[styles.input, { flex: 1, marginLeft: 8 }]}
                    placeholder="State *"
                    placeholderTextColor={theme.textSecondary}
                    value={newLocation.state}
                    onChangeText={(text) => setNewLocation({ ...newLocation, state: text })}
                  />
                </View>

                <View style={styles.row}>
                  <TextInput
                    style={[styles.input, { flex: 1, marginRight: 8 }]}
                    placeholder="Country"
                    placeholderTextColor={theme.textSecondary}
                    value={newLocation.country}
                    onChangeText={(text) => setNewLocation({ ...newLocation, country: text })}
                  />
                  <TextInput
                    style={[styles.input, { flex: 1, marginLeft: 8 }]}
                    placeholder="Pincode"
                    placeholderTextColor={theme.textSecondary}
                    value={newLocation.pincode}
                    onChangeText={(text) => setNewLocation({ ...newLocation, pincode: text })}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={resetAddForm}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, styles.saveButton]}
                    onPress={handleAddNewLocation}
                    disabled={addingLocation}
                  >
                    {addingLocation ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.saveButtonText}>Add Location</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
