import { StyleSheet } from 'react-native';

export const createDonorStyles = (theme: any) => StyleSheet.create({
  bg: {
    backgroundColor: theme.background,
  },
  
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  
  scrollContent: {
    padding: 16,
    paddingBottom: 120, 
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.card,
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: theme.border + '40',
  },

  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  headerIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  headerTextContainer: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.text,
    letterSpacing: 0.3,
  },

  headerSubtitle: {
    fontSize: 14,
    color: theme.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },

  statusBadge: {
    backgroundColor: theme.success + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.success + '30',
  },

  statusText: {
    color: theme.success,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  
  sectionContainer: {
    backgroundColor: theme.card,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: theme.border + '40',
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  
  sectionTitle: {
    fontSize: 20,
    color: theme.text,
    fontWeight: '700',
    marginLeft: 12,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: theme.primary + '30',
  },

  inputContainer: {
    marginBottom: 16,
  },

  label: {
    fontSize: 16,
    color: theme.text,
    fontWeight: '600',
    marginBottom: 8,
  },
  
  input: {
    backgroundColor: theme.inputBackground,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 2,
    borderColor: theme.border,
    color: theme.text,
  },
  
  inputDisabled: {
    backgroundColor: theme.textSecondary + '20',
    color: theme.textSecondary,
  },

  textArea: {
    backgroundColor: theme.inputBackground,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 2,
    borderColor: theme.border,
    color: theme.text,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginBottom: 16,
  },

  switchLabel: {
    fontSize: 16,
    color: theme.text,
    fontWeight: '500',
    flex: 1,
    marginRight: 16,
  },
  
  eligibilityText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    textAlign: 'center',
  },
  
  eligibleText: {
    color: theme.success,
    backgroundColor: theme.success + '20',
  },
  
  ineligibleText: {
    color: theme.error,
    backgroundColor: theme.error + '20',
  },
  
  button: {
    marginTop: 24,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  
  buttonEnabled: {
    backgroundColor: theme.primary,
  },
  
  buttonDisabled: {
    backgroundColor: theme.textSecondary,
  },
  
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  
  submitButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.background,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: theme.border + '50',
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  
  submitButton: {
    backgroundColor: theme.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    minHeight: 46,
  },
  
  submitButtonEnabled: {
    backgroundColor: theme.primary,
  },
  
  submitButtonDisabled: {
    backgroundColor: theme.textSecondary,
  },
  
  submitButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 0.8,
  },
  
  locationButton: {
    backgroundColor: theme.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  
  locationButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  
  locationText: {
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },

  agreementCard: {
    backgroundColor: theme.background,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: theme.border + '40',
    marginBottom: 20,
  },

  agreementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  agreementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  agreementTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 4,
  },

  agreementSubtitle: {
    fontSize: 14,
    color: theme.textSecondary,
  },

  termsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.primary + '15',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },

  termsButtonText: {
    marginLeft: 12,
    color: theme.primary,
    fontWeight: '600',
    fontSize: 15,
    flex: 1,
  },

  termsSubText: {
    color: theme.textSecondary,
    fontSize: 13,
    fontStyle: 'italic',
  },

  consentToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },

  consentText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    flex: 1,
    marginRight: 12,
  },

  successMessage: {
    backgroundColor: theme.success + '15',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.success + '30',
    flexDirection: 'row',
    alignItems: 'center',
  },

  successTitle: {
    color: theme.success,
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 4,
  },

  successSubtitle: {
    color: theme.success,
    fontSize: 14,
    opacity: 0.8,
  },
    loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background,
  },
    loadingText: {
    fontSize: 16,
    color: theme.textSecondary,
    marginTop: 16,
  },
});
