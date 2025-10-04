import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');

export const createProfileStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },

    profileSection: {
      backgroundColor: theme.card,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 20,
    },

    profileTopRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 20,
    },

    profileImageWrapper: {
      marginRight: 20,
    },

    profileImage: {
      width: 90,
      height: 90,
      borderRadius: 45,
      borderWidth: 3,
      borderColor: theme.primary,
    },

    profileImagePlaceholder: {
      width: 90,
      height: 90,
      borderRadius: 45,
      borderWidth: 3,
      borderColor: theme.border,
      backgroundColor: theme.background,
      justifyContent: 'center',
      alignItems: 'center',
    },

    profileInfo: {
      flex: 1,
      justifyContent: 'flex-start',
      paddingTop: 4,
      paddingRight: 8,
    },

    username: {
      fontSize: 22,
      fontWeight: '700',
      color: theme.text,
      marginBottom: 4,
    },

    handle: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 12,
    },

    infoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
    },

    infoText: {
      fontSize: 13,
      color: theme.textSecondary,
      marginLeft: 8,
      flex: 1,
    },

    settingsButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.background,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.border,
      marginLeft: 8,
    },

    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },

    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 20,
    },

    metaText: {
      fontSize: 14,
      color: theme.textSecondary,
      marginLeft: 6,
    },

    statsRow: {
      flexDirection: 'row',
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },

    statItem: {
      flex: 1,
      alignItems: 'center',
    },

    statValue: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.text,
      marginBottom: 2,
    },

    statLabel: {
      fontSize: 13,
      color: theme.textSecondary,
    },

    actionsContainer: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: theme.card,
      gap: 12,
    },

    actionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 20,
      borderWidth: 1,
    },

    primaryButton: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },

    secondaryButton: {
      backgroundColor: 'transparent',
      borderColor: theme.border,
    },

    dangerButton: {
      backgroundColor: 'transparent',
      borderColor: theme.error,
    },

    buttonText: {
      fontSize: 15,
      fontWeight: '600',
      marginLeft: 6,
    },

    primaryButtonText: {
      color: '#fff',
    },

    secondaryButtonText: {
      color: theme.text,
    },

    dangerButtonText: {
      color: theme.error,
    },

    tabsContainer: {
      flexDirection: 'row',
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },

    tab: {
      flex: 1,
      paddingVertical: 16,
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },

    activeTab: {
      borderBottomColor: theme.primary,
    },

    tabText: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.textSecondary,
    },

    activeTabText: {
      color: theme.primary,
    },

    contentContainer: {
      padding: 16,
    },

    card: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },

    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },

    cardTitle: {
      fontSize: 17,
      fontWeight: '600',
      color: theme.text,
    },

    badge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
    },

    badgeText: {
      fontSize: 12,
      fontWeight: '600',
    },

    cardDetail: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },

    detailLabel: {
      fontSize: 14,
      color: theme.textSecondary,
      marginLeft: 8,
      flex: 1,
    },

    detailValue: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.text,
    },

    emptyState: {
      padding: 40,
      alignItems: 'center',
    },

    emptyIcon: {
      marginBottom: 16,
    },

    emptyTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 8,
      textAlign: 'center',
    },

    emptyDescription: {
      fontSize: 15,
      color: theme.textSecondary,
      textAlign: 'center',
      marginBottom: 24,
      paddingHorizontal: 20,
    },

    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },

    modalContent: {
      backgroundColor: theme.card,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingTop: 8,
      paddingBottom: 32,
    },

    modalHandle: {
      width: 40,
      height: 4,
      backgroundColor: theme.border,
      borderRadius: 2,
      alignSelf: 'center',
      marginBottom: 20,
    },

    modalTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.text,
      marginBottom: 24,
      paddingHorizontal: 20,
    },

    modalSection: {
      marginBottom: 24,
    },

    modalSectionTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      paddingHorizontal: 20,
      marginBottom: 12,
    },

    themeOption: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },

    logoutOption: {
      borderBottomWidth: 0,
    },

    themeOptionLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    themeOptionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.background,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },

    themeOptionText: {
      fontSize: 16,
      color: theme.text,
      fontWeight: '500',
    },

    imageViewerOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      justifyContent: 'center',
      alignItems: 'center',
    },

    imageViewerCloseButton: {
      position: 'absolute',
      top: 50,
      right: 20,
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    },

    imageViewerContainer: {
      width: width,
      height: height,
      justifyContent: 'center',
      alignItems: 'center',
    },

    fullscreenImage: {
      width: width,
      height: width,
    },
  });
