// components/ContactScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ContactScreen() {
  const navigation = useNavigation();

  const handleEmailPress = () => {
    Linking.openURL('mailto:info@epfprojets.com');
  };

  return (
    <View style={styles.container}>
      {/* Bouton retour */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Retour</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Contact</Text>

      <View style={styles.contactItem}>
        <Text style={styles.label}>Email :</Text>
        <TouchableOpacity onPress={handleEmailPress}>
          <Text style={styles.link}>president@epfprojets.com</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contactItem}>
        <Text style={styles.label}>Responsable :</Text>
        <Text style={styles.value}>Iris Berthelot</Text>
      </View>

      <View style={styles.contactItem}>
        <Text style={styles.label}>Salle :</Text>
        <Text style={styles.value}>Bureau P111 - Campus EPF Cachan</Text>
      </View>
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
  contactItem: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    marginTop: 5,
  },
  link: {
    fontSize: 16,
    color: '#007bff',
    marginTop: 5,
  },
});
