import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface SegmentedControlProps {
  segments: readonly string[];
  activeSegment: string;
  onSegmentChange: (segment: string) => void;
  theme: any;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  segments,
  activeSegment,
  onSegmentChange,
  theme
}) => {
  return (
    <View style={{ flexDirection: "row", marginBottom: 20, marginHorizontal: 24 }}>
      {segments.map((segment) => (
        <TouchableOpacity
          key={segment}
          style={{
            flex: 1,
            paddingVertical: 12,
            paddingHorizontal: 16,
            backgroundColor: activeSegment === segment ? theme.primary : theme.card,
            borderRadius: 8,
            marginHorizontal: 4,
            alignItems: "center",
          }}
          onPress={() => onSegmentChange(segment)}
        >
          <Text
            style={{
              color: activeSegment === segment ? "#fff" : theme.text,
              fontWeight: "600",
              textTransform: "capitalize",
            }}
          >
            {segment}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};