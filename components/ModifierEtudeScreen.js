import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig'; // adapte le chemin selon ton projet

export default function ModifierEtudeScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { study } = route.params || {};

  const [titre, setTitre] = useState(study?.titre || '');
  const [domaine, setDomaine] = useState(study?.domaine || '');
  const [deadline, setDeadline] = useState(study?.deadline || '');
  const [description, setDescription] = useState(study?.description || '');
  const [competences, setCompetences] = useState(study?.competences || '');
  const [jeh, setJeh] = useState(String(study?.jeh || ''));

  const handleUpdate = async () => {
    if (!titre || !domaine || !deadline || !description || !competences || !jeh) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    try {
      const etudeRef = doc(db, 'etudes', study.id);

      await updateDoc(etudeRef, {
        titre,
        domaine,
        deadline,
        description,
        competences,
        jeh: Number(jeh),
      });

      Alert.alert('Succès', 'Étude mise à jour !');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Erreur', 'Une erreur s’est produite lors de la mise à jour.');
    }
  };

  const handleDelete = async () => {
    if (!study || !study.id) {
      Alert.alert('Rien à supprimer');
      return;
    }

    try {
      await deleteDoc(doc(db, 'etudes', study.id));
      Alert.alert('Supprimé', 'Étude supprimée.');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la suppression.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Retour</Text>
      </TouchableOpacity>

      <View style={styles.formWrapper}>
        <Text style={styles.title}>Modifier une étude</Text>

        <TextInput placeholder="Nom de l'étude" value={titre} onChangeText={setTitre} style={styles.input} />
        <TextInput placeholder="Domaine" value={domaine} onChangeText={setDomaine} style={styles.input} />
        <TextInput placeholder="Date limite (YYYY-MM-DD)" value={deadline} onChangeText={setDeadline} style={styles.input} />
        <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} />
        <TextInput placeholder="Compétences requises" value={competences} onChangeText={setCompetences} style={styles.input} />
        <TextInput placeholder="Nombre de JEH" value={jeh} onChangeText={setJeh} keyboardType="numeric" style={styles.input} />

        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Enregistrer les modifications</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
          <Text style={styles.buttonText}>Supprimer cette étude</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: '5%',
  },
  backButton: {
    position: 'absolute',
    top: height * 0.06,
    left: '5%',
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#376787',
    fontWeight: 'bold',
  },
  formWrapper: {
    marginTop: height * 0.12,
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
    marginBottom: 12,
    padding: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#376787',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  deleteButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
