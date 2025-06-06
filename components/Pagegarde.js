import { Text, View, StyleSheet, Image } from 'react-native';

export default function Pagegarde() {
  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>
        Bienvenue
      </Text>
      <Image style={styles.logo} source={require('../assets/Logo_blog.png')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  paragraph: {
    margin: 10,
    marginTop: 0,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logo: {
    height: 100,
    width: 400,
    resizeMode: 'contain', // ou 'cover'
  }
});
