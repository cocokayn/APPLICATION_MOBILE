import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

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

      {/* Titre espacé */}
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>Contact</Text>
      </View>

      <View style={styles.contactItem}>
        <Text style={styles.label}>Email :</Text>
        <TouchableOpacity onPress={handleEmailPress}>
          <Text style={styles.link}>iris.berthelot@epfprojets.com</Text>
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
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: height * 0.06,
    left: '5%',
    padding: 8,
    zIndex: 10,
  },
  backButtonText: {
    fontSize: width * 0.045,
    color: '#376787',
    fontWeight: 'bold',
  },
  titleWrapper: {
    paddingTop: height * 0.12,
    paddingHorizontal: '5%',
    alignItems: 'center',
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  contactItem: {
    marginBottom: 20,
    paddingHorizontal: '5%',
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