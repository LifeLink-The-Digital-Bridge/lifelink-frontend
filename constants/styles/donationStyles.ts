import { StyleSheet } from 'react-native';

export const createDonationStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 100,
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
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  formSection: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.text,
    marginLeft: 12,
  },

  inputContainer: {
    marginBottom: 16,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 8,
  },

  input: {
    backgroundColor: theme.inputBackground,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: theme.text,
  },

  textArea: {
    backgroundColor: theme.inputBackground,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: theme.text,
    minHeight: 80,
    textAlignVertical: 'top',
  },

  pickerContainer: {
    backgroundColor: theme.inputBackground,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    overflow: 'hidden',
  },

  picker: {
    color: theme.text,
    backgroundColor: theme.inputBackground,
  },

  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  toggleButton: {
    backgroundColor: theme.border,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
  },

  toggleButtonActive: {
    backgroundColor: theme.primary,
  },

  toggleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.textSecondary,
  },

  toggleButtonTextActive: {
    color: '#fff',
  },

  submitButton: {
    backgroundColor: theme.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  submitButtonDisabled: {
    backgroundColor: theme.textSecondary,
    shadowOpacity: 0.1,
    elevation: 2,
  },

  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
