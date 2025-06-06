import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';

const mockEtudes = [
  {
    id: '1',
    domaine: 'IT & Digital',
    duree: '1d',
    titre: 'Site Internet pour Orange',
    deadline: null,
  },
  {
    id: '2',
    domaine: 'IT & Digital',
    duree: '1d',
    titre: 'Application pour Airbus',
    deadline: null,
  },
  {
    id: '3',
    domaine: 'IT & Digital',
    duree: '2d',
    titre: 'Site vitrine pour Boursobank',
    deadline: '31/07/2025',
  },
  {
    id: '4',
    domaine: 'Ingénierie & RSE',
    duree: '3d',
    titre: 'Bilan carbone de la mairie de Buc',
    deadline: null,
  },
  {
    id: '5',
    domaine: 'Traduction Technique',
    duree: '4d',
    titre: 'Traduction d’un rapport Airbus',
    deadline: null,
  },
  {
    id: '6',
    domaine: 'IT & Digital',
    duree: '5d',
    titre: 'Site Internet pour la mairie d’Orsay',
    deadline: null,
  },
];

export default function StudiesScreen() {
  const [etudes, setEtudes] = useState([]);

  useEffect(() => {
    setEtudes(mockEtudes);
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.left}>
        <Image source={require('../assets/snack-icon.png')} style={styles.icon} />
      </View>

      <View style={styles.middle}>
        <Text style={styles.domain}>{item.domaine} • {item.duree}</Text>
        <Text style={styles.title}>{item.titre}</Text>
        {item.deadline && (
          <Text style={styles.deadline}>Date limite : {item.deadline}</Text>
        )}
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Voir plus</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../assets/Logo_blog.png')} style={styles.logo} />
      <Text style={styles.pageTitle}>Etudes</Text>
      <FlatList
        data={etudes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  logo: {
    width: 150,
    height: 40,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 10,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#2A2A2A',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f4f4f4',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },
  left: {
    marginRight: 10,
    justifyContent: 'center',
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  middle: {
    flex: 1,
  },
  domain: {
    fontSize: 14,
    fontWeight: '600',
    color: '#004080',
    marginBottom: 3,
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000',
  },
  deadline: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#004080',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
});