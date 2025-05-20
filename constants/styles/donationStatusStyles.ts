import { StyleSheet } from "react-native";

const donationStatusStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f6fafd", 
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#0984e3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderLeftWidth: 6,
    borderLeftColor: "#0984e3", 
  },
  type: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 6,
    color: "#0984e3", 
    letterSpacing: 1,
  },
  label: {
    fontWeight: "600",
    color: "#636e72",
    marginTop: 2,
  },
  value: {
    color: "#222",
    fontSize: 15,
    marginBottom: 2,
  },
  status: {
    fontWeight: "bold",
    fontSize: 15,
    marginTop: 4,
  },
  statusPending: {
    color: "#e17055", 
  },
  statusCompleted: {
    color: "#00b894", 
  },
  statusRejected: {
    color: "#d63031", 
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default donationStatusStyles;
