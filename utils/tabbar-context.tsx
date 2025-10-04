import React, { createContext, useContext, useState, useRef } from 'react';
import { Animated } from 'react-native';

interface TabBarContextType {
  tabBarVisible: boolean;
  setTabBarVisible: (visible: boolean) => void;
  tabBarTranslateY: Animated.Value;
  hideTabBar: () => void;
  showTabBar: () => void;
}

const TabBarContext = createContext<TabBarContextType | undefined>(undefined);

export const TabBarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tabBarVisible, setTabBarVisible] = useState(true);
  const tabBarTranslateY = useRef(new Animated.Value(0)).current;

  const hideTabBar = () => {
    Animated.timing(tabBarTranslateY, {
      toValue: 100,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setTabBarVisible(false);
  };

  const showTabBar = () => {
    Animated.timing(tabBarTranslateY, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setTabBarVisible(true);
  };

  return (
    <TabBarContext.Provider value={{ tabBarVisible, setTabBarVisible, tabBarTranslateY, hideTabBar, showTabBar }}>
      {children}
    </TabBarContext.Provider>
  );
};

export const useTabBar = () => {
  const context = useContext(TabBarContext);
  if (!context) {
    throw new Error('useTabBar must be used within TabBarProvider');
  }
  return context;
};
