import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

export const createStatusStyles = (theme: any) => StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp("5%"),
  },

  tabContainer: {
    flexDirection: 'row',
    backgroundColor: theme.card,
    margin: wp("4%"),
    borderRadius: wp("3%"),
    padding: wp("1%"),
  },

  tab: {
    flex: 1,
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("4%"),
    borderRadius: wp("2%"),
    alignItems: 'center',
  },

  activeTab: {
    backgroundColor: theme.primary,
  },

  tabText: {
    fontSize: wp("3.5%"),
    fontWeight: '600',
    color: theme.textSecondary,
  },

  activeTabText: {
    color: '#fff',
  },

  scrollContainer: {
    flex: 1,
    paddingHorizontal: wp("4%"),
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp("7.5%"),
  },

  emptyText: {
    fontSize: wp("4.5%"),
    fontWeight: '600',
    color: theme.text,
    marginTop: hp("2%"),
  },

  emptySubtext: {
    fontSize: wp("3.5%"),
    color: theme.textSecondary,
    marginTop: hp("1%"),
  },

  matchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.primary + '15',
    paddingVertical: hp("1%"),
    paddingHorizontal: wp("3%"),
    borderRadius: wp("2%"),
    marginTop: hp("1.5%"),
    borderWidth: 1,
    borderColor: theme.primary + '30',
  },

  matchButtonText: {
    color: theme.primary,
    fontSize: wp("3.5%"),
    fontWeight: '600',
    marginLeft: wp("2%"),
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp("1.5%"),
  },

  cardTitle: {
    fontSize: wp("4.5%"),
    fontWeight: '700',
    color: theme.text,
  },

  cardSubtitle: {
    fontSize: wp("3.5%"),
    color: theme.textSecondary,
    marginBottom: hp("1%"),
  },

  cardDetail: {
    fontSize: wp("3.5%"),
    color: theme.text,
    marginBottom: hp("0.5%"),
  },

  statusPending: {
    backgroundColor: theme.warning + '20',
    borderColor: theme.warning + '40',
  },

  statusCompleted: {
    backgroundColor: theme.success + '20',
    borderColor: theme.success + '40',
  },

  statusRejected: {
    backgroundColor: theme.error + '20',
    borderColor: theme.error + '40',
  },

  loadingText: {
    marginTop: hp("1.25%"),
    color: theme.textSecondary,
    fontSize: wp("4%"),
  },
});
