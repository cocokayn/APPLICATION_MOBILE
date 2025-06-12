import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db, storage } from '../utils/firebaseConfig'; // Ajouté storage ici
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function ProfileScreen() {
  const [badgesVisible, setBadgesVisible] = useState(false);
  const [avatar, setAvatar] = useState(require('../assets/avatar.png'));
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [badgeCount, setBadgeCount] = useState(3);
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const navigation = useNavigation();

  const [tempAvatar, setTempAvatar] = useState(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  useEffect(() => {
    const loadProfileData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setNom(data.nom || '');
          setPrenom(data.prenom || '');
        }

        const savedAvatar = await AsyncStorage.getItem('userAvatar');
        if (savedAvatar) {
          setAvatar({ uri: savedAvatar });
        }
      } catch (err) {
        console.error('Erreur de chargement du profil :', err);
      }
    };

    loadProfileData();
  }, []);

  const toggleBadges = () => setBadgesVisible(!badgesVisible);

  const changeAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setTempAvatar(uri);
      setConfirmModalVisible(true);
    }
  };

  const confirmAvatar = async () => {
    const user = auth.currentUser;

    if (user && tempAvatar) {
      try {
        const response = await fetch(tempAvatar);
        const blob = await response.blob();
        const storageRef = ref(storage, `avatars/${user.uid}.jpg`);

        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);

        const docRef = doc(db, 'users', user.uid);
        await setDoc(docRef, { photoURL: downloadURL }, { merge: true });

        await AsyncStorage.setItem('userAvatar', downloadURL);
        setAvatar({ uri: downloadURL });

        setTempAvatar(null);
        setConfirmModalVisible(false);

      } catch (error) {
        console.error("Erreur lors du changement d'avatar :", error);
      }
    }
  };

  const cancelAvatarChange = () => {
    setTempAvatar(null);
    setConfirmModalVisible(false);
  };

  const handleLogout = () => setLogoutModalVisible(true);
  const confirmLogout = () => {
    setLogoutModalVisible(false);
    navigation.navigate('Login');
  };
  const cancelLogout = () => setLogoutModalVisible(false);

  const totalBadges = 10;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={() => navigation.navigate('Preferences')} style={styles.settingsButton}>
          <Image source={require('../assets/para2.png')} style={styles.settingsIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={changeAvatar} style={styles.avatarContainer}>
          <Image source={avatar} style={styles.avatar} />
          <Text style={styles.editAvatarText}>Modifier la photo de profil</Text>
        </TouchableOpacity>

        <Text style={styles.name}>{prenom} {nom}</Text>

        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Études réalisées</Text>
            <Text style={styles.cardValue}>12</Text>
          </View>

          <TouchableOpacity style={styles.card} onPress={toggleBadges}>
            <Text style={styles.cardTitle}>Badges obtenus</Text>
            <Text style={styles.cardValue}>{badgeCount}</Text>
            {badgesVisible && (
              <View style={styles.badgeList}>
                {Array.from({ length: totalBadges }).map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.badge,
                      index < badgeCount ? styles.badgeObtained : styles.badgeEmpty,
                    ]}
                  >
                    {index < badgeCount && (
                      <Image source={require('../assets/Badges.png')} style={styles.badgeIcon} />
                    )}
                  </View>
                ))}
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Nombre de JEH</Text>
            <Text style={styles.cardValue}>8</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('InfosPerso')}>
            <Text style={styles.buttonText}>Voir ou modifier mes infos personnelles</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Historique')}>
            <Text style={styles.buttonText}>Voir historique</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal déconnexion */}
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

      {/* Modal confirmation avatar */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmModalVisible}
        onRequestClose={cancelAvatarChange}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Confirmer la nouvelle photo de profil ?</Text>
            {tempAvatar && (
              <Image source={{ uri: tempAvatar }} style={styles.confirmAvatarImage} />
            )}
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={confirmAvatar}>
                <Text style={styles.modalButtonText}>Valider</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={cancelAvatarChange}>
                <Text style={styles.modalButtonText}>Annuler</Text>
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
  editAvatarText: {
    color: '#376787',
    marginBottom: 5,
    fontSize: 20,
    fontWeight: '500',
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
  badgeList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 10,
    justifyContent: 'center',
  },
  badge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeObtained: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  badgeEmpty: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ccc',
  },
  badgeIcon: {
    width: 24,
    height: 24,
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
  confirmAvatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
});
