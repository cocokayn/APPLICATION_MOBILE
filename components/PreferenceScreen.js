import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function PreferenceScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Bouton Retour en haut à gauche (position absolue) */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Retour</Text>
      </TouchableOpacity>

      {/* Titre bien espacé sous le bouton */}
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>Préférences</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('QuiSommesNous')}>
        <Text style={styles.buttonText}>Qui sommes nous ?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ConditionsUtil')}>
        <Text style={styles.buttonText}>Conditions générales d'utilisation</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Contact')}>
        <Text style={styles.buttonText}>Contact</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('MentionsLegales')}>
        <Text style={styles.buttonText}>Mentions légales</Text>
      </TouchableOpacity>
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
    paddingTop: height * 0.12, // espacement sous le bouton
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
  button: {
    backgroundColor: '#376787',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});