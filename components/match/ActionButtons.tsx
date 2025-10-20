import React from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface ActionButtonsProps {
  canConfirmMatch: boolean;
  canRejectMatch: boolean;
  canWithdrawMatch: boolean;
  canShowCompletion: boolean;
  confirmingMatch: boolean;
  actionLoading: boolean;
  confirmButtonText: string;
  theme: any;
  styles: any;
  onConfirm: () => void;
  onReject: () => void;
  onWithdraw: () => void;
  onComplete: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  canConfirmMatch,
  canRejectMatch,
  canWithdrawMatch,
  canShowCompletion,
  confirmingMatch,
  actionLoading,
  confirmButtonText,
  theme,
  styles,
  onConfirm,
  onReject,
  onWithdraw,
  onComplete,
}) => {
  return (
    <View style={{ marginTop: hp("2%"), gap: hp("1.5%") }}>
      {canConfirmMatch && (
        <TouchableOpacity
          style={{
            backgroundColor: theme.success,
            paddingVertical: hp("1.8%"),
            paddingHorizontal: wp("5%"),
            borderRadius: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            opacity: confirmingMatch ? 0.6 : 1,
            shadowColor: theme.success,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5,
          }}
          onPress={onConfirm}
          disabled={confirmingMatch}
          activeOpacity={0.8}
        >
          {confirmingMatch ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Feather name="check-circle" size={wp("5.5%")} color="#fff" />
              <Text
                style={{
                  color: "#fff",
                  fontSize: wp("4.2%"),
                  fontWeight: "700",
                  marginLeft: wp("2.5%"),
                  letterSpacing: 0.5,
                }}
              >
                {confirmButtonText}
              </Text>
            </>
          )}
        </TouchableOpacity>
      )}

      {canWithdrawMatch && (
        <TouchableOpacity
          style={{
            backgroundColor: theme.card,
            paddingVertical: hp("1.8%"),
            paddingHorizontal: wp("5%"),
            borderRadius: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 2,
            borderColor: theme.primary,
            opacity: actionLoading ? 0.6 : 1,
          }}
          onPress={onWithdraw}
          disabled={actionLoading}
          activeOpacity={0.7}
        >
          <Feather name="corner-up-left" size={wp("5.5%")} color={theme.primary} />
          <Text
            style={{
              color: theme.primary,
              fontSize: wp("4.2%"),
              fontWeight: "700",
              marginLeft: wp("2.5%"),
              letterSpacing: 0.5,
            }}
          >
            Withdraw Confirmation
          </Text>
        </TouchableOpacity>
      )}

      {canRejectMatch && (
        <TouchableOpacity
          style={{
            backgroundColor: theme.card,
            paddingVertical: hp("1.8%"),
            paddingHorizontal: wp("5%"),
            borderRadius: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 2,
            borderColor: theme.error,
            opacity: actionLoading ? 0.6 : 1,
          }}
          onPress={onReject}
          disabled={actionLoading}
          activeOpacity={0.7}
        >
          <Feather name="x-circle" size={wp("5.5%")} color={theme.error} />
          <Text
            style={{
              color: theme.error,
              fontSize: wp("4.2%"),
              fontWeight: "700",
              marginLeft: wp("2.5%"),
              letterSpacing: 0.5,
            }}
          >
            Reject Match
          </Text>
        </TouchableOpacity>
      )}

      {canShowCompletion && (
        <TouchableOpacity
          style={{
            backgroundColor: theme.success,
            paddingVertical: hp("1.8%"),
            paddingHorizontal: wp("5%"),
            borderRadius: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            opacity: actionLoading ? 0.6 : 1,
            shadowColor: theme.success,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5,
          }}
          onPress={onComplete}
          disabled={actionLoading}
          activeOpacity={0.8}
        >
          <Feather name="check-square" size={wp("5.5%")} color="#fff" />
          <Text
            style={{
              color: "#fff",
              fontSize: wp("4.2%"),
              fontWeight: "700",
              marginLeft: wp("2.5%"),
              letterSpacing: 0.5,
            }}
          >
            Confirm Completion
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
