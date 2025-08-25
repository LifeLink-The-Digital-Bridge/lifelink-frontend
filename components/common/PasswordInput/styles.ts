import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginVertical: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dfe4ea',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 16,
    paddingRight: 50,
    fontSize: 16,
    color: '#2d3436',
  },
  eyeButton: {
    position: 'absolute',
    right: 15,
    top: '50%',
    marginTop: -11,
    height: 22,
    width: 22,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});
