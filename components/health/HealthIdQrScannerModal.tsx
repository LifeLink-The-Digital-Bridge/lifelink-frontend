import { MaterialIcons } from "@expo/vector-icons";
import { BarcodeScanningResult, CameraView, useCameraPermissions } from "expo-camera";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { darkTheme, lightTheme } from "../../constants/styles/healthStyles";
import { useTheme } from "../../utils/theme-context";

interface HealthIdQrScannerModalProps {
  visible: boolean;
  onClose: () => void;
  onScanned: (payload: string) => void;
}

export function HealthIdQrScannerModal({
  visible,
  onClose,
  onScanned,
}: HealthIdQrScannerModalProps) {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;
  const [permission, requestPermission] = useCameraPermissions();
  const [scanEnabled, setScanEnabled] = useState(true);

  useEffect(() => {
    if (visible) {
      setScanEnabled(true);
    }
  }, [visible]);

  const handleBarcodeScanned = ({ data }: BarcodeScanningResult) => {
    if (!scanEnabled) {
      return;
    }
    setScanEnabled(false);
    onScanned(String(data || ""));
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Scan Health ID QR</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>

        {!permission ? (
          <View style={styles.centeredContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={[styles.helperText, { color: theme.textSecondary }]}>Checking camera access...</Text>
          </View>
        ) : !permission.granted ? (
          <View style={styles.centeredContainer}>
            <MaterialIcons name="no-photography" size={52} color={theme.textSecondary} />
            <Text style={[styles.permissionTitle, { color: theme.text }]}>Camera Permission Required</Text>
            <Text style={[styles.helperText, { color: theme.textSecondary }]}>
              Allow camera access to scan the Health ID QR code.
            </Text>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.primary }]}
              onPress={requestPermission}
            >
              <Text style={styles.actionButtonText}>Allow Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  backgroundColor: "transparent",
                  borderColor: theme.border,
                  borderWidth: 1,
                },
              ]}
              onPress={onClose}
            >
              <Text style={[styles.actionButtonText, { color: theme.text }]}>Use Manual Search</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.cameraContainer}>
            <CameraView
              style={StyleSheet.absoluteFill}
              facing="back"
              onBarcodeScanned={scanEnabled ? handleBarcodeScanned : undefined}
              barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            />

            <View style={styles.overlay}>
              <View style={[styles.scanFrame, { borderColor: theme.primary }]} />
              <Text style={[styles.scanText, { color: "#fff" }]}>
                Place the QR code inside the square to scan
              </Text>
            </View>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  cameraContainer: {
    flex: 1,
    overflow: "hidden",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.38)",
    alignItems: "center",
    justifyContent: "center",
  },
  scanFrame: {
    width: 240,
    height: 240,
    borderRadius: 14,
    borderWidth: 3,
    backgroundColor: "transparent",
  },
  scanText: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    paddingHorizontal: 28,
  },
  centeredContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  helperText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 20,
  },
  actionButton: {
    marginTop: 14,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    minWidth: 170,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});

