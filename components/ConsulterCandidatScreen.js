import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { firestore } from '../utils/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export default function ConsulterCandidatScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const candidat = route.params?.candidat;
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidatData = async () => {
      if (!candidat?.id) return;

      try {
        const userRef = doc(firestore, 'users', candidat.id);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserData(userSnap.data());
        } else {
          console.warn("Candidat non trouvé");
        }
      } catch (error) {
        console.error("Erreur lors du chargement du candidat :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidatData();
  }, [candidat]);

  if (!candidat) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Aucun candidat à afficher.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>← Retour</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Profil du Candidat</Text>

      <Text style={styles.label}>Nom complet :</Text>
      <Text style={styles.value}>{candidat.nom}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#376787" style={{ marginTop: 20 }} />
      ) : userData ? (
        <>
          <Text style={styles.label}>Email :</Text>
          <Text style={styles.value}>{userData.email || 'Non renseigné'}</Text>

          <Text style={styles.label}>Téléphone :</Text>
          <Text style={styles.value}>{userData.telephone || 'Non renseigné'}</Text>

          {/* Tu peux ajouter d'autres infos ici si nécessaire */}
        </>
      ) : (
        <Text style={styles.errorText}>Informations utilisateur introuvables.</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#376787' },
  label: { fontWeight: 'bold', marginTop: 15, fontSize: 16 },
  value: { fontSize: 16, marginTop: 5, color: '#333' },
  errorText: { color: 'red', fontSize: 16, marginTop: 20 },
  backButton: {
    marginBottom: 10,
  },
  backText: {
    fontSize: 16,
    color: '#376787',
    fontWeight: 'bold',
      marginTop: 20,
  marginBottom: 10,
  },
});
