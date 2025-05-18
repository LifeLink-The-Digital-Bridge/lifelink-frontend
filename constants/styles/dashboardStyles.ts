import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#f4fafd', 
  },
  scrollContent: {
    alignItems: 'center',
    padding: 18,
    paddingBottom: 36,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#0984e3', 
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 13,
    fontSize: 16,
    borderWidth: 1.5,
    borderColor: '#cfd8dc', 
    color: '#222',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 13,
    width: '100%',
    maxWidth: 420,
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    color: '#374151', 
    fontWeight: '500',
  },
  button: {
    marginTop: 28,
    width: '100%',
    maxWidth: 420,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#00b894', 
    shadowColor: '#0984e3',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  errorText: {
    color: '#d63031', 
    fontSize: 15,
    marginBottom: 10,
    alignSelf: 'center',
  },
  eligibleText: {
    color: '#00b894', 
    fontWeight: '600',
    marginBottom: 8,
  },
  notEligibleText: {
    color: '#d63031', 
    fontWeight: '600',
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4fafd',
  },
});

export default styles;
