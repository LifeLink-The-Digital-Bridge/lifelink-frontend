// constants/styles/donorStyles.ts
import { StyleSheet } from 'react-native';

export const createDonorStyles = (theme: any) => StyleSheet.create({
  bg: {
    backgroundColor: theme.background,
  },
  
  container: {
    flex: 1,
    backgroundColor: theme.background,
    paddingHorizontal: 20,
  },
  
  scrollContent: {
    paddingBottom: 120, // Extra space for the fixed button
  },
  
  sectionContainer: {
    backgroundColor: theme.card,
    borderRadius: 20, // More rounded for modern look
    padding: 24, // Increased padding
    marginBottom: 24, // Increased margin
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 4 }, // Enhanced shadow
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: theme.border + '40', // More subtle border
  },
  
  sectionTitle: {
    fontSize: 20,
    color: theme.text,
    fontWeight: '700',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: theme.primary + '30',
  },
  
  input: {
    backgroundColor: theme.inputBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 2,
    borderColor: theme.border,
    color: theme.text,
  },
  
  inputDisabled: {
    backgroundColor: theme.textSecondary + '20',
    color: theme.textSecondary,
  },
  
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  
  label: {
    fontSize: 16,
    color: theme.text,
    fontWeight: '500',
    flex: 1,
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
  
  // OLD BUTTON STYLES (keep for other buttons like location)
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
  
  // NEW SUBMIT BUTTON STYLES - FIXED AT BOTTOM
  submitButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.background,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 34, // Safe area for modern phones
    borderTopWidth: 1,
    borderTopColor: theme.border + '50',
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  
  submitButton: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    minHeight: 46,
  },
  
  submitButtonEnabled: {
    backgroundColor: theme.primary,
  },
  
  submitButtonDisabled: {
    backgroundColor: theme.textSecondary + '60',
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
});
