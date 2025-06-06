import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function CreationEventScreen() {
  const navigation = useNavigation();

  const [nom, setNom] = useState('');
  const [domaine, setDomaine] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [places, setPlaces] = useState('');
  const [lieu, setLieu] = useState('');

  const handleCreate = () => {
    // Logique de création d'événement
    console.log({ nom, domaine, date, description, places, lieu });
    // navigation.navigate('...'); // vers la liste ou confirmation
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Retour</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Créer un événement</Text>

      <TextInput
        style={styles.input}
        placeholder="Nom de l’événement"
        value={nom}
        onChangeText={setNom}
      />
      <TextInput
        style={styles.input}
        placeholder="Domaine"
        value={domaine}
        onChangeText={setDomaine}
      />
      <TextInput
        style={styles.input}
        placeholder="Date de l’événement"
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Places disponibles"
        keyboardType="numeric"
        value={places}
        onChangeText={setPlaces}
      />
      <TextInput
        style={styles.input}
        placeholder="Lieu"
        value={lieu}
        onChangeText={setLieu}
      />

      <TouchableOpacity style={styles.button} onPress={handleCreate}>
        <Text style={styles.buttonText}>Créer l’événement</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    color: '#000',
    fontSize: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#2D6A91',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
