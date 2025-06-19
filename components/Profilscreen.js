import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../utils/firebaseConfig';
import { doc, getDoc, onSnapshot, collectionGroup, getDocs } from 'firebase/firestore';

export default function ProfileScreen() {
  const [avatar] = useState(require('../assets/avatar.png'));
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [nbEtudes, setNbEtudes] = useState(0);
  const [totalJeh, setTotalJeh] = useState(0);
  const navigation = useNavigation();

useEffect(() => {
  const user = auth.currentUser;
  if (!user) return;

  const docRef = doc(db, 'users', user.uid);
  const unsubscribeUser = onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setNom(data.nom || '');
        setPrenom(data.prenom || '');
      }
    },
    (error) => {
      console.error('Erreur écoute temps réel profil :', error);
    }
  );

  const candidatsRef = collectionGroup(db, 'candidats');
  const unsubscribeCandidats = onSnapshot(candidatsRef, async (snapshot) => {
    const etudes = [];

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      if (data.id === user.uid && docSnap.ref.path.includes('etudes')) {
        const etudeId = docSnap.ref.parent.parent.id;
        const etudeDoc = await getDoc(doc(db, 'etudes', etudeId));
        if (etudeDoc.exists()) {
          etudes.push(etudeDoc.data());
        }
      }
    }

    setNbEtudes(etudes.length);
    const totalJehValue = etudes.reduce((sum, etude) => sum + (parseFloat(etude.jeh) || 0), 0);
    setTotalJeh(totalJehValue);
  }, (error) => {
    console.error('Erreur écoute temps réel candidatures :', error);
  });

  return () => {
    unsubscribeUser();
    unsubscribeCandidats();
  };
}, []);


  const fetchEtudesData = async (userId) => {
    try {
      const snapshot = await getDocs(collectionGroup(db, 'candidats'));
      const etudes = [];

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        if (data.id === userId && docSnap.ref.path.includes('etudes')) {
          const etudeId = docSnap.ref.parent.parent.id;
          const etudeDoc = await getDoc(doc(db, 'etudes', etudeId));
          if (etudeDoc.exists()) {
            etudes.push(etudeDoc.data());
          }
        }
      }

      setNbEtudes(etudes.length);
      const totalJehValue = etudes.reduce((sum, etude) => sum + (parseFloat(etude.jeh) || 0), 0);
      setTotalJeh(totalJehValue);
    } catch (error) {
      console.error('Erreur récupération études :', error);
    }
  };

  const handleLogout = () => setLogoutModalVisible(true);
  const confirmLogout = () => {
    setLogoutModalVisible(false);
    navigation.navigate('Login');
  };
  const cancelLogout = () => setLogoutModalVisible(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={() => navigation.navigate('Preferences')} style={styles.settingsButton}>
          <Image source={require('../assets/para2.png')} style={styles.settingsIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.avatarContainer}>
          <Image source={avatar} style={styles.avatar} />
        </View>

        <Text style={styles.name}>{prenom} {nom}</Text>

        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Études réalisées</Text>
            <Text style={styles.cardValue}>{nbEtudes}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Nombre de JEH</Text>
            <Text style={styles.cardValue}>{totalJeh}</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('InfosPerso')}>
            <Text style={styles.buttonText}>Modifier mes informations personnelles</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Historique')}>
            <Text style={styles.buttonText}>Voir historique</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de déconnexion */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={logoutModalVisible}
        onRequestClose={cancelLogout}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Êtes-vous sûr ?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={confirmLogout}>
                <Text style={styles.modalButtonText}>Oui</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={cancelLogout}>
                <Text style={styles.modalButtonText}>Non</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  settingsButton: {
    marginTop: 10,
  },
  settingsIcon: {
    width: 24,
    height: 24,
    tintColor: '#376787',
  },
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 5,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cardContainer: {
    width: '100%',
    gap: 10,
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  cardValue: {
    fontSize: 18,
  },
  buttonContainer: {
    width: '100%',
    gap: 10,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#376787',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logoutButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  logoutText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '80%',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 20,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#376787',
    borderRadius: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
