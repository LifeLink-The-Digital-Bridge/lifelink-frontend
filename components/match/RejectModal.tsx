import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface RejectModalProps {
  visible: boolean;
  reason: string;
  actionLoading: boolean;
  theme: any;
  onClose: () => void;
  onReasonChange: (text: string) => void;
  onConfirm: () => void;
}

export const RejectModal: React.FC<RejectModalProps> = ({
  visible,
  reason,
  actionLoading,
  theme,
  onClose,
  onReasonChange,
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
              Reject Match
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
            Please provide a reason for rejection (min 10 characters)
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
            placeholder="Reason for rejection *"
            placeholderTextColor={theme.textSecondary}
            value={reason}
            onChangeText={onReasonChange}
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
                backgroundColor: theme.error,
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
                  Confirm Reject
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
