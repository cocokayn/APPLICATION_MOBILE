import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';
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
        <Text style={styles.title}>Création d'une étude</Text>

        <TextInput placeholder="Nom de l'étude" value={titre} onChangeText={setTitre} style={styles.input} />
        <TextInput placeholder="Domaine" value={domaine} onChangeText={setDomaine} style={styles.input} />
        <TextInput placeholder="Date limite (YYYY-MM-DD)" value={dateLimite} onChangeText={setDateLimite} style={styles.input} />
        <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} />
        <TextInput placeholder="Compétences requises" value={competences} onChangeText={setCompetences} style={styles.input} />
        <TextInput placeholder="Nombre de JEH" value={jeh} onChangeText={setJeh} keyboardType="numeric" style={styles.input} />

        <TouchableOpacity style={styles.button} onPress={handleCreate}>
          <Text style={styles.buttonText}>Créer une étude</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 12,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#376787',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});