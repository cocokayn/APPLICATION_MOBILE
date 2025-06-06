// components/QuiSommesNousScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function QuiSommesNousScreen() {
  const navigation = useNavigation();

  const openLink = (url) => {
    Linking.openURL(url).catch((err) => console.error("Erreur lors de l'ouverture du lien :", err));
  };

  return (
    <View style={styles.container}>
      {/* Retour */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Retour</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Qui sommes nous ?</Text>
      <View style={styles.separator} />

      {/* Site internet */}
      <Text style={styles.sectionTitle}>Notre site internet</Text>
      <TouchableOpacity onPress={() => openLink('https://www.epfprojets.com')}>
        <Image
          source={require('../assets/LOGOPRO.png')} // Assure-toi que l'image est placée correctement dans assets
          style={styles.siteImage}
          resizeMode="cover"
        />
      </TouchableOpacity>

      {/* Réseaux sociaux */}
      <Text style={styles.sectionTitle}>Nos réseaux sociaux:</Text>
      <View style={styles.socialContainer}>
        <TouchableOpacity onPress={() => openLink('https://www.instagram.com/epf_projets/')} style={styles.iconRow}>
          <Icon name="instagram" size={30} color="#8a3ab9" />
          <Text style={styles.iconText}>Instagram</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => openLink('https://fr.linkedin.com/company/epf-projets')} style={styles.iconRow}>
          <Icon name="linkedin-square" size={30} color="#0e76a8" />
          <Text style={styles.iconText}>Linkedin</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => openLink('https://www.facebook.com/epfprojetssceaux/?locale=fr_FR')} style={styles.iconRow}>
          <Icon name="facebook-square" size={30} color="#3b5998" />
          <Text style={styles.iconText}>Facebook</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007bff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  siteImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 15,
  },
  socialContainer: {
    marginTop: 10,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconText: {
    fontSize: 16,
    marginLeft: 10,
  },
});
