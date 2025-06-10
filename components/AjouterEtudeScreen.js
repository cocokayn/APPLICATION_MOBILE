import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

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
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Retour</Text>
        </TouchableOpacity>

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
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    color: '#376787',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 15,
    borderRadius: 10,
    width: '100%',
  },
  button: {
    backgroundColor: '#376787',
    paddingVertical: 14,
    paddingHorizontal: '5%',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
