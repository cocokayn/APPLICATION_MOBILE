// components/MentionsLegalesScreen.js
import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function MentionsLegalesScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Retour</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Mentions légales</Text>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.text}>
          Éditeur de l’application :
          {'\n'}EPF Projets – Junior-Entreprise de l’EPF
          {'\n'}55 avenue du Président Wilson, 94230 Cachan, France
          {'\n'}Email : info@epfprojets.com
          {'\n\n'}
          Hébergement :
          {'\n'}Firebase – Google LLC
          {'\n'}1600 Amphitheatre Parkway, Mountain View, CA 94043, USA
          {'\n\n'}
          Propriété intellectuelle :
          {'\n'}L’ensemble des contenus (textes, images, logos, icônes, interface) présents sur cette application sont la propriété exclusive de EPF Projets, sauf mention contraire. Toute reproduction ou utilisation sans autorisation est strictement interdite.
          {'\n\n'}
          Données personnelles :
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
});
