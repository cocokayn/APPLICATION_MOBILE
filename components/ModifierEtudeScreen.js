import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function ModifierEtudeScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { study } = route.params;

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
      // Exemple de requête à adapter selon ton backend
      const response = await fetch(`https://<TON_URL_CLOUD_FUNCTION>/updateEtude?id=${study.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titre,
          domaine,
          deadline,
          description,
          competences,
          jeh: Number(jeh)
        })
      });

      if (response.ok) {
        Alert.alert('Succès', 'Étude mise à jour !');
        navigation.goBack();
      } else {
        Alert.alert('Erreur', 'Échec de la mise à jour.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Erreur', 'Une erreur sest produite.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
  <Text style={styles.backButtonText}>← Retour</Text>
</TouchableOpacity>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
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
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backButton: {
  position: 'absolute',
  top: 10,
  left: 10,
  padding: 10,
  zIndex: 10,
},

backButtonText: {
  fontSize: 16,
  color: '#376787',
  fontWeight: 'bold',
},
});