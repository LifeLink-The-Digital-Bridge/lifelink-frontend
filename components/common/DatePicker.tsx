import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import { useTheme } from "../../utils/theme-context";
import { lightTheme, darkTheme } from "../../constants/styles/authStyles";

interface DatePickerProps {
  selectedDate?: string;
  onDateChange: (date: string) => void;
  hasError?: boolean;
  placeholder?: string;
}

export function CustomDatePicker({
  selectedDate,
  onDateChange,
  hasError,
  placeholder = "Select Date",
}: DatePickerProps) {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;
  const [showPicker, setShowPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [currentDate, setCurrentDate] = useState(
    selectedDate || new Date().toISOString().split("T")[0]
  );

  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDateSelect = (day: any) => {
    onDateChange(day.dateString);
    setShowPicker(false);
  };

  const getCurrentYear = () => {
    return parseInt(currentDate.split("-")[0]);
  };

  const getCurrentMonth = () => {
    return parseInt(currentDate.split("-")[1]);
  };

  const handleYearSelect = (year: number) => {
    const [, month, day] = currentDate.split("-");
    setCurrentDate(`${year}-${month}-${day}`);
    setShowYearPicker(false);
  };

  const handleMonthSelect = (month: number) => {
    const [year, , day] = currentDate.split("-");
    const monthStr = String(month).padStart(2, "0");
    setCurrentDate(`${year}-${monthStr}-${day}`);
    setShowMonthPicker(false);
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= 1900; i--) {
      years.push(i);
    }
    return years;
  };

  const months = [
    { num: 1, name: "January" },
    { num: 2, name: "February" },
    { num: 3, name: "March" },
    { num: 4, name: "April" },
    { num: 5, name: "May" },
    { num: 6, name: "June" },
    { num: 7, name: "July" },
    { num: 8, name: "August" },
    { num: 9, name: "September" },
    { num: 10, name: "October" },
    { num: 11, name: "November" },
    { num: 12, name: "December" },
  ];

  const calendarTheme = {
    backgroundColor: theme.card,
    calendarBackground: theme.card,
    textSectionTitleColor: theme.text,
    selectedDayBackgroundColor: theme.primary,
    selectedDayTextColor: "#ffffff",
    todayTextColor: theme.primary,
    dayTextColor: theme.text,
    textDisabledColor: theme.textSecondary + "50",
    monthTextColor: theme.text,
    textMonthFontWeight: "bold" as const,
    arrowColor: theme.primary,
    textDayFontSize: 16,
    textMonthFontSize: 18,
    textDayHeaderFontSize: 14,
  };

  const styles = StyleSheet.create({
    container: {
      borderWidth: 2,
      borderColor: hasError ? theme.error : theme.border,
      borderRadius: 12,
      backgroundColor: theme.inputBackground,
      overflow: "hidden",
    },
    trigger: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
      minHeight: 50,
    },
    triggerText: {
      fontSize: 16,
      color: selectedDate ? theme.text : theme.textSecondary,
      flex: 1,
    },
    icon: {
      marginLeft: 8,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 20,
      width: "90%",
      maxWidth: 400,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.text,
    },
    dateSelectors: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 16,
    },
    selector: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 12,
      backgroundColor: theme.inputBackground,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.border,
    },
    selectorText: {
      fontSize: 16,
      color: theme.text,
      fontWeight: "600",
    },
    pickerModal: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 20,
      width: "80%",
      maxWidth: 300,
      maxHeight: 400,
    },
    pickerHeader: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 16,
      textAlign: "center",
    },
    pickerItem: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border + "30",
    },
    pickerItemText: {
      fontSize: 16,
      color: theme.text,
      textAlign: "center",
    },
    selectedPickerItem: {
      backgroundColor: theme.primary + "20",
      borderRadius: 8,
    },
    buttonContainer: {
      flexDirection: "row",
      gap: 12,
      marginTop: 20,
    },
    button: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 10,
      alignItems: "center",
    },
    cancelButton: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: theme.border,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.text,
    },
  });

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={() => setShowPicker(true)}
      >
        <View style={styles.trigger}>
          <Text style={styles.triggerText}>
            {selectedDate ? formatDisplayDate(selectedDate) : placeholder}
          </Text>
          <Feather
            name="calendar"
            size={20}
            color={theme.text}
            style={styles.icon}
          />
        </View>
      </TouchableOpacity>

      <Modal
        visible={showPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPicker(false)}
        >
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
            onPress={() => {}}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Date</Text>
              <TouchableOpacity onPress={() => setShowPicker(false)}>
                <Feather name="x" size={20} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.dateSelectors}>
              <TouchableOpacity
                style={styles.selector}
                onPress={() => setShowMonthPicker(true)}
              >
                <Text style={styles.selectorText}>
                  {months[getCurrentMonth() - 1].name}
                </Text>
                <Feather name="chevron-down" size={20} color={theme.text} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.selector}
                onPress={() => setShowYearPicker(true)}
              >
                <Text style={styles.selectorText}>{getCurrentYear()}</Text>
                <Feather name="chevron-down" size={20} color={theme.text} />
              </TouchableOpacity>
            </View>

            <Calendar
              key={currentDate}
              current={currentDate}
              onDayPress={handleDateSelect}
              markedDates={
                selectedDate
                  ? {
                      [selectedDate]: {
                        selected: true,
                        selectedColor: theme.primary,
                      },
                    }
                  : {}
              }
              maxDate={new Date().toISOString().split("T")[0]}
              minDate="1900-01-01"
              theme={calendarTheme}
              enableSwipeMonths
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setShowPicker(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={showYearPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowYearPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowYearPicker(false)}
        >
          <View style={styles.pickerModal}>
            <Text style={styles.pickerHeader}>Select Year</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {generateYears().map((year) => (
                <TouchableOpacity
                  key={year}
                  style={[
                    styles.pickerItem,
                    year === getCurrentYear() && styles.selectedPickerItem,
                  ]}
                  onPress={() => handleYearSelect(year)}
                >
                  <Text style={styles.pickerItemText}>{year}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={showMonthPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMonthPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMonthPicker(false)}
        >
          <View style={styles.pickerModal}>
            <Text style={styles.pickerHeader}>Select Month</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {months.map((month) => (
                <TouchableOpacity
                  key={month.num}
                  style={[
                    styles.pickerItem,
                    month.num === getCurrentMonth() &&
                      styles.selectedPickerItem,
                  ]}
                  onPress={() => handleMonthSelect(month.num)}
                >
                  <Text style={styles.pickerItemText}>{month.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
