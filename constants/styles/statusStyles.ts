import { StyleSheet } from 'react-native';

export const createStatusStyles = (theme: any) => StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  tabContainer: {
    flexDirection: 'row',
    backgroundColor: theme.card,
    margin: 16,
    borderRadius: 12,
    padding: 4,
  },

  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },

  activeTab: {
    backgroundColor: theme.primary,
  },

  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.textSecondary,
  },

  activeTabText: {
    color: '#fff',
  },

  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },

  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
    marginTop: 16,
  },

  emptySubtext: {
    fontSize: 14,
    color: theme.textSecondary,
    marginTop: 8,
  },

  matchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.primary + '15',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: theme.primary + '30',
  },

  matchButtonText: {
    color: theme.primary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.text,
  },

  cardSubtitle: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 8,
  },

  cardDetail: {
    fontSize: 14,
    color: theme.text,
    marginBottom: 4,
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
    marginTop: 10,
    color: theme.textSecondary,
    fontSize: 16,
  },
});