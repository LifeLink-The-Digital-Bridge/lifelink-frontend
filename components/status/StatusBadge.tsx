import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../utils/responsive';
import { formatStatusDisplay, getStatusColor, getStatusInfo } from "../../utils/statusHelpers";

interface StatusBadgeProps {
  status: string;
  theme: any;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, theme }) => {
  const displayStatus = formatStatusDisplay(status);
  const statusColor = getStatusColor(status, theme);
  const statusInfo = getStatusInfo(status);

  return (
    <View
      style={{
        backgroundColor: statusColor + "20",
        borderWidth: 1,
        borderColor: statusColor + "40",
        borderRadius: 8,
        paddingVertical: hp("0.5%"),
        paddingHorizontal: wp("3%"),
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
      }}
    >
      <Feather name={statusInfo.icon as any} size={wp("3%")} color={statusColor} />
      <View>
        <Text
          style={{
            color: statusColor,
            fontSize: wp("3%"),
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          {displayStatus.text}
        </Text>
        {displayStatus.subtext && (
          <Text
            style={{
              color: statusColor,
              fontSize: wp("2.5%"),
              fontWeight: "500",
              marginTop: -2,
            }}
          >
            {displayStatus.subtext}
          </Text>
        )}
      </View>
    </View>
  );
};
