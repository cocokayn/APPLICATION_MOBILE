import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function InfosPersoScreen() {
  const navigation = useNavigation();

  const [infos, setInfos] = useState({
    nom: 'JB Berthon',
    email: 'jb@example.com',
    github: 'https://github.com/jbberthon',
    portfolio: 'https://jbberthon.dev',
  });

  const handleChange = (field, value) => {
    setInfos((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>← Retour</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Infos personnelles</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nom</Text>
        <TextInput
          style={styles.input}
          value={infos.nom}
          onChangeText={(text) => handleChange('nom', text)}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={infos.email}
          onChangeText={(text) => handleChange('email', text)}
        />

        <Text style={styles.label}>GitHub</Text>
        <TextInput
          style={styles.input}
          value={infos.github}
          onChangeText={(text) => handleChange('github', text)}
        />

        <Text style={styles.label}>Portfolio</Text>
        <TextInput
          style={styles.input}
          value={infos.portfolio}
          onChangeText={(text) => handleChange('portfolio', text)}
        />

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Enregistrer les modifications</Text>
        </TouchableOpacity>
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
  input: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#004080',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: { color: '#fff', fontWeight: 'bold' },
});