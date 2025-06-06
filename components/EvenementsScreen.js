import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function EvenementsScreen() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [pickerModalVisible, setPickerModalVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const mockEvents = [
      {
        id: '1',
        titre: 'Atelier UX Design',
        date: '2025-06-28',
        lieu: 'EPF Cachan - Grand Amphi',
        description: 'Introduction aux bonnes pratiques UX.',
      },
      {
        id: '2',
        titre: 'Conférence sur l’IA',
        date: '2025-06-20',
        lieu: 'EPF Cachan - Petit Amphi',
        description: 'Découverte des usages de l’intelligence artificielle.',
      },
      {
        id: '3',
        titre: 'Formation Firebase',
        date: '2025-06-12',
        lieu: 'EPF Cachan - Grand Amphi',
        description: 'Prise en main de Firebase pour les apps mobiles.',
      },
    ];

    const now = new Date();
    const filtered = mockEvents.filter((e) => new Date(e.date) >= now);
    setEvents(filtered);
  }, []);

  const handleInscription = (event) => {
    setSelectedEvent(event);
    setConfirmVisible(true);
  };

  const confirmInscription = () => {
    setConfirmVisible(false);
    setSuccessVisible(true);
  };

  const handleAdd = () => {
    navigation.navigate('CreationEvent');
  };

  const handleModify = () => {
    setActionType('modifier');
    setPickerModalVisible(true);
  };

  const handleDelete = () => {
    setActionType('supprimer');
    setPickerModalVisible(true);
  };

  const handleEventSelect = (event) => {
    setPickerModalVisible(false);
    if (actionType === 'modifier') {
      navigation.navigate('ModifEvenement', { event });
    } else if (actionType === 'supprimer') {
      setEvents(events.filter((e) => e.id !== event.id));
      Alert.alert('Succès', 'Événement supprimé');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>📅 Événements à venir - EPF Projets</Text>

        {events.map((event) => (
          <View key={event.id} style={styles.card}>
            <Text style={styles.eventTitle}>{event.titre}</Text>
            <Text style={styles.date}><Ionicons name="calendar-outline" /> {event.date}</Text>
            <Text style={styles.lieu}><Ionicons name="location-outline" /> {event.lieu}</Text>
            <Text style={styles.description}>{event.description}</Text>
            <TouchableOpacity style={styles.button} onPress={() => handleInscription(event)}>
              <Text style={styles.buttonText}>S'inscrire</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.redButton} onPress={handleModify}>
            <Text style={styles.redButtonText}>Modifier l’événement</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.redButton} onPress={handleDelete}>
            <Text style={styles.redButtonText}>Supprimer un événement</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.redButton} onPress={handleAdd}>
            <Text style={styles.redButtonText}>Ajouter un événement</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal de confirmation */}
      <Modal visible={confirmVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>
              Confirmer l’inscription à "{selectedEvent?.titre}" ?
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

      {/* Modal de succès */}
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

      {/* Modal avec liste d’événements */}
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
                  <Text>{item.titre}</Text>
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
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  card: {
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
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
    width: '85%',
    alignItems: 'center',
  },
  modalText: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
  modalActions: { flexDirection: 'row', gap: 15 },
  modalButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  modalButtonText: { color: '#fff', fontWeight: '600' },
  actionButtons: {
    marginTop: 10,
    alignItems: 'center',
    gap: 10,
  },
  redButton: {
    backgroundColor: '#e53935',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  redButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  eventItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
