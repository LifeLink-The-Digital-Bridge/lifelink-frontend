import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

export const createDonorStyles = (theme: any) => StyleSheet.create({
  eligibilityText: {
    fontSize: wp("3.5%"),
    fontWeight: '600',
    marginBottom: hp("1.5%"),
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("1%"),
    borderRadius: wp("2%"),
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

  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.error + '15',
    padding: wp("3%"),
    borderRadius: wp("2%"),
    borderWidth: 1,
    borderColor: theme.error + '40',
    marginTop: hp("1%"),
    marginBottom: hp("1.5%"),
  },

  warningIcon: {
    fontSize: wp("5%"),
    marginRight: wp("2%"),
  },

  warningText: {
    flex: 1,
    fontSize: wp("3.5%"),
    color: theme.error,
    fontWeight: '600',
  },

  helperText: {
    fontSize: wp("3%"),
    color: theme.textSecondary,
    marginTop: hp("0.5%"),
  },
});
