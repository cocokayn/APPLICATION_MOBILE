import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HistoriqueScreen() {
  const navigation = useNavigation();

  const stats = {
    etudes: 5,
    jeh: 8,
    badges: ['UX', 'Firebase', 'React'],
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>← Retour</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Historique</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Études réalisées :</Text>
        <Text>{stats.etudes}</Text>

        <Text style={styles.label}>Nombre total de JEH :</Text>
        <Text>{stats.jeh}</Text>

        <Text style={styles.label}>Badges obtenus :</Text>
        {stats.badges.map((badge, i) => (
          <Text key={i}>🏅 {badge}</Text>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  backButton: { marginBottom: 10 },
  backText: { color: '#007bff', fontWeight: 'bold', fontSize: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  card: { backgroundColor: '#f0f0f0', padding: 20, borderRadius: 12 },
  label: { fontWeight: 'bold', marginTop: 10 },
});