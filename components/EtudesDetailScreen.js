import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  FlatList,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../utils/firebaseConfig';
import { adminEmails } from '../utils/adminConfig';

const { width, height } = Dimensions.get('window');

export default function EtudesDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const study = route.params?.study;

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [candidats, setCandidats] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setIsAdmin(adminEmails.includes(user.email));
        if (study?.id) {
          fetchCandidats();
        }
      }
    });
    return unsubscribe;
  }, [study?.id]); // Relance quand study.id change

  const fetchCandidats = async () => {
    if (!study?.id) return;
    try {
      const candidatsRef = collection(db, 'etudes', study.id, 'candidats');
      const snapshot = await getDocs(candidatsRef);
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCandidats(list);
    } catch (error) {
      console.log('Erreur lors du chargement des candidats :', error);
    }
  };

  const handlePostuler = () => {
    setConfirmModalVisible(true);
  };

  const confirmPostulation = async () => {
    setConfirmModalVisible(false);
    if (!currentUser || !study?.id) return;

    try {
      // Récupération info utilisateur
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        alert('Impossible de récupérer tes informations utilisateur.');
        return;
      }
      const userInfo = userDocSnap.data();

      // Vérifier si déjà candidat
      const candidatDocRef = doc(db, 'etudes', study.id, 'candidats', currentUser.uid);
      const candidatDocSnap = await getDoc(candidatDocRef);

      if (candidatDocSnap.exists()) {
        alert('Tu as déjà postulé à cette étude.');
        return;
      }

      // Ajout candidature
      const candidat = {
        id: currentUser.uid,
        nom: userInfo.nom,
        prenom: userInfo.prenom,
      };

      await setDoc(candidatDocRef, candidat);
      await fetchCandidats();
      setSuccessModalVisible(true);
    } catch (error) {
      console.log('Erreur lors de la postulation :', error);
      alert('Une erreur est survenue lors de la postulation.');
    }
  };

  const handleCandidatPress = (candidat) => {
    navigation.navigate('ConsulterCandidatScreen', { candidat });
  };

  if (!study) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Aucune étude sélectionnée.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>← Retour</Text>
      </TouchableOpacity>

      <View style={styles.titleWrapper}>
        <Text style={styles.title}>Détail de l'étude</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.studyTitle}>{study.titre}</Text>
        <Text style={styles.subTitle}>{study.domaine} • {study.duree}</Text>
        {study.deadline && (
          <Text style={styles.deadline}>Date limite : {study.deadline}</Text>
        )}

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.text}>{study.description}</Text>

        <Text style={styles.sectionTitle}>Compétences requises</Text>
        <Text style={styles.text}>{study.competences}</Text>

        <Text style={styles.sectionTitle}>Nombre de JEH</Text>
        <Text style={styles.text}>{study.jeh}</Text>

        {isAdmin && (
          <>
            <Text style={styles.sectionTitle}>Voir les candidats :</Text>
            <View style={styles.scrollCandidates}>
              <FlatList
                data={candidats}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.candidatItem}
                    onPress={() => handleCandidatPress(item)}
                  >
                    <Text style={styles.candidatName}>{item.prenom} {item.nom}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </>
        )}

        {isAdmin && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#e67e22' }]}
            onPress={() => navigation.navigate('ModifierEtude', { study })}
          >
            <Text style={styles.buttonText}>Modifier cette étude</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.button} onPress={handlePostuler}>
          <Text style={styles.buttonText}>Postuler à cette étude</Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <Modal transparent visible={confirmModalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>Es-tu sûr de vouloir postuler ?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={confirmPostulation}>
                <Text style={styles.modalButtonText}>Oui</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => setConfirmModalVisible(false)}>
                <Text style={styles.modalButtonText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={successModalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>Ta candidature a bien été enregistrée ✅</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => {
              setSuccessModalVisible(false);
              navigation.goBack();
            }}>
              <Text style={styles.modalButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollCandidates: {
    maxHeight: 150,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
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
    paddingTop: height * 0.08,
    paddingBottom: height * 0.01,
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
  studyTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subTitle: {
    fontSize: width * 0.04,
    color: '#376787',
    marginBottom: 5,
  },
  deadline: {
    fontSize: width * 0.035,
    color: '#999',
    marginBottom: 15,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  text: {
    fontSize: width * 0.04,
    color: '#333',
  },
  candidatItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  candidatName: {
    fontSize: width * 0.04,
    color: '#376787',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#376787',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.045,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  modalButton: {
    backgroundColor: '#376787',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
