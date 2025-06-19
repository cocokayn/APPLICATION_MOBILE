import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../utils/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, collectionGroup, getDocs, doc, getDoc } from 'firebase/firestore';

const { width, height } = Dimensions.get('window');

export default function HistoriqueScreen() {
  const navigation = useNavigation();

  const [userId, setUserId] = useState(null);
  const [etudes, setEtudes] = useState([]);
  const [evenements, setEvenements] = useState([]);
  const [totalJeh, setTotalJeh] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (userId) {
      fetchHistorique();
    }
  }, [userId]);

  const fetchHistorique = async () => {
    try {
      const etudesSnapshot = await getDocs(collectionGroup(db, 'candidats'));
      const etudesResult = [];

      for (const docSnap of etudesSnapshot.docs) {
        const data = docSnap.data();
        if (data.id === userId && docSnap.ref.path.includes('etudes')) {
          const etudeId = docSnap.ref.parent.parent.id;
          const etudeDoc = await getDoc(doc(db, 'etudes', etudeId));
          if (etudeDoc.exists()) {
            etudesResult.push({ id: etudeId, ...etudeDoc.data() });
          }
        }
      }

      const totalJehValue = etudesResult.reduce((sum, etude) => sum + (parseFloat(etude.jeh) || 0), 0);

      const eventsSnapshot = await getDocs(collection(db, 'evenements'));
      const evenementsResult = [];

      for (const eventDoc of eventsSnapshot.docs) {
        const inscriptionsRef = collection(db, 'evenements', eventDoc.id, 'inscriptions');
        const inscriptionsSnapshot = await getDocs(inscriptionsRef);

        for (const inscDoc of inscriptionsSnapshot.docs) {
          const inscription = inscDoc.data();
          if (inscription.userId === userId) {
            evenementsResult.push({ id: eventDoc.id, ...eventDoc.data() });
            break;
          }
        }
      }

      setEtudes(etudesResult);
      setEvenements(evenementsResult);
      setTotalJeh(totalJehValue);
    } catch (error) {
      console.error('Erreur de chargement de l’historique :', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>← Retour</Text>
      </TouchableOpacity>

      <View style={styles.titleWrapper}>
        <Text style={styles.title}>Historique</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.label}>Nombre d'études réalisées :</Text>
          <Text style={styles.value}>{etudes.length}</Text>

          <Text style={styles.label}>Total de JEH :</Text>
          <Text style={styles.value}>{totalJeh}</Text>

          <Text style={styles.label}>Nombre d'événements :</Text>
          <Text style={styles.value}>{evenements.length}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>📘 Études :</Text>
          {etudes.map((etude) => (
            <View key={etude.id} style={styles.item}>
              <Text style={styles.itemTitle}>{etude.titre}</Text>
              <Text style={styles.itemDetail}>Domaine : {etude.domaine}</Text>
              <Text style={styles.itemDetail}>Durée : {etude.duree}</Text>
              <Text style={styles.itemDetail}>JEH : {etude.jeh}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🎟️ Événements :</Text>
          {evenements.map((event) => (
            <View key={event.id} style={styles.item}>
              <Text style={styles.itemTitle}>{event.nom}</Text>
              <Text style={styles.itemDetail}>Lieu : {event.lieu}</Text>
              <Text style={styles.itemDetail}>
                Date : {event.date?.toDate?.().toLocaleString?.() || 'Date inconnue'}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
    paddingTop: height * 0.12,
    paddingBottom: height * 0.015,
    paddingHorizontal: '5%',
    alignItems: 'center',
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: height * 0.03,
  },
  scrollContent: {
    paddingHorizontal: '5%',
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
    fontSize: width * 0.045,
  },
  value: {
    fontSize: width * 0.042,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  item: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemTitle: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  itemDetail: {
    fontSize: width * 0.04,
    color: '#555',
  },
});
