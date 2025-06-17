import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig';

import { auth } from '../utils/firebaseConfig'; // Import de l'auth Firebase
import { adminEmails } from '../utils/adminConfig'; // Liste des emails admin


export default function EtudesScreen() {
  const navigation = useNavigation();
  const [studies, setStudies] = useState([]);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedStudies, setSelectedStudies] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // Écoute Firestore en temps réel
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'etudes'),
      (snapshot) => {
        const etudesFirestore = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStudies(etudesFirestore);
      },
      (error) => {
        console.error('Erreur récupération temps réel études Firestore :', error);
      }
    );

    return () => unsubscribe();
  }, []);


  // Vérification si user est admin
  useEffect(() => {
    const user = auth.currentUser;
    if (user && adminEmails.includes(user.email)) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
      setDeleteMode(false);      // Enlever mode suppression si pas admin
      setSelectedStudies([]);    // Clear sélection aussi
    }
  }, [auth.currentUser]); // à modifier si besoin (sinon ajouter listener auth)


  const toggleStudySelection = (id) => {
    setSelectedStudies((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedStudies.length === 0) return;

    // Supprimer dans Firestore
    try {
      await Promise.all(
        selectedStudies.map(async (id) => {
          await deleteDoc(doc(db, 'etudes', id));
        })
      );
      Alert.alert('Succès', 'Études supprimées.');
    } catch (error) {
      console.error('Erreur suppression études:', error);
      Alert.alert('Erreur', "Impossible de supprimer les études.");
    }

    setSelectedStudies([]);
    setDeleteMode(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>📚 Études disponibles - EPF Projets</Text>

        {studies.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.leftIcon}>
              <Image
                source={require('../assets/snack-icon.png')}
                style={styles.icon}
              />
            </View>

            <View style={styles.content}>
              <Text style={styles.category}>
                {item.domaine} • {item.duree || '-'}
              </Text>
              <Text style={styles.title}>{item.titre}</Text>
              {item.deadline && (
                <Text style={styles.deadline}>Date limite : {item.deadline}</Text>
              )}
            </View>

            {deleteMode ? (
              <TouchableOpacity
                style={styles.checkboxCircle}
                onPress={() => toggleStudySelection(item.id)}
              >
                <View
                  style={
                    selectedStudies.includes(item.id)
                      ? styles.checkboxSelected
                      : styles.checkbox
                  }
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('EtudesDetail', { study: item })}
              >
                <Text style={styles.buttonText}>Voir plus</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>

      {/* --- AFFICHER SEULEMENT POUR ADMIN --- */}
      {isAdmin && (
        deleteMode ? (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.redButton} onPress={handleDeleteSelected}>
              <Text style={styles.redButtonText}>Confirmer suppression</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.redButton, { backgroundColor: '#aaa' }]}
              onPress={() => {
                setDeleteMode(false);
                setSelectedStudies([]);
              }}
            >
              <Text style={styles.redButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.greenButton}
              onPress={() => navigation.navigate('AjouterEtude')}
            >
              <Text style={styles.greenButtonText}>Ajouter une étude</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.redButton} onPress={() => setDeleteMode(true)}>
              <Text style={styles.redButtonText}>Supprimer une étude</Text>
            </TouchableOpacity>
          </View>
        )
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 20, paddingBottom: 120 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2A2A2A',
    marginBottom: 15,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  leftIcon: { marginRight: 12, marginTop: 5 },
  icon: { width: 30, height: 30, resizeMode: 'contain' },
  content: { flex: 1 },
  category: {
    fontSize: 14,
    fontWeight: '600',
    color: '#376787',
    marginBottom: 3,
  },
  title: { fontSize: 15, fontWeight: '500', color: '#000' },
  deadline: { fontSize: 13, color: '#888', marginTop: 4 },
  button: {
    backgroundColor: '#376787',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  checkboxCircle: {
    alignSelf: 'center',
    marginLeft: 10,
    marginTop: 5,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#999',
  },
  checkboxSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#376787',
    borderWidth: 2,
    borderColor: '#376787',
  },

  actionButtons: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  redButton: {
    backgroundColor: '#e53935',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  greenButton: {
    backgroundColor: '#008000',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  redButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  greenButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
