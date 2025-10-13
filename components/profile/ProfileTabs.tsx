import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { createProfileStyles } from '../../constants/styles/profileStyles';

interface ProfileTabsProps {
  tabs: readonly string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  theme: any;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  theme,
}) => {
  const styles = createProfileStyles(theme);

  return (
    <View style={styles.tabsContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, activeTab === tab && styles.activeTab]}
          onPress={() => onTabChange(tab)}
        >
          <Text
            style={[styles.tabText, activeTab === tab && styles.activeTabText]}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
