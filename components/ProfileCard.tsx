import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome, MaterialIcons, Feather } from "@expo/vector-icons";

type ProfileCardProps = {
  username: string;
  email: string;
  bloodGroup?: string;
  lastDonation?: string;
  location?: string;
  donations?: number;
  followers?: number;
  following?: number;
  score?: number;
  reviews?: number;
  onEdit?: () => void;
};

const ProfileCard: React.FC<ProfileCardProps> = ({
  username,
  email,
  bloodGroup,
  lastDonation,
  location,
  donations,
  followers,
  following,
  score,
  reviews,
  onEdit,
}) => (
  <View style={styles.card}>
    <View style={styles.headerRow}>
      <FontAwesome name="user-circle" size={48} color="#0984e3" />
      <View style={{ marginLeft: 12 }}>
        <Text style={styles.name}>{username}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>
    </View>
    <View style={styles.statsRow}>
      <View style={styles.statItem}>
        <Feather name="droplet" size={20} color="#e17055" />
        <Text style={styles.statText}>{bloodGroup || "N/A"}</Text>
      </View>
      <View style={styles.statItem}>
        <Feather name="gift" size={20} color="#636e72" />
        <Text style={styles.statText}>{donations ?? 0} Donations</Text>
      </View>
      <View style={styles.statItem}>
        <Feather name="users" size={20} color="#636e72" />
        <Text style={styles.statText}>{followers ?? 0} Followers</Text>
      </View>
      <View style={styles.statItem}>
        <Feather name="user-plus" size={20} color="#636e72" />
        <Text style={styles.statText}>{following ?? 0} Following</Text>
      </View>
    </View>
    <View style={styles.infoRow}>
      <MaterialIcons name="date-range" size={20} color="#636e72" />
      <Text style={styles.infoText}>Last Donation: {lastDonation || "N/A"}</Text>
    </View>
    {location && (
      <View style={styles.infoRow}>
        <MaterialIcons name="location-on" size={20} color="#636e72" />
        <Text style={styles.infoText}>{location}</Text>
      </View>
    )}
    <View style={styles.statsRow}>
      <View style={styles.statItem}>
        <Feather name="star" size={20} color="#f1c40f" />
        <Text style={styles.statText}>{score ?? 0} Points</Text>
      </View>
      <View style={styles.statItem}>
        <Feather name="message-square" size={20} color="#636e72" />
        <Text style={styles.statText}>{reviews ?? 0} Reviews</Text>
      </View>
    </View>
    {onEdit && (
      <TouchableOpacity style={styles.editButton} onPress={onEdit}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 24,
    marginBottom: 24,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    alignSelf: "center",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0984e3",
  },
  email: {
    fontSize: 15,
    color: "#636e72",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 18,
  },
  statText: {
    fontSize: 15,
    color: "#636e72",
    marginLeft: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 10,
  },
  infoText: {
    fontSize: 16,
    color: "#636e72",
    marginLeft: 6,
  },
  editButton: {
    marginTop: 18,
    backgroundColor: "#00b894",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});

export default ProfileCard;
