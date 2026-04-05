import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../utils/responsive';

export const createDonationStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },

  scrollContent: {
    padding: wp("4%"),
    paddingBottom: hp("12.5%"),
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.card,
    padding: wp("5%"),
    borderRadius: wp("5%"),
    marginBottom: hp("3%"),
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: theme.border + '40',
  },

  backButton: {
    width: wp("9%"),
    height: wp("9%"),
    borderRadius: wp("4.5%"),
    backgroundColor: theme.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp("4%"),
  },

  headerIconContainer: {
    width: wp("14%"),
    height: wp("14%"),
    borderRadius: wp("7%"),
    backgroundColor: theme.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp("4%"),
  },

  headerTextContainer: {
    flex: 1,
  },

  headerTitle: {
    fontSize: wp("5%"),
    fontWeight: '700',
    color: theme.text,
    letterSpacing: 0.3,
  },

  headerSubtitle: {
    fontSize: wp("3.5%"),
    color: theme.textSecondary,
    marginTop: hp("0.25%"),
    fontWeight: '500',
  },

  statusBadge: {
    backgroundColor: theme.success + '15',
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("0.75%"),
    borderRadius: wp("3%"),
    borderWidth: 1,
    borderColor: theme.success + '30',
  },

  statusText: {
    color: theme.success,
    fontSize: wp("3%"),
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  sectionContainer: {
    backgroundColor: theme.card,
    borderRadius: wp("4%"),
    padding: wp("5%"),
    marginBottom: hp("2%"),
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  formSection: {
    backgroundColor: theme.card,
    borderRadius: wp("4%"),
    padding: wp("5%"),
    marginBottom: hp("2%"),
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp("2.5%"),
  },

  sectionTitle: {
    fontSize: wp("4.5%"),
    fontWeight: '700',
    color: theme.text,
    marginLeft: wp("3%"),
  },

  inputContainer: {
    marginBottom: hp("2%"),
  },

  label: {
    fontSize: wp("4%"),
    fontWeight: '600',
    color: theme.text,
    marginBottom: hp("1%"),
  },

  input: {
    backgroundColor: theme.inputBackground,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: wp("2%"),
    padding: wp("3%"),
    fontSize: wp("4%"),
    color: theme.text,
  },

  textArea: {
    backgroundColor: theme.inputBackground,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: wp("2%"),
    padding: wp("3%"),
    fontSize: wp("4%"),
    color: theme.text,
    minHeight: hp("10%"),
    textAlignVertical: 'top',
  },

  pickerContainer: {
    backgroundColor: theme.inputBackground,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: wp("2%"),
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
    marginBottom: hp("2%"),
  },

  toggleButton: {
    backgroundColor: theme.border,
    paddingVertical: hp("1%"),
    paddingHorizontal: wp("4%"),
    borderRadius: wp("5%"),
    minWidth: wp("15%"),
    alignItems: 'center',
  },

  toggleButtonActive: {
    backgroundColor: theme.primary,
  },

  toggleButtonText: {
    fontSize: wp("3.5%"),
    fontWeight: '600',
    color: theme.textSecondary,
  },

  toggleButtonTextActive: {
    color: '#fff',
  },

  submitButton: {
    backgroundColor: theme.primary,
    paddingVertical: hp("2%"),
    borderRadius: wp("3%"),
    alignItems: 'center',
    marginTop: hp("2.5%"),
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
    fontSize: wp("4.5%"),
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
