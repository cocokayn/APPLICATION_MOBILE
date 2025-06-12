import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../utils/firebaseConfig'; 
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export default function AjouterEtudeScreen() {
  const navigation = useNavigation();

  const [titre, setTitre] = useState('');
  const [domaine, setDomaine] = useState('');
  const [dateLimite, setDateLimite] = useState('');
  const [description, setDescription] = useState('');
  const [competences, setCompetences] = useState('');
  const [jeh, setJeh] = useState('');

  const handleCreate = async () => {
    if (!titre || !domaine || !dateLimite || !description || !competences || !jeh) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    // Validation simple de date
    const dateObj = new Date(dateLimite);
    if (isNaN(dateObj.getTime())) {
      Alert.alert('Erreur', 'La date limite n\'est pas valide (format attendu : YYYY-MM-DD).');
      return;
    }

    try {
      const newEtude = {
        titre,
        domaine,
        deadline: dateLimite,
        description,
        competences,
        jeh: parseInt(jeh, 10),
        statut: 'ouverte',
        date_publication: Timestamp.now(),
        date_debut: Timestamp.fromDate(dateObj),
        date_fin: Timestamp.fromDate(dateObj),
        id_historique: 'hist01', // à gérer dynamiquement si besoin
        id_participation: 'part01',
        id_postulation: 'post01',
      };

      // Ici, on crée la référence à la collection
    const refCollection = collection(db, 'etudes');
    // Puis on ajoute le document
    await addDoc(refCollection, newEtude);

      Alert.alert('Succès', "L'étude a été ajoutée !");
      navigation.goBack();
    } catch (error) {
      console.error('Erreur ajout étude:', error);
      Alert.alert('Erreur', "Impossible d'ajouter l'étude. Veuillez réessayer plus tard.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Création d'une étude</Text>

        <TextInput
          placeholder="Nom de l'étude"
          value={titre}
          onChangeText={setTitre}
          style={styles.input}
        />
        <TextInput
          placeholder="Domaine"
          value={domaine}
          onChangeText={setDomaine}
          style={styles.input}
        />
        <TextInput
          placeholder="Date limite (YYYY-MM-DD)"
          value={dateLimite}
          onChangeText={setDateLimite}
          style={styles.input}
        />
        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          multiline
        />
        <TextInput
          placeholder="Compétences requises"
          value={competences}
          onChangeText={setCompetences}
          style={styles.input}
        />
        <TextInput
          placeholder="Nombre de JEH"
          value={jeh}
          onChangeText={setJeh}
          keyboardType="numeric"
          style={styles.input}
        />

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
