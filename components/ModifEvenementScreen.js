import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  Dimensions,
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
  const [description, setDescription] = useState(event?.description || '');
  const [places, setPlaces] = useState(String(event?.places || ''));
  const [lieu, setLieu] = useState(event?.lieu || '');

  const [dateTime, setDateTime] = useState(event?.date?.toDate?.() || new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleUpdate = async () => {
    if (!nom || !domaine || !description || !places || !lieu || !dateTime) {
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
        date: dateTime,
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

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const newDate = new Date(dateTime);
      newDate.setFullYear(selectedDate.getFullYear());
      newDate.setMonth(selectedDate.getMonth());
      newDate.setDate(selectedDate.getDate());
      setDateTime(newDate);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(dateTime);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setDateTime(newDate);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Retour</Text>
      </TouchableOpacity>

      <View style={styles.formWrapper}>
        <Text style={styles.title}>Modifier un événement</Text>

        <TextInput placeholder="Nom" value={nom} onChangeText={setNom} style={styles.input} />
        <TextInput placeholder="Domaine" value={domaine} onChangeText={setDomaine} style={styles.input} />
        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          style={[styles.input, { height: 80 }]}
          multiline
        />
        <TextInput
          placeholder="Nombre de places"
          value={places}
          onChangeText={setPlaces}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput placeholder="Lieu" value={lieu} onChangeText={setLieu} style={styles.input} />

        <Text style={styles.label}>Date :</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
          <Text style={{ color: '#000' }}>{dateTime.toLocaleDateString()}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <View style={styles.datePickerWrapper}>
            <DateTimePicker
              value={dateTime}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          </View>
        )}

        <Text style={styles.label}>Heure :</Text>
        <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.input}>
          <Text style={{ color: '#000' }}>
            {dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </TouchableOpacity>

        {showTimePicker && (
          <View style={styles.datePickerWrapper}>
            <DateTimePicker
              value={dateTime}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Enregistrer les modifications</Text>
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
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  datePickerWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#376787',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
