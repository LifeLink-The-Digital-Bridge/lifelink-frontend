import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  FlatList, 
  StyleSheet,
  Platform 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';

interface PickerItem {
  label: string;
  value: string;
  color?: string;
}

interface CustomPickerProps {
  selectedValue: string;
  onValueChange: (value: string) => void;
  items: PickerItem[];
  placeholder?: string;
  style?: any;
  disabled?: boolean;
}

export function CustomPicker({ 
  selectedValue, 
  onValueChange, 
  items, 
  placeholder = "Select an option",
  style,
  disabled = false
}: CustomPickerProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  const selectedItem = items.find(item => item.value === selectedValue);
  const displayText = selectedItem ? selectedItem.label : placeholder;

  const styles = StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      backgroundColor: theme.inputBackground,
      overflow: 'hidden',
    },
    trigger: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 12,
      minHeight: 48,
    },
    triggerText: {
      fontSize: 16,
      color: selectedItem ? theme.text : theme.textSecondary,
      flex: 1,
    },
    icon: {
      marginLeft: 8,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: theme.card,
      borderRadius: 12,
      maxHeight: 300,
      width: '80%',
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    modalHeader: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border + '40',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
    },
    closeButton: {
      padding: 4,
    },
    listContainer: {
      maxHeight: 200,
    },
    item: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border + '20',
    },
    lastItem: {
      borderBottomWidth: 0,
    },
    itemText: {
      fontSize: 16,
      color: theme.text,
    },
    selectedItem: {
      backgroundColor: theme.primary + '15',
    },
    selectedItemText: {
      color: theme.primary,
      fontWeight: '600',
    },
    disabledContainer: {
      opacity: 0.6,
    },
    disabledText: {
      color: theme.textSecondary,
    },
  });

  const handleItemSelect = (value: string) => {
    onValueChange(value);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.container,
          disabled && styles.disabledContainer,
          style
        ]}
        onPress={() => !disabled && setModalVisible(true)}
        disabled={disabled}
      >
        <View style={styles.trigger}>
          <Text style={[
            styles.triggerText,
            disabled && styles.disabledText
          ]}>
            {displayText}
          </Text>
          <Feather 
            name="chevron-down" 
            size={20} 
            color={disabled ? theme.textSecondary : theme.text}
            style={styles.icon}
          />
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
            onPress={() => {}}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Option</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Feather name="x" size={20} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={items}
              keyExtractor={(item) => item.value}
              style={styles.listContainer}
              renderItem={({ item, index }) => {
                const isSelected = item.value === selectedValue;
                const isLast = index === items.length - 1;
                
                return (
                  <TouchableOpacity
                    style={[
                      styles.item,
                      isLast && styles.lastItem,
                      isSelected && styles.selectedItem,
                    ]}
                    onPress={() => handleItemSelect(item.value)}
                  >
                    <Text style={[
                      styles.itemText,
                      isSelected && styles.selectedItemText,
                      item.color && { color: item.color }
                    ]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
