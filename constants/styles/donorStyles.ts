import { StyleSheet } from 'react-native';

export const createDonorStyles = (theme: any) => StyleSheet.create({
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
});