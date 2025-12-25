import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../utils/responsive';

export const createDashboardStyles = (theme: any) => StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.background,
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.background,
  },
  
  loadingText: {
    marginTop: hp("1.3%"),
    color: theme.textSecondary,
    fontSize: wp("4%"),
  },

  header: {
    backgroundColor: theme.card,
    paddingHorizontal: wp("4.5%"),
    paddingBottom: hp("1.5%"),
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },

  searchContainer: {
    marginTop: hp("1.5%"),
    alignItems: 'center',
  },
  
  welcomeText: {
    fontSize: wp("5.5%"),
    color: theme.primary,
    marginBottom: hp("0.5%"),
    marginTop: hp("1%"),
  },
  
  subText: {
    fontSize: wp("4%"),
    color: theme.textSecondary,
    marginBottom: hp("2.3%"),
  },
  
  chatBotIcon: {
    position: "absolute",
    bottom: hp("5%"),
    right: wp("5%"),
    zIndex: 999,
  },
  
  chatBotButton: {
    backgroundColor: theme.primary,
    width: wp("14%"),
    height: wp("14%"),
    borderRadius: wp("7%"),
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
