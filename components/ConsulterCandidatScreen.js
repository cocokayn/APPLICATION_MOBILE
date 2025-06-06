import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function ConsulterCandidatScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { candidat, etude } = route.params || {};

  const handleAccepter = () => {
    // Ici, tu pourras appeler une API pour accepter le candidat dans MySQL ou Firestore
    Alert.alert('Succès', `${candidat.nom} a été accepté pour l'étude !`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  if (!candidat || !etude) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.errorText}>Candidat ou étude non trouvé.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Profil de {candidat.prenom} {candidat.nom}</Text>

        <Text style={styles.label}>Email :</Text>
        <Text style={styles.value}>{candidat.email}</Text>

        <Text style={styles.label}>GitHub :</Text>
        <Text style={styles.value}>{candidat.github || 'Non fourni'}</Text>

        <Text style={styles.label}>Portfolio :</Text>
        <Text style={styles.value}>{candidat.portfolio || 'Non fourni'}</Text>

        <TouchableOpacity style={styles.button} onPress={handleAccepter}>
          <Text style={styles.buttonText}>Accepter sa candidature</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.link} onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>Retour</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  label: { fontWeight: 'bold', marginTop: 15 },
  value: { fontSize: 16, marginTop: 5 },
  button: {
    backgroundColor: '#376787',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  link: { marginTop: 20 },
  linkText: { color: '#007bff', textAlign: 'center' },
  errorText: { marginTop: 50, textAlign: 'center', color: 'red' },
});