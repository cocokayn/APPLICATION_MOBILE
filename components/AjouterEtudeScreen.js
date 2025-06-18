import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../utils/firebaseConfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const { width, height } = Dimensions.get('window');

const domainImages = {
<<<<<<< HEAD
  'IT & Digital': require('../assets/IT_Digital.jpg'),
  'Ingénierie et RSE': require('../assets/Ingénierie-RSE.jpg'),
  'Traduction Technique': require('../assets/traduction-techniques.jpg'),
  'Ingénierie et systèmes': require('../assets/Ing-Sys.jpg'),
  'Conseil et entrepenariat': require('../assets/entrepreneuriat.jpg'),
  'Digital & Culture': require('../assets/Digital-culture.png'),
=======
>>>>>>> 54fc96d95d6cdfc6d0db515db1d2cb8019aa69a3
  default: require('../assets/snack-icon.png'), // Image par défaut
};

export default function AjouterEtudeScreen() {
  const navigation = useNavigation();

  const [titre, setTitre] = useState('');
  const [dateLimite, setDateLimite] = useState('');
  const [description, setDescription] = useState('');
  const [competences, setCompetences] = useState('');
  const [jeh, setJeh] = useState('');

  const scrollViewRef = useRef(null);
  const titreRef = useRef(null);
  const dateLimiteRef = useRef(null);
  const descriptionRef = useRef(null);
  const jehRef = useRef(null);

  // Toujours retourner l'image par défaut
  const getDomainImage = () => {
    return domainImages.default;
  };

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
    if (!titre || !dateLimite || !description || !competences || !jeh) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    const dateObj = new Date(dateLimite);
    if (isNaN(dateObj.getTime())) {
      Alert.alert('Erreur', "La date limite n'est pas valide (format attendu : YYYY-MM-DD).");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dateObj < today) {
      Alert.alert('Erreur', "La date limite ne peut pas être antérieure à aujourd'hui.");
      return;
    }

    const jehInt = parseInt(jeh, 10);
    if (isNaN(jehInt) || jehInt < 1) {
      Alert.alert('Erreur', 'Le nombre de JEH doit être un entier ≥ 1.');
      return;
    }

    try {
      const newEtude = {
        titre,
        domaine: '', // Plus de domaine choisi, on laisse vide ou fixe
        deadline: dateLimite,
        description,
        competences,
        jeh: jehInt,
        photoProfil: null,
        statut: 'ouverte',
        date_publication: Timestamp.now(),
        date_debut: Timestamp.fromDate(dateObj),
        date_fin: Timestamp.fromDate(dateObj),
        id_historique: 'hist01',
        id_participation: 'part01',
        id_postulation: 'post01',
      };

      await addDoc(collection(db, 'etudes'), newEtude);
      Alert.alert('Succès', "L'étude a été ajoutée !");
      navigation.goBack();
    } catch (error) {
      console.error('Erreur ajout étude:', error);
      Alert.alert('Erreur', "Impossible d'ajouter l'étude. Veuillez réessayer.");
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

        <Text style={styles.title}>Création d'une étude</Text>

        <View style={styles.imagePicker}>
          <Image source={getDomainImage()} style={styles.imagePreview} />
        </View>

        <TextInput
          ref={titreRef}
          placeholder="Nom de l'étude"
          value={titre}
          onChangeText={setTitre}
          style={styles.input}
          onFocus={() => scrollToInput(titreRef)}
          returnKeyType="next"
          onSubmitEditing={() => dateLimiteRef.current.focus()}
          blurOnSubmit={false}
        />

        <TextInput
          ref={dateLimiteRef}
          placeholder="Date limite (YYYY-MM-DD)"
          value={dateLimite}
          onChangeText={setDateLimite}
          style={styles.input}
          onFocus={() => scrollToInput(dateLimiteRef)}
          returnKeyType="next"
          onSubmitEditing={() => descriptionRef.current.focus()}
          blurOnSubmit={false}
        />

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
          returnKeyType="next"
          onSubmitEditing={() => jehRef.current.focus()}
          blurOnSubmit={false}
        />

        <TextInput
          placeholder="Compétences requises"
          value={competences}
          onChangeText={setCompetences}
          style={styles.input}
          returnKeyType="next"
        />

        <TextInput
          ref={jehRef}
          placeholder="Nombre de JEH (min 1)"
          value={jeh}
          onChangeText={setJeh}
          keyboardType="numeric"
          style={styles.input}
          onFocus={() => scrollToInput(jehRef)}
          returnKeyType="done"
          onSubmitEditing={handleCreate}
        />

        <Pressable style={styles.button} onPress={handleCreate}>
          <Text style={styles.buttonText}>Créer une étude</Text>
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
    marginTop: 0,
  },
  imagePicker: {
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  imagePreview: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.15,
    borderWidth: 1,
    borderColor: '#ccc',
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
    borderRadius: 10,
    marginTop: height * 0.02,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.045,
  },
});
