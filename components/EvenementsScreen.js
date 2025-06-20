import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { db, auth } from '../utils/firebaseConfig';
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  setDoc,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';
import { adminEmails } from '../utils/adminConfig';

export default function EvenementsScreen() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [pickerModalVisible, setPickerModalVisible] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [flashingId, setFlashingId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [inscribedEvents, setInscribedEvents] = useState([]);

  const animationRefs = useRef({});
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'evenements'), (snapshot) => {
      const now = new Date();
      const eventsData = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(event => {
          const eventDate = event.date?.toDate?.();
          return eventDate && eventDate >= now;
        });
      setEvents(eventsData);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const user = auth.currentUser;
    if (user && adminEmails.includes(user.email)) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }

    // Récupérer les événements auxquels l'utilisateur est inscrit
    if (user) {
      const unsubscribeInscriptions = onSnapshot(collection(db, 'evenements'), (snapshot) => {
        let userInscriptions = [];
        snapshot.forEach(docSnap => {
          const inscriptionsRef = collection(db, 'evenements', docSnap.id, 'inscriptions');
          onSnapshot(inscriptionsRef, (inscriptionsSnap) => {
            inscriptionsSnap.forEach(insc => {
              if (insc.id === user.uid) {
                userInscriptions.push(docSnap.id);
                setInscribedEvents([...userInscriptions]);
              }
            });
          });
        });
      });

      return () => unsubscribeInscriptions();
    }
  }, []);

  const startFlash = (eventId) => {
    if (!animationRefs.current[eventId]) return;
    Animated.sequence([
      Animated.timing(animationRefs.current[eventId], {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(animationRefs.current[eventId], {
        toValue: 0,
        duration: 600,
        useNativeDriver: false,
      })
    ]).start();
  };

  const handleInscription = async (event) => {
    if (!Number.isFinite(event.places) || event.places <= 0) {
      Alert.alert('Complet', 'Il ne reste plus de places disponibles.');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Erreur', 'Veuillez vous connecter pour vous inscrire.');
      return;
    }

    try {
      const inscriptionRef = doc(db, 'evenements', event.id, 'inscriptions', user.uid);
      const existing = await getDoc(inscriptionRef);
      if (existing.exists()) {
        Alert.alert('Déjà inscrit', 'Vous êtes déjà inscrit à cet événement.');
        return;
      }

      await setDoc(inscriptionRef, {
        userId: user.uid,
        evenementId: event.id,
        dateInscription: serverTimestamp(),
      });

      setSelectedEvent(event);
      setConfirmVisible(true);
    } catch (error) {
      Alert.alert('Erreur', "L'inscription a échoué.");
    }
  };

  const confirmInscription = async () => {
    setConfirmVisible(false);
    if (!selectedEvent) return;

    try {
      const eventRef = doc(db, 'evenements', selectedEvent.id);
      const newPlaces = selectedEvent.places - 1;
      await updateDoc(eventRef, { places: newPlaces });
      setFlashingId(selectedEvent.id);
      startFlash(selectedEvent.id);
      setSuccessVisible(true);
      setInscribedEvents(prev => [...prev, selectedEvent.id]);
    } catch (error) {
      Alert.alert('Erreur', "L'inscription a échoué.");
    }
  };

  const handleDesinscription = async (event) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const inscriptionRef = doc(db, 'evenements', event.id, 'inscriptions', user.uid);
      await deleteDoc(inscriptionRef);

      const eventRef = doc(db, 'evenements', event.id);
      const newPlaces = (event.places ?? 0) + 1;
      await updateDoc(eventRef, { places: newPlaces });

      setInscribedEvents(prev => prev.filter(id => id !== event.id));
      Alert.alert('Désinscription', "Vous êtes désinscrit de l'événement.");
    } catch (error) {
      Alert.alert('Erreur', "La désinscription a échoué.");
    }
  };

  const handleAdd = () => navigation.navigate('CreationEvent');

  const handleModify = () => {
    if (events.length === 0) {
      Alert.alert('Aucun événement', 'Pas d’événement à modifier.');
      return;
    }
    setActionType('modifier');
    setPickerModalVisible(true);
  };

  const handleDelete = () => {
    if (events.length === 0) {
      Alert.alert('Aucun événement', 'Pas d’événement à supprimer.');
      return;
    }
    setActionType('supprimer');
    setPickerModalVisible(true);
  };

  const handleEventSelect = async (event) => {
    setPickerModalVisible(false);
    if (actionType === 'modifier') {
      navigation.navigate('ModifEvenement', { event });
    } else if (actionType === 'supprimer') {
      try {
        await deleteDoc(doc(db, 'evenements', event.id));
        Alert.alert('Succès', 'Événement supprimé');
      } catch (error) {
        Alert.alert('Erreur', 'La suppression a échoué.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>📅 Événements à venir - EPF Projets</Text>

        {events.map((event) => {
          if (!animationRefs.current[event.id]) {
            animationRefs.current[event.id] = new Animated.Value(0);
          }

          const flashColor = animationRefs.current[event.id].interpolate({
            inputRange: [0, 1],
            outputRange: ['#000', '#ff0000']
          });

          return (
            <View key={event.id} style={styles.card}>
              <View style={styles.placesBox}>
                <Text style={styles.placesLabel}>Places restantes</Text>
                <Animated.Text style={[styles.placesCount, { color: flashColor }]}>
                  {Number.isFinite(event.places) ? event.places : '—'}
                </Animated.Text>
              </View>
              <Text style={styles.eventTitle}>{event.nom}</Text>
              <Text style={styles.date}>
                <Ionicons name="calendar-outline" /> {event.date ? event.date.toDate().toLocaleString() : 'Date inconnue'}
              </Text>
              <Text style={styles.lieu}>
                <Ionicons name="location-outline" /> {event.lieu}
              </Text>
              <Text style={styles.description}>{event.description}</Text>

              <View style={styles.buttonContainer}>
                {!inscribedEvents.includes(event.id) ? (
                  <TouchableOpacity style={styles.button} onPress={() => handleInscription(event)}>
                    <Text style={styles.buttonText}>S'inscrire</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.unregisterButton}
                    onPress={() => handleDesinscription(event)}
                  >
                    <Text style={styles.unregisterButtonText}>Se désinscrire</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}

        {isAdmin && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.greenButton} onPress={handleAdd}>
              <Text style={styles.buttonLabel}>Ajouter un événement</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.orangeButton} onPress={handleModify}>
              <Text style={styles.buttonLabel}>Modifier un événement</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.redButton} onPress={handleDelete}>
              <Text style={styles.buttonLabel}>Supprimer un événement</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <Modal visible={confirmVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>
              Confirmer l’inscription à "{selectedEvent?.nom}" ?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalButton} onPress={confirmInscription}>
                <Text style={styles.modalButtonText}>Oui</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => setConfirmVisible(false)}>
                <Text style={styles.modalButtonText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={successVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>Inscription enregistrée ✅</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setSuccessVisible(false)}>
              <Text style={styles.modalButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={pickerModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { maxHeight: '60%' }]}>
            <Text style={styles.modalText}>
              {actionType === 'modifier' ? 'Sélectionner un événement à modifier' : 'Sélectionner un événement à supprimer'}
            </Text>
            <FlatList
              data={events}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleEventSelect(item)} style={styles.eventItem}>
                  <Text>{item.nom}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.modalButton} onPress={() => setPickerModalVisible(false)}>
              <Text style={styles.modalButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
  card: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#f2f2f2',
  },
  eventTitle: { fontSize: 17, fontWeight: 'bold', marginBottom: 5, paddingRight: 120},
  date: { fontSize: 14, color: '#333', marginBottom: 2 },
  lieu: { fontSize: 14, color: '#333', marginBottom: 5 },
  description: { fontSize: 14, color: '#555', marginBottom: 10 },

  placesBox: {
  position: 'absolute',
  top: 10,
  right: 10,
  backgroundColor: '#376787',
  paddingVertical: 6,
  paddingHorizontal: 10,
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10,
},

  placesLabel: {
  fontSize: 11,
  color: '#fff',
  fontWeight: '600',
  fontWeight: 'bold'
},

placesCount: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#fff', 
},

  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    alignItems: 'center',
  },

  button: {
    backgroundColor: '#376787',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },

  unregisterButton: {
    backgroundColor: '#e53935',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  unregisterButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  actionButtons: { alignItems: 'center', gap: 10, marginTop: 10 },
  greenButton: { backgroundColor: '#008000', padding: 10, borderRadius: 10 },
  orangeButton: { backgroundColor: '#FFA500', padding: 10, borderRadius: 10 },
  redButton: { backgroundColor: '#e53935', padding: 10, borderRadius: 10 },
  buttonLabel: { color: '#fff', fontWeight: 'bold' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: { backgroundColor: '#fff', padding: 25, borderRadius: 12, width: '85%', alignItems: 'center' },
  modalText: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
  modalActions: { flexDirection: 'row', gap: 15 },
  modalButton: {
    backgroundColor: '#376787',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  modalButtonText: { color: '#fff', fontWeight: '600' },

  eventItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
