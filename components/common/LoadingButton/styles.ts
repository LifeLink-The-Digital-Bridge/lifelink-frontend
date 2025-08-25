import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    minHeight: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  primary: {
    backgroundColor: '#0984e3',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#00b894',
  },
  disabled: {
    backgroundColor: '#b2bec3',
    opacity: 0.6,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  primaryText: {
    color: '#ffffff',
  },
  secondaryText: {
    color: '#00b894',
  },
});
