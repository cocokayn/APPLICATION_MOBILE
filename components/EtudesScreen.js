import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../utils/firebaseConfig';
import { adminEmails } from '../utils/adminConfig';

// Import statique des images domaine -> image
const domaineImages = {
  'IT & Digital': require('../assets/IT_Digital.jpg'),
  'Ingénierie & RSE': require('../assets/Ingénierie-RSE.jpg'),
  'Traduction Technique': require('../assets/traduction-techniques.jpg'),
  'Ingénierie & systèmes': require('../assets/Ing-Sys.jpg'),
  'Conseil & entrepenariat': require('../assets/entrepreneuriat.jpg'),
  'Digital au service de la Culture': require('../assets/Digital-culture.png'),
  default: require('../assets/snack-icon.png'),
};

export default function EtudesScreen() {
  const navigation = useNavigation();
  const [studies, setStudies] = useState([]);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedStudies, setSelectedStudies] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

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

  useEffect(() => {
    const user = auth.currentUser;
    if (user && adminEmails.includes(user.email)) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
      setDeleteMode(false);
      setSelectedStudies([]);
    }
  }, [auth.currentUser]);

  const toggleStudySelection = (id) => {
    setSelectedStudies((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedStudies.length === 0) return;
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
          <ImageBackground
            key={item.id}
            source={domaineImages[item.domaine] || domaineImages.default}
            style={styles.cardBackground}
            imageStyle={styles.cardImage}
          >
            <View style={styles.overlay}>
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
          </ImageBackground>
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
  container: { padding: 20, paddingBottom: 140 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2A2A2A',
    marginBottom: 15,
    textAlign: 'center',
  },

  // Cartes avec image en fond
  cardBackground: {
    height: 140,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
    justifyContent: 'flex-end',
  },
  cardImage: {
    resizeMode: 'cover',
    opacity: 0.65,
  },
  overlay: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.35)',
    padding: 15,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    height: '100%',
  },

  // Texte sur carte
  content: { flex: 1 },
  category: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  deadline: {
    fontSize: 13,
    color: '#eee',
    marginTop: 4,
  },

  // Bouton Voir plus
  button: {
    backgroundColor: '#376787',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 13 },

  // Checkbox pour admin
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
    borderColor: '#ccc',
    backgroundColor: 'transparent',
  },
  checkboxSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#fff',
  },

  // Boutons admin
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
    height: 48,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  greenButton: {
    backgroundColor: '#008000',
    height: 48,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  redButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
  greenButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
});
