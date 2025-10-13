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
});
