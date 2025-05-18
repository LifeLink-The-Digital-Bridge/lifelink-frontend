import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f6f8fa',
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0984e3',
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#636e72',
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#dfe6e9',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
    maxWidth: 400,
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    color: '#636e72',
  },
  button: {
    marginTop: 24,
    width: '100%',
    maxWidth: 400,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#00b894',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
  },
});
