import { StyleSheet } from "react-native";

export default StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#f6f8fa",
    padding: 16,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  avatarContainer: {
    marginRight: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileInfo: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 2,
  },
  username: {
    fontSize: 16,
    color: "#636e72",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#636e72",
    marginBottom: 4,
  },
  dob: {
    fontSize: 14,
    color: "#636e72",
    marginBottom: 16,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },
  statIcon: {
    marginRight: 6,
  },
  statLabel: {
    fontSize: 14,
    color: "#222",
    fontWeight: "bold",
  },
  statValue: {
    fontSize: 14,
    color: "#636e72",
    marginLeft: 6,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 24,
  },
  gridItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
    marginBottom: 12,
    minWidth: 100,
  },
  actionsContainer: {
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f6f8fa",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f6f8fa",
  },
  errorText: {
    color: "red",
    fontSize: 18,
  },
  segmentedControl: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
    backgroundColor: "#f1f2f6",
    borderRadius: 8,
    padding: 4,
  },
  segment: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    borderRadius: 6,
  },
  segmentActive: {
    backgroundColor: "#0984e3",
  },
  segmentText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#636e72",
  },
  segmentTextActive: {
    color: "#fff",
  },
  contentGrid: {
    marginTop: 16,
  },
  contentItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  contentItemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 4,
  },
  contentItemText: {
    fontSize: 14,
    color: "#636e72",
    marginBottom: 3,
  },
  seeAllButton: {
    marginTop: 10,
    alignItems: "center",
    padding: 10,
    backgroundColor: "#dfe6e9",
    borderRadius: 8,
  },
  seeAllButtonText: {
    color: "#0984e3",
    fontWeight: "bold",
    fontSize: 16,
  },
});
