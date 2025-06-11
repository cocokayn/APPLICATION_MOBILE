import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function MentionsLegalesScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Bouton retour */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Retour</Text>
      </TouchableOpacity>

      {/* Titre avec espacement */}
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>Mentions légales</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.text}>
          <Text style={styles.sectionTitle}>Éditeur de l’application :</Text>
          {'\n'}EPF Projets – Junior-Entreprise de l’EPF
          {'\n'}55 avenue du Président Wilson, 94230 Cachan, France
          {'\n'}Email : info@epfprojets.com
          {'\n\n'}

          <Text style={styles.sectionTitle}>Hébergement :</Text>
          {'\n'}Firebase – Google LLC
          {'\n'}1600 Amphitheatre Parkway, Mountain View, CA 94043, USA
          {'\n\n'}

          <Text style={styles.sectionTitle}>Propriété intellectuelle :</Text>
          {'\n'}L’ensemble des contenus (textes, images, logos, icônes, interface) présents sur cette application sont la propriété exclusive de EPF Projets, sauf mention contraire. Toute reproduction ou utilisation sans autorisation est strictement interdite.
          {'\n\n'}

          <Text style={styles.sectionTitle}>Données personnelles :</Text>
          {'\n'}Les données collectées via l’application sont utilisées uniquement à des fins de gestion de projets et de communication interne. Conformément au RGPD, vous disposez d’un droit d’accès, de rectification ou de suppression des données vous concernant.
          {'\n\n'}

          Pour toute question ou réclamation, vous pouvez nous contacter à : info@epfprojets.com
        </Text>
      </ScrollView>
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
    marginBottom: 20,
  },
  scrollContent: {
    paddingHorizontal: '5%',
    paddingBottom: 30,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
