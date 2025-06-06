import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function EtudesDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const study = route.params?.study;
  const userRole = 'admin';

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  if (!study) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>Aucune étude sélectionnée.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handlePostuler = () => {
    setConfirmModalVisible(true);
  };

  const confirmPostulation = () => {
    setConfirmModalVisible(false);
    setSuccessModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>{study.titre}</Text>
        <Text style={styles.subTitle}>{study.domaine} • {study.duree}</Text>
        {study.deadline && (
          <Text style={styles.deadline}>Date limite : {study.deadline}</Text>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.text}>{study.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compétences requises</Text>
          <Text style={styles.text}>{study.competences}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nombre de JEH</Text>
          <Text style={styles.text}>{study.jeh}</Text>
        </View>

        {userRole === 'admin' && (
  <>
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Candidats qui ont postulé :</Text>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#888' }]}
        onPress={() => navigation.navigate('ConsulterCandidatScreen')}
      >
        <Text style={styles.buttonText}>Voir Alexis Bidault</Text>
      </TouchableOpacity>
    </View>

    <TouchableOpacity
      style={[styles.button, { backgroundColor: '#e67e22' }]}
      onPress={() => navigation.navigate('ModifierEtude', { study })}
    >
      <Text style={styles.buttonText}>Modifier cette étude</Text>
    </TouchableOpacity>
  </>
)}

        <TouchableOpacity style={styles.button} onPress={handlePostuler}>
          <Text style={styles.buttonText}>Postuler à cette étude</Text>
        </TouchableOpacity>
      </View>

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
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
  subTitle: { fontSize: 15, color: '#376787', marginBottom: 5 },
  deadline: { fontSize: 14, color: '#999', marginBottom: 20 },
  section: { marginBottom: 20 },
  sectionTitle: { fontWeight: 'bold', marginBottom: 5 },
  text: { fontSize: 14, color: '#333' },
  button: {
    backgroundColor: '#376787',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
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
    width: '80%',
    alignItems: 'center',
  },
  modalText: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  modalButtons: { flexDirection: 'row', gap: 15 },
  modalButton: {
    backgroundColor: '#376787',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  modalButtonText: { color: '#fff', fontWeight: '600' },
});