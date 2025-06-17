import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../utils/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updatePassword } from 'firebase/auth';

const { width, height } = Dimensions.get('window');

export default function InfosPersoScreen() {
  const navigation = useNavigation();
  const [infos, setInfos] = useState({
    nom: '',
    prenom: '',
    email: '',
    github: '',
    portfolio: '',
  });
  const [newPassword, setNewPassword] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      setUserId(user.uid);

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setInfos(userDoc.data());
        }
      } catch (error) {
        console.error('Erreur de récupération des données :', error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (field, value) => {
    setInfos((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!userId) return;

    try {
      await updateDoc(doc(db, 'users', userId), {
        nom: infos.nom,
        prenom: infos.prenom,
        email: infos.email,
        github: infos.github,
        portfolio: infos.portfolio,
      });

      if (newPassword.trim() !== '') {
        await updatePassword(auth.currentUser, newPassword);
        Alert.alert('Succès', 'Mot de passe mis à jour.');
      } else {
        Alert.alert('Succès', 'Informations mises à jour.');
      }

    } catch (error) {
      console.error(error);
      if (error.code === 'auth/requires-recent-login') {
        Alert.alert('Erreur', 'Reconnectez-vous pour changer le mot de passe.');
      } else {
        Alert.alert('Erreur', error.message || 'Une erreur est survenue.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>← Retour</Text>
      </TouchableOpacity>

      <View style={styles.titleWrapper}>
        <Text style={styles.title}>Infos personnelles</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Nom</Text>
        <TextInput style={styles.input} value={infos.nom} onChangeText={(text) => handleChange('nom', text)} />

        <Text style={styles.label}>Prénom</Text>
        <TextInput style={styles.input} value={infos.prenom} onChangeText={(text) => handleChange('prenom', text)} />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={infos.email}
          onChangeText={(text) => handleChange('email', text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>GitHub</Text>
        <TextInput style={styles.input} value={infos.github} onChangeText={(text) => handleChange('github', text)} />

        <Text style={styles.label}>Portfolio</Text>
        <TextInput style={styles.input} value={infos.portfolio} onChangeText={(text) => handleChange('portfolio', text)} />

        <Text style={styles.label}>Nouveau mot de passe</Text>
        <TextInput
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          placeholder="Laisser vide pour ne pas modifier"
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Enregistrer les modifications</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  backButton: {
    position: 'absolute',
    top: height * 0.06,
    left: '5%',
    padding: 8,
    zIndex: 10,
  },
  backText: {
    fontSize: width * 0.045,
    color: '#376787',
    fontWeight: 'bold',
  },
  titleWrapper: {
    paddingTop: height * 0.12,
    paddingBottom: height * 0.015,
    paddingHorizontal: '5%',
    alignItems: 'center',
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: height * 0.03,
  },
  card: {
    backgroundColor: '#f0f0f0',
    marginHorizontal: '5%',
    borderRadius: 12,
    padding: 20,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginTop: 5,
    fontSize: width * 0.04,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#376787',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: width * 0.045,
  },
});
