import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { createProfileStyles } from '../../constants/styles/profileStyles';
import { useLanguage } from '../../utils/language-context';

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
  const { t } = useLanguage();

  const getTabLabel = (tab: string) => {
    if (tab === "donations") return t("profile.tabs.donations");
    if (tab === "reviews") return t("profile.tabs.reviews");
    if (tab === "receives") return t("profile.tabs.receives");
    return tab.charAt(0).toUpperCase() + tab.slice(1);
  };

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
            {getTabLabel(tab)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
