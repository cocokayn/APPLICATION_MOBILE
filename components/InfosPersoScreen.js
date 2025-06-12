import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function InfosPersoScreen() {
  const navigation = useNavigation();

  const [infos, setInfos] = useState({
    nom: 'Berthon',
    prenom: 'Jean-Baptiste',
    email: 'jb@example.com',
    mdp: 'mdp123',
    github: 'https://github.com/jbberthon',
    portfolio: 'https://jbberthon.dev',
  });

  const handleChange = (field, value) => {
    setInfos((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>← Retour</Text>
      </TouchableOpacity>

      <View style={styles.titleWrapper}>
        <Text style={styles.title}>Infos personnelles</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Nom</Text>
        <TextInput
          style={styles.input}
          value={infos.nom}
          onChangeText={(text) => handleChange('nom', text)}
        />

        <Text style={styles.label}>Prénom</Text>
        <TextInput
          style={styles.input}
          value={infos.prenom}
          onChangeText={(text) => handleChange('prenom', text)}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={infos.email}
          onChangeText={(text) => handleChange('email', text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Mot de passe</Text>
        <TextInput
          style={styles.input}
          value={infos.mdp}
          onChangeText={(text) => handleChange('mdp', text)}
        />

        <Text style={styles.label}>GitHub</Text>
        <TextInput
          style={styles.input}
          value={infos.github}
          onChangeText={(text) => handleChange('github', text)}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Portfolio</Text>
        <TextInput
          style={styles.input}
          value={infos.portfolio}
          onChangeText={(text) => handleChange('portfolio', text)}
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Enregistrer les modifications</Text>
        </TouchableOpacity>
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
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginTop: 5,
    fontSize: width * 0.04,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#376787',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: width * 0.045,
  },
});