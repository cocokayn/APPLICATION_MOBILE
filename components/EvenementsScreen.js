import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { db } from '../utils/firebaseConfig';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';

export default function EvenementsScreen() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [pickerModalVisible, setPickerModalVisible] = useState(false);
  const [actionType, setActionType] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'evenements'), (snapshot) => {
      const now = new Date();
      const eventsData = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(event => {
          const eventDate = event.date.toDate();
          return eventDate >= now;
        });
      setEvents(eventsData);
    });

    return () => unsubscribe();
  }, []);

  const handleInscription = (event) => {
    setSelectedEvent(event);
    setConfirmVisible(true);
  };

  const confirmInscription = () => {
    setConfirmVisible(false);
    setSuccessVisible(true);
    // Ajouter inscription dans Firestore si besoin
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

        {events.map((event) => (
          <View key={event.id} style={styles.card}>
            <Text style={styles.eventTitle}>{event.nom}</Text>
            <Text style={styles.date}>
              <Ionicons name="calendar-outline" /> {event.date ? event.date.toDate().toLocaleString() : 'Date inconnue'}
            </Text>
            <Text style={styles.lieu}>
              <Ionicons name="location-outline" /> {event.lieu}
            </Text>
            <Text style={styles.description}>{event.description}</Text>
            <TouchableOpacity style={styles.button} onPress={() => handleInscription(event)}>
              <Text style={styles.buttonText}>S'inscrire</Text>
            </TouchableOpacity>
          </View>
        ))}

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
      </ScrollView>

      {/* Modal inscription */}
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

      {/* Modal succès */}
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

      {/* Modal sélection événement */}
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
  card: { backgroundColor: '#f2f2f2', borderRadius: 12, padding: 15, marginBottom: 15 },
  eventTitle: { fontSize: 17, fontWeight: 'bold', marginBottom: 5 },
  date: { fontSize: 14, color: '#333', marginBottom: 2 },
  lieu: { fontSize: 14, color: '#333', marginBottom: 5 },
  description: { fontSize: 14, color: '#555', marginBottom: 10 },
  button: {
    backgroundColor: '#376787',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
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
