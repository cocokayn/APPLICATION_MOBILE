import React, { useState } from 'react'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../utils/firebaseConfig'; // adapte le chemin selon ton projet
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // bouton retour

export default function CreerCompte({ navigation }) {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [github, setGithub] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [idEtude, setIdEtude] = useState('');
  const [idPostulation, setIdPostulation] = useState('');
  const [idEvenement, setIdEvenement] = useState('');
  const [idInscription, setIdInscription] = useState('');



const handleCreateAccount = async () => {
  if (!nom || !prenom || !email || !password || !confirmPassword) {
    Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
    return;
  }

  const emailPattern = /^[a-zA-Z0-9._%+-]+@(epf\.fr|epfedu\.fr|epfprojets\.com)$/i;
  if (!emailPattern.test(email)) {
    Alert.alert(
      'Email invalide',
      "L'email doit se terminer par @epf.fr, @epfedu.fr ou @epfprojets.com."
    );
    return;
  }

  if (password !== confirmPassword) {
    Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
    return;
  }

  try {
    // ✅ Création du compte Firebase
    await createUserWithEmailAndPassword(auth, email, password);

    // ✅ Enregistrement dans ta BDD MySQL via Cloud Function
    await fetch('https://<TON_URL_CLOUD_FUNCTION>/createUtilisateur', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nom,
        prenom,
        email,
        mdp: password, // tu peux le hasher dans le backend
        role: 'intervenant',
        github: '',
        portfolio: '',
      }),
    });

    Alert.alert('Succès', 'Compte créé avec succès !');
    navigation.replace('Login');
  } catch (err) {
    console.error(err);
    Alert.alert('Erreur', err.message || 'Une erreur est survenue.');
  }
};


  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={28} color="#007bff" />
      </TouchableOpacity>

      <Image source={require('../assets/Logo_blog.png')} style={styles.logo} />
      <Text style={styles.title}>Créer un compte</Text>

      <TextInput
        placeholder="Nom"
        value={nom}
        onChangeText={setNom}
        style={styles.input}
      />
      <TextInput
        placeholder="Prénom"
        value={prenom}
        onChangeText={setPrenom}
        style={styles.input}
      />
      <TextInput
        placeholder="Email EPF"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        placeholder="Confirmer le mot de passe"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
        <Text style={styles.buttonText}>Créer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
  backButton: {
    marginTop: 40,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  logo: {
    height: 100,
    width: 400,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    padding: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});