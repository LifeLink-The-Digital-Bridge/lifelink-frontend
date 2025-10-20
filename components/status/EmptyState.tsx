import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

interface EmptyStateProps {
  type: "donations" | "requests";
  theme: any;
  statusStyles: any;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type, theme, statusStyles }) => {
  return (
    <View style={statusStyles.emptyContainer}>
      <Feather
        name={type === "donations" ? "heart" : "inbox"}
        size={wp("12%")}
        color={theme.textSecondary}
      />
      <Text style={statusStyles.emptyText}>
        No {type} found
      </Text>
      <Text style={statusStyles.emptySubtext}>
        {type === "donations"
          ? "Register as a donor to start making donations"
          : "Register as a recipient to create requests"}
      </Text>
    </View>
  );
};
