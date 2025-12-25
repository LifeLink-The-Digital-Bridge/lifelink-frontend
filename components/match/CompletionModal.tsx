import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../utils/responsive';
import { CompletionConfirmationDTO } from '../../app/api/matchingApi';

interface CompletionModalProps {
  visible: boolean;
  data: CompletionConfirmationDTO;
  actionLoading: boolean;
  theme: any;
  onClose: () => void;
  onDataChange: (data: CompletionConfirmationDTO) => void;
  onConfirm: () => void;
}

export const CompletionModal: React.FC<CompletionModalProps> = ({
  visible,
  data,
  actionLoading,
  theme,
  onClose,
  onDataChange,
  onConfirm,
}) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
          padding: wp("5%"),
        }}
      >
        <View
          style={{
            backgroundColor: theme.card,
            borderRadius: 16,
            padding: wp("5%"),
            width: "100%",
            maxWidth: 500,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: hp("2%"),
            }}
          >
            <Text style={{ fontSize: wp("5%"), fontWeight: "bold", color: theme.text }}>
              Confirm Completion
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={wp("6%")} color={theme.text} />
            </TouchableOpacity>
          </View>

          <Text
            style={{
              fontSize: wp("3.5%"),
              color: theme.textSecondary,
              marginBottom: hp("2%"),
            }}
          >
            Please confirm that you've received the donation
          </Text>

          <Text style={{ fontSize: wp("3.5%"), color: theme.text, marginBottom: hp("1%") }}>
            Received Date
          </Text>
          <TextInput
            style={{
              backgroundColor: theme.background,
              borderRadius: 8,
              padding: wp("3%"),
              color: theme.text,
              fontSize: wp("4%"),
              marginBottom: hp("2%"),
              borderWidth: 1,
              borderColor: theme.border,
            }}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={theme.textSecondary}
            value={data.receivedDate}
            onChangeText={(text) => onDataChange({ ...data, receivedDate: text })}
          />

          <Text style={{ fontSize: wp("3.5%"), color: theme.text, marginBottom: hp("1%") }}>
            Hospital Name
          </Text>
          <TextInput
            style={{
              backgroundColor: theme.background,
              borderRadius: 8,
              padding: wp("3%"),
              color: theme.text,
              fontSize: wp("4%"),
              marginBottom: hp("2%"),
              borderWidth: 1,
              borderColor: theme.border,
            }}
            placeholder="Hospital Name (optional)"
            placeholderTextColor={theme.textSecondary}
            value={data.hospitalName}
            onChangeText={(text) => onDataChange({ ...data, hospitalName: text })}
          />

          <Text style={{ fontSize: wp("3.5%"), color: theme.text, marginBottom: hp("1%") }}>
            Rating (1-5)
          </Text>
          <TextInput
            style={{
              backgroundColor: theme.background,
              borderRadius: 8,
              padding: wp("3%"),
              color: theme.text,
              fontSize: wp("4%"),
              marginBottom: hp("2%"),
              borderWidth: 1,
              borderColor: theme.border,
            }}
            placeholder="1-5"
            placeholderTextColor={theme.textSecondary}
            keyboardType="number-pad"
            value={data.rating?.toString() || "5"}
            onChangeText={(text) => onDataChange({ ...data, rating: parseInt(text) || 5 })}
          />

          <Text style={{ fontSize: wp("3.5%"), color: theme.text, marginBottom: hp("1%") }}>
            Notes *
          </Text>
          <TextInput
            style={{
              backgroundColor: theme.background,
              borderRadius: 8,
              padding: wp("3%"),
              color: theme.text,
              fontSize: wp("4%"),
              minHeight: hp("10%"),
              textAlignVertical: "top",
              marginBottom: hp("2%"),
              borderWidth: 1,
              borderColor: theme.border,
            }}
            placeholder="Completion notes (min 10 characters) *"
            placeholderTextColor={theme.textSecondary}
            value={data.notes || ""}
            onChangeText={(text) => onDataChange({ ...data, notes: text })}
            multiline
            maxLength={500}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: wp("3%"),
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: theme.border + "40",
                paddingVertical: hp("1.5%"),
                borderRadius: 8,
                alignItems: "center",
              }}
              onPress={onClose}
              disabled={actionLoading}
            >
              <Text
                style={{
                  color: theme.text,
                  fontSize: wp("4%"),
                  fontWeight: "600",
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: theme.success,
                paddingVertical: hp("1.5%"),
                borderRadius: 8,
                alignItems: "center",
                opacity: actionLoading ? 0.5 : 1,
              }}
              onPress={onConfirm}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text
                  style={{
                    color: "#fff",
                    fontSize: wp("4%"),
                    fontWeight: "600",
                  }}
                >
                  Confirm
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
