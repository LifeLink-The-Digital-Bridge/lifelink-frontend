import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  Text,
  Image,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { createSearchBarStyles } from '../../constants/styles/searchBarStyles';
import { searchUsers, UserProfile } from '../../app/api/userApi';

interface SearchBarProps {
  theme: any;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ theme, placeholder = "Search users..." }) => {
  const styles = createSearchBarStyles(theme);
  const router = useRouter();
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [searching, setSearching] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | 1>(1);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }

      searchTimeout.current = setTimeout(async () => {
        setSearching(true);
        try {
          const results = await searchUsers(searchQuery.trim());
          setSearchResults(results);
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        } finally {
          setSearching(false);
        }
      }, 500);
    } else {
      setSearchResults([]);
    }

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchQuery]);

  const handleUserSelect = (username: string) => {
    setSearchVisible(false);
    setSearchQuery('');
    setSearchResults([]);
    Keyboard.dismiss();
    router.push(`/(tabs)/profile?username=${username}`);
  };

  const handleClose = () => {
    setSearchVisible(false);
    setSearchQuery('');
    setSearchResults([]);
    Keyboard.dismiss();
  };

  const renderUserItem = ({ item }: { item: UserProfile }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleUserSelect(item.username)}
    >
      {item.profileImageUrl ? (
        <Image source={{ uri: item.profileImageUrl }} style={styles.resultAvatar} />
      ) : (
        <View style={styles.resultAvatarPlaceholder}>
          <Feather name="user" size={20} color={theme.textSecondary} />
        </View>
      )}
      <View style={styles.resultInfo}>
        <Text style={styles.resultUsername}>{item.username}</Text>
        <Text style={styles.resultEmail}>{item.email}</Text>
      </View>
      <Feather name="chevron-right" size={20} color={theme.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity 
        style={styles.searchContainer} 
        activeOpacity={0.7}
        onPress={() => setSearchVisible(true)}
      >
        <MaterialIcons name="search" size={22} color={theme.textSecondary} />
        <Text style={styles.searchPlaceholder}>{placeholder}</Text>
      </TouchableOpacity>

      <Modal
        visible={searchVisible}
        animationType="slide"
        onRequestClose={handleClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.searchHeader}>
            <TouchableOpacity onPress={handleClose} style={styles.backButton}>
              <Feather name="arrow-left" size={24} color={theme.text} />
            </TouchableOpacity>
            <View style={styles.searchInputContainer}>
              <MaterialIcons name="search" size={22} color={theme.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder={placeholder}
                placeholderTextColor={theme.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
                returnKeyType="search"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Feather name="x-circle" size={18} color={theme.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {searching ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color={theme.primary} />
              <Text style={styles.emptyText}>Searching...</Text>
            </View>
          ) : searchQuery.trim().length === 0 ? (
            <View style={styles.centerContainer}>
              <Feather name="search" size={64} color={theme.textSecondary} />
              <Text style={styles.emptyTitle}>Search Users</Text>
              <Text style={styles.emptyDescription}>
                Search for users by username or email
              </Text>
            </View>
          ) : searchResults.length === 0 ? (
            <View style={styles.centerContainer}>
              <Feather name="users" size={64} color={theme.textSecondary} />
              <Text style={styles.emptyTitle}>No Users Found</Text>
              <Text style={styles.emptyDescription}>
                Try searching with a different username or email
              </Text>
            </View>
          ) : (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id}
              renderItem={renderUserItem}
              contentContainerStyle={styles.resultsList}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </Modal>
    </>
  );
};
