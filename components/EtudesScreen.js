import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function EtudesScreen() {
  const navigation = useNavigation();
  const [studies, setStudies] = useState([]);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedStudies, setSelectedStudies] = useState([]);

  useEffect(() => {
    const mockData = [
      {
        id: '1',
        domaine: 'IT & Digital',
        duree: '1j',
        titre: 'Site Internet pour Orange',
        deadline: '2025-08-01',
        description: 'Créer un site vitrine pour Orange.',
        competences: 'HTML, CSS, UX',
        jeh: 8,
      },
      {
        id: '2',
        domaine: 'Ingénierie & RSE',
        duree: '3j',
        titre: 'Bilan carbone pour la mairie de Buc',
        deadline: '2025-07-15',
        description: 'Établir un diagnostic environnemental.',
        competences: 'Excel, Analyse environnementale',
        jeh: 12,
      },
    ];
    setStudies(mockData);
  }, []);

  const toggleStudySelection = (id) => {
    setSelectedStudies((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedStudies.length === 0) return;
    const remaining = studies.filter((etude) => !selectedStudies.includes(etude.id));
    setStudies(remaining);
    setSelectedStudies([]);
    setDeleteMode(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>EPF Projets</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>Études disponibles</Text>

        {/* Boutons globaux */}
        <View style={styles.adminButtons}>
          {!deleteMode && (
            <TouchableOpacity
              style={[styles.adminButton, { backgroundColor: '#28a745' }]}
              onPress={() => navigation.navigate('AjouterEtude')}
            >
              <Text style={styles.adminButtonText}>Ajouter une étude</Text>
            </TouchableOpacity>
          )}

          {!deleteMode ? (
            <TouchableOpacity
              style={[styles.adminButton, { backgroundColor: '#d9534f' }]}
              onPress={() => setDeleteMode(true)}
            >
              <Text style={styles.adminButtonText}>Supprimer une étude</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.adminButton, { backgroundColor: '#6c757d' }]}
                onPress={handleDeleteSelected}
              >
                <Text style={styles.adminButtonText}>Confirmer suppression</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.adminButton, { backgroundColor: '#aaa' }]}
                onPress={() => {
                  setDeleteMode(false);
                  setSelectedStudies([]);
                }}
              >
                <Text style={styles.adminButtonText}>Annuler</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {studies.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.leftIcon}>
              <Image source={require('../assets/snack-icon.png')} style={styles.icon} />
            </View>

            <View style={styles.content}>
              <Text style={styles.category}>
                {item.domaine} • {item.duree}
              </Text>
              <Text style={styles.title}>{item.titre}</Text>
              {item.deadline && (
                <Text style={styles.deadline}>Date limite : {item.deadline}</Text>
              )}
            </View>

            {deleteMode ? (
              <TouchableOpacity
                style={styles.checkboxCircle}
                onPress={() => toggleStudySelection(item.id)}
              >
                <View
                  style={
                    selectedStudies.includes(item.id)
                      ? styles.checkboxSelected
                      : styles.checkbox
                  }
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('EtudesDetail', { study: item })}
              >
                <Text style={styles.buttonText}>Voir plus</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>

      {deleteMode ? (
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.redButton} onPress={handleDeleteSelected}>
            <Text style={styles.redButtonText}>Confirmer suppression</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.redButton, { backgroundColor: '#aaa' }]}
            onPress={() => {
              setDeleteMode(false);
              setSelectedStudies([]);
            }}
          >
            <Text style={styles.redButtonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.greenButton}
            onPress={() => navigation.navigate('AjouterEtude')}
          >
            <Text style={styles.redButtonText}>Ajouter une étude</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.redButton} onPress={() => setDeleteMode(true)}>
            <Text style={styles.redButtonText}>Supprimer une étude</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#376787' },
  container: { padding: 20, paddingBottom: 120 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2A2A2A',
    marginBottom: 15,
    alignSelf: 'center',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  leftIcon: { marginRight: 12, marginTop: 5 },
  icon: { width: 30, height: 30, resizeMode: 'contain' },
  content: { flex: 1 },
  category: {
    fontSize: 14,
    fontWeight: '600',
    color: '#376787',
    marginBottom: 3,
  },
  title: { fontSize: 15, fontWeight: '500', color: '#000' },
  deadline: { fontSize: 13, color: '#888', marginTop: 4 },
  button: {
    backgroundColor: '#376787',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  checkboxCircle: {
    alignSelf: 'center',
    marginLeft: 10,
    marginTop: 5,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#999',
  },
  checkboxSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#376787',
    borderWidth: 2,
    borderColor: '#376787',
  },

  actionButtons: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
    gap: 12,
  },
  redButton: {
    backgroundColor: '#e53935',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  greenButton: {
    backgroundColor: '#008000',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  redButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
