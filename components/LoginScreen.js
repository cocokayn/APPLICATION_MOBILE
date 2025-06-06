import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Exemple d'utilisateur simulé
  const fakeUser = {
    email: 'etudiant@epf.fr',
    password: 'epf1234',
  };

  const handleLogin = () => {
    if (email === fakeUser.email && password === fakeUser.password) {
      navigation.replace('Main'); // Redirection si OK
    } else {
      Alert.alert('Erreur', 'Email ou mot de passe incorrect');
    }
  };

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('../assets/Logo_blog.png')} />

      <Text style={styles.appTitle}>JE’Connect</Text>

      <TextInput
        placeholder="Mail EPF ou EPF Projets"
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        placeholder="Mot de passe"
        secureTextEntry
        style={styles.input}
        onChangeText={setPassword}
        value={password}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Connexion</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('CreerCompte')}>
        <Text style={styles.linkText}>
          Vous n’avez pas de compte ? <Text style={styles.link}>Créer un compte</Text>
        </Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        Pour EPF Projets, © Tous droits de reproduction réservés
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    height: 60,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 30,
    color: '#204d74',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#2c6e91',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  linkText: {
    textAlign: 'center',
    color: '#333',
    fontSize: 14,
  },
  link: {
    color: '#2c6e91',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    textAlign: 'center',
    width: '100%',
    fontSize: 12,
    color: '#666',
  },
});
