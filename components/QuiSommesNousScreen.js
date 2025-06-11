import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width, height } = Dimensions.get('window');

export default function QuiSommesNousScreen() {
  const navigation = useNavigation();

  const openLink = (url) => {
    Linking.openURL(url).catch((err) => console.error("Erreur lors de l'ouverture du lien :", err));
  };

  return (
    <View style={styles.container}>
      {/* Bouton Retour positionné comme dans CGU/Préférences */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Retour</Text>
      </TouchableOpacity>

      {/* Titre bien espacé */}
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>Qui sommes nous ?</Text>
      </View>
      
      <View style={styles.separator} />

      {/* Site internet */}
      <Text style={styles.sectionTitle}>Notre site internet</Text>
      <TouchableOpacity onPress={() => openLink('https://www.epfprojets.com')}>
        <Image
          source={require('../assets/LOGOPRO.png')}
          style={styles.siteImage}
          resizeMode="cover"
        />
      </TouchableOpacity>

      {/* Réseaux sociaux */}
      <Text style={styles.sectionTitle}>Nos réseaux sociaux :</Text>
      <View style={styles.socialContainer}>
        <TouchableOpacity onPress={() => openLink('https://www.instagram.com/epf_projets/')} style={styles.iconRow}>
          <Icon name="instagram" size={30} color="#8a3ab9" />
          <Text style={styles.iconText}>Instagram</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => openLink('https://fr.linkedin.com/company/epf-projets')} style={styles.iconRow}>
          <Icon name="linkedin-square" size={30} color="#0e76a8" />
          <Text style={styles.iconText}>LinkedIn</Text>
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
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 10,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    marginHorizontal: 20,
  },
  siteImage: {
    width: '90%',
    height: 180,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 15,
  },
  socialContainer: {
    marginTop: 10,
    marginHorizontal: 20,
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
