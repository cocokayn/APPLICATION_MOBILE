import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Dimensions,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function AjouterEtudeScreen() {
  const navigation = useNavigation();
  const [titre, setTitre] = useState('');
  const [domaine, setDomaine] = useState('');
  const [dateLimite, setDateLimite] = useState('');
  const [description, setDescription] = useState('');
  const [competences, setCompetences] = useState('');
  const [jeh, setJeh] = useState('');

  const handleCreate = () => {
    if (!titre || !domaine || !dateLimite || !description || !competences || !jeh) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    // TODO: envoyer vers la BDD
    Alert.alert('Succès', "L'étude a été créée avec succès.");
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Bouton retour */}
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Retour</Text>
        </Pressable>

        <Text style={styles.title}>Création d'une étude</Text>

        <TextInput placeholder="Nom de l'étude" value={titre} onChangeText={setTitre} style={styles.input} />
        <TextInput placeholder="Domaine" value={domaine} onChangeText={setDomaine} style={styles.input} />
        <TextInput placeholder="Date limite (JJ-MM-AAAA)" value={dateLimite} onChangeText={setDateLimite} style={styles.input} />
        <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} />
        <TextInput placeholder="Compétences requises" value={competences} onChangeText={setCompetences} style={styles.input} />
        <TextInput placeholder="Nombre de JEH" value={jeh} onChangeText={setJeh} keyboardType="numeric" style={styles.input} />

        <Pressable style={styles.button} onPress={handleCreate}>
          <Text style={styles.buttonText}>Créer une étude</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    paddingHorizontal: '5%',
    paddingTop: height * 0.03,
    paddingBottom: height * 0.02,
  },
  backButton: {
    position: 'absolute',
    top: height * 0.015,
    left: '5%',
    zIndex: 10,
    padding: 8,
  },
  backButtonText: {
    fontSize: width * 0.045,
    color: '#376787',
    fontWeight: 'bold',
  },
  title: {
    fontSize: width * 0.055,
    fontWeight: 'bold',
    marginBottom: height * 0.025,
    textAlign: 'center',
    marginTop: height * 0.05, // pour ne pas être caché derrière le bouton
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: height * 0.015,
    paddingHorizontal: '4%',
    marginBottom: height * 0.015,
    borderRadius: 8,
    width: '100%',
  },
  button: {
    backgroundColor: '#376787',
    paddingVertical: height * 0.02,
    paddingHorizontal: '5%',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: height * 0.02,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.045,
  },
});
