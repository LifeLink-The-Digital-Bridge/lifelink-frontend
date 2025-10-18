import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../utils/theme-context';
import { lightTheme, darkTheme } from '../../constants/styles/authStyles';
import { getFollowers, getFollowing, UserProfile } from '../api/userApi';
import AppLayout from '@/components/AppLayout';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const FollowListScreen = () => {
  const { colorScheme } = useTheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const router = useRouter();
  const params = useLocalSearchParams();

  const userId = params.userId as string;
  const type = params.type as 'followers' | 'following';
  const username = params.username as string;

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, [userId, type]);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = type === 'followers'
        ? await getFollowers(userId)
        : await getFollowing(userId);
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleUserPress = (username: string) => {
    router.push(`/navigation/profileScreen?username=${username}`);
  };

  const renderUserItem = ({ item }: { item: UserProfile }) => (
    <TouchableOpacity
      style={[styles.userItem, { backgroundColor: theme.card, borderColor: theme.border }]}
      onPress={() => handleUserPress(item.username)}
      activeOpacity={0.7}
    >
      {item.profileImageUrl ? (
        <Image
          source={{ uri: item.profileImageUrl }}
          style={[styles.avatar, { borderColor: theme.primary }]}
        />
      ) : (
        <View style={[styles.avatarPlaceholder, { backgroundColor: theme.primary + '20', borderColor: theme.primary }]}>
          <FontAwesome name="user" size={24} color={theme.primary} />
        </View>
      )}

      <View style={styles.userInfo}>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.username, { color: theme.textSecondary }]} numberOfLines={1}>
          @{item.username}
        </Text>
      </View>

      <Feather name="chevron-right" size={20} color={theme.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <AppLayout>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: theme.background }]}
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={22} color={theme.text} />
          </TouchableOpacity>

          <View style={styles.headerTextContainer}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              {type === 'followers' ? 'Followers' : 'Following'}
            </Text>
            <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
              {username ? `@${username}` : ''}
            </Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
              Loading {type}...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Feather name="alert-circle" size={48} color={theme.error} />
            <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
            <TouchableOpacity
              style={[styles.retryButton, { backgroundColor: theme.primary }]}
              onPress={loadUsers}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : users.length === 0 ? (
          <View style={styles.centerContainer}>
            <Feather
              name={type === 'followers' ? 'users' : 'user-plus'}
              size={48}
              color={theme.textSecondary}
            />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              {type === 'followers' ? 'No followers yet' : 'Not following anyone yet'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={users}
            renderItem={renderUserItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ height: hp('1%') }} />}
          />
        )}
      </View>
    </AppLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: hp('3%'),
    paddingBottom: hp('1.5%'),
    paddingHorizontal: wp('4%'),
    borderBottomWidth: 1,
  },
  backButton: {
    width: wp('9%'),
    height: wp('9%'),
    borderRadius: wp('4.5%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3%'),
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: wp('4.5%'),
    fontWeight: '700',
    marginBottom: hp('0.2%'),
  },
  headerSubtitle: {
    fontSize: wp('3.2%'),
    fontWeight: '500',
  },
  listContainer: {
    padding: wp('4%'),
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp('4%'),
    borderRadius: wp('3%'),
    borderWidth: 1,
  },
  avatar: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('6%'),
    marginRight: wp('3%'),
    borderWidth: 2,
  },
  avatarPlaceholder: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('6%'),
    marginRight: wp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: wp('4%'),
    fontWeight: '600',
    marginBottom: hp('0.25%'),
  },
  username: {
    fontSize: wp('3.5%'),
    fontWeight: '400',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp('10%'),
  },
  loadingText: {
    marginTop: hp('2%'),
    fontSize: wp('4%'),
    fontWeight: '500',
  },
  errorText: {
    marginTop: hp('2%'),
    fontSize: wp('4%'),
    textAlign: 'center',
    fontWeight: '500',
  },
  retryButton: {
    marginTop: hp('2%'),
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('6%'),
    borderRadius: wp('2%'),
  },
  retryButtonText: {
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight: '600',
  },
  emptyText: {
    marginTop: hp('2%'),
    fontSize: wp('4%'),
    fontWeight: '500',
  },
});

export default FollowListScreen;
