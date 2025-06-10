import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function HistoriqueScreen() {
  const navigation = useNavigation();

  const stats = {
    etudes: 5,
    jeh: 8,
    badges: ['UX', 'Firebase', 'React'],
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>← Retour</Text>
      </TouchableOpacity>

      <View style={styles.titleWrapper}>
        <Text style={styles.title}>Historique</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Études réalisées :</Text>
        <Text style={styles.value}>{stats.etudes}</Text>

        <Text style={styles.label}>Nombre total de JEH :</Text>
        <Text style={styles.value}>{stats.jeh}</Text>

        <Text style={styles.label}>Badges obtenus :</Text>
        {stats.badges.map((badge, i) => (
          <Text key={i} style={styles.value}>🏅 {badge}</Text>
        ))}
      </View>
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
  card: {
    backgroundColor: '#f0f0f0',
    marginHorizontal: '5%',
    borderRadius: 12,
    padding: 20,
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
});