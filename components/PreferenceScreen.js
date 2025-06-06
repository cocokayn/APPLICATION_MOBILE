// components/PreferenceScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function PreferenceScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Bouton Retour */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Retour</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Préférences</Text>

      <TouchableOpacity
  style={styles.button}
  onPress={() => navigation.navigate('QuiSommesNous')}>
  <Text style={styles.buttonText}>Qui sommes nous?</Text>
</TouchableOpacity>
<TouchableOpacity
  style={styles.button}
  onPress={() => navigation.navigate('ConditionsUtil')}>
  <Text style={styles.buttonText}>Conditions générales d'utilisation</Text>
</TouchableOpacity>
      <TouchableOpacity 
      style={styles.button} onPress={() => navigation.navigate('Contact')}>
  <Text style={styles.buttonText}>Contact</Text>
</TouchableOpacity>

<TouchableOpacity 
style={styles.button} onPress={() => navigation.navigate('MentionsLegales')}>
  <Text style={styles.buttonText}>Mentions légales</Text>
</TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    color: '#007bff',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#ADD8E6',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
