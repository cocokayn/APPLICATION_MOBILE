import React, { useState, useEffect } from 'react';
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
import { auth, firestore } from '../utils/firebaseConfig';
import { collection, doc, getDoc, getDocs, addDoc, query, where } from 'firebase/firestore';

const { width, height } = Dimensions.get('window');

export default function EtudesDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const study = route.params?.study;
  const userRole = 'admin';

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [candidats, setCandidats] = useState([]);

  const fetchCandidats = async () => {
    try {
      const q = query(
        collection(firestore, 'postulations'),
        where('studyId', '==', study.id)
      );
      const querySnapshot = await getDocs(q);
      const candidatsData = [];

      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        const userRef = doc(firestore, 'users', data.userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          candidatsData.push({
            id: data.userId,
            nom: `${userData.prenom} ${userData.nom}`,
          });
        }
      }

      setCandidats(candidatsData);
    } catch (error) {
      console.error('Erreur lors de la récupération des candidats :', error);
    }
  };

  useEffect(() => {
    if (study?.id) {
      fetchCandidats();
    }
  }, [study]);

  const handlePostuler = () => {
    setConfirmModalVisible(true);
  };

  const confirmPostulation = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(firestore, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();

        await addDoc(collection(firestore, 'postulations'), {
          studyId: study.id,
          userId: user.uid,
          timestamp: new Date(),
        });

        setConfirmModalVisible(false);
        setSuccessModalVisible(true);
        fetchCandidats(); // Rafraîchir la liste
      }
    } catch (error) {
      console.error('Erreur lors de la postulation :', error);
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
        {study.deadline && <Text style={styles.deadline}>Date limite : {study.deadline}</Text>}

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.text}>{study.description}</Text>

        <Text style={styles.sectionTitle}>Compétences requises</Text>
        <Text style={styles.text}>{study.competences}</Text>

        <Text style={styles.sectionTitle}>Nombre de JEH</Text>
        <Text style={styles.text}>{study.jeh}</Text>

        {userRole === 'admin' && (
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
                    <Text style={styles.candidatName}>{item.nom}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </>
        )}

        {userRole === 'admin' && (
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
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setSuccessModalVisible(false);
                navigation.goBack();
              }}
            >
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
