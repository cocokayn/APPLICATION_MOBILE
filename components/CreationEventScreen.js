import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { db } from '../utils/firebaseConfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const { width, height } = Dimensions.get('window');

export default function AjouterEvenementScreen() {
  const navigation = useNavigation();

  const [nom, setNom] = useState('');
  const [domaine, setDomaine] = useState('');
  const [description, setDescription] = useState('');
  const [places, setPlaces] = useState('');
  const [lieu, setLieu] = useState('');
  const [dateTime, setDateTime] = useState(new Date());

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const scrollViewRef = useRef(null);
  const nomRef = useRef(null);
  const descriptionRef = useRef(null);
  const placesRef = useRef(null);
  const lieuRef = useRef(null);

  const scrollToInput = (ref) => {
    setTimeout(() => {
      ref.current?.measureLayout(
        scrollViewRef.current,
        (x, y) => {
          scrollViewRef.current.scrollTo({ y: y - 80, animated: true });
        }
      );
    }, 100);
  };

  const handleCreate = async () => {
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
      const newEvent = {
        nom,
        domaine,
        date: Timestamp.fromDate(dateTime),
        description,
        places: placesInt,
        lieu,
        date_creation: Timestamp.now(),
      };

      await addDoc(collection(db, 'evenements'), newEvent);
      Alert.alert('Succès', "L'événement a été ajouté !");
      navigation.navigate('EvenementsScreen', { createdEventName: nom });
    } catch (error) {
      console.error('Erreur ajout événement:', error);
      Alert.alert('Erreur', "Impossible d'ajouter l'événement. Veuillez réessayer.");
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const updatedDate = new Date(dateTime);
      updatedDate.setFullYear(selectedDate.getFullYear());
      updatedDate.setMonth(selectedDate.getMonth());
      updatedDate.setDate(selectedDate.getDate());
      setDateTime(updatedDate);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const updatedDate = new Date(dateTime);
      updatedDate.setHours(selectedTime.getHours());
      updatedDate.setMinutes(selectedTime.getMinutes());
      setDateTime(updatedDate);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Retour</Text>
        </Pressable>

        <Text style={styles.title}>Créer un événement</Text>

        <TextInput
          ref={nomRef}
          placeholder="Nom de l'événement"
          value={nom}
          onChangeText={setNom}
          style={styles.input}
          onFocus={() => scrollToInput(nomRef)}
          returnKeyType="next"
          blurOnSubmit={false}
        />

        <TextInput
          placeholder="Type d'événement"
          value={domaine}
          onChangeText={setDomaine}
          style={styles.input}
          onFocus={() => scrollToInput(lieuRef)}
        />

        <Text style={styles.label}>Date :</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
          <Text>{dateTime.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={dateTime}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        <Text style={styles.label}>Heure :</Text>
        <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.input}>
          <Text>{dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={dateTime}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )}

        <TextInput
          ref={descriptionRef}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          onFocus={() => scrollToInput(descriptionRef)}
        />

        <TextInput
          ref={placesRef}
          placeholder="Places disponibles (min 1)"
          keyboardType="numeric"
          value={places}
          onChangeText={setPlaces}
          style={styles.input}
          onFocus={() => scrollToInput(placesRef)}
        />

        <TextInput
          ref={lieuRef}
          placeholder="Lieu"
          value={lieu}
          onChangeText={setLieu}
          style={styles.input}
          onFocus={() => scrollToInput(lieuRef)}
        />

        <Pressable style={styles.button} onPress={handleCreate}>
          <Text style={styles.buttonText}>Créer l’événement</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: '5%',
    paddingTop: height * 0.15,
    paddingBottom: height * 0.02,
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: height * 0.08,
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
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: height * 0.015,
    paddingHorizontal: '4%',
    marginBottom: height * 0.015,
    borderRadius: 8,
    width: '100%',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
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
