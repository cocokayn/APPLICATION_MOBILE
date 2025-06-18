import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function ModifierEventScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { event } = route.params || {};

  const [nom, setNom] = useState(event?.nom || '');
  const [domaine, setDomaine] = useState(event?.domaine || '');
  const [date, setDate] = useState(event?.date?.toDate?.() || new Date());
  const [description, setDescription] = useState(event?.description || '');
  const [places, setPlaces] = useState(String(event?.places || ''));
  const [lieu, setLieu] = useState(event?.lieu || '');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChangeDate = (event_, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) setDate(selectedDate);
  };

  const handleUpdate = async () => {
    if (!nom || !domaine || !description || !places || !lieu || !date) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    const placesInt = parseInt(places, 10);
    if (isNaN(placesInt) || placesInt < 1) {
      Alert.alert('Erreur', 'Le nombre de places doit être un entier ≥ 1.');
      return;
    }

    try {
      const eventRef = doc(db, 'evenements', event.id);

      await updateDoc(eventRef, {
        nom,
        domaine,
        description,
        date,
        places: placesInt,
        lieu,
      });

      Alert.alert('Succès', 'Événement mis à jour.');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la mise à jour.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modifier l’événement</Text>

      <TextInput
        style={styles.input}
        placeholder="Nom"
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
        style={[styles.input, { height: 80 }]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TextInput
        style={styles.input}
        placeholder="Nombre de places"
        value={places}
        onChangeText={setPlaces}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Lieu"
        value={lieu}
        onChangeText={setLieu}
      />

      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
        <Text style={styles.dateButtonText}>
          {date.toLocaleDateString()}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

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
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  dateButton: {
    backgroundColor: '#376787',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  dateButtonText: { color: '#fff', fontWeight: 'bold' },
  button: {
    backgroundColor: '#008000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
