// components/ConditionsUtilScreen.js
import React from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function ConditionsutilScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Bouton retour */}
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Retour</Text>
      </Pressable>

      {/* Titre (séparé du bouton) */}
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>Conditions Générales d'Utilisation</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>1. Objet</Text>
        <Text style={styles.paragraph}>
          Les présentes Conditions Générales d’Utilisation (ci-après « CGU ») ont pour objet de définir les modalités
          d’accès et d’utilisation de l’application mobile JE’Connect (ci-après « l’Application »), éditée par EPF Projets.
          L’Application a pour finalité de faciliter la relation entre les intervenants (étudiants ou candidats) et la
          Junior-Entreprise EPF Projets, en centralisant la gestion des études et des événements.
        </Text>

        <Text style={styles.sectionTitle}>2. Acceptation des CGU</Text>
        <Text style={styles.paragraph}>
          L’utilisation de l’Application implique l’acceptation pleine et entière des présentes CGU. Si vous n’acceptez pas
          tout ou partie des présentes CGU, vous devez cesser immédiatement l’utilisation de l’Application.
        </Text>

        <Text style={styles.sectionTitle}>3. Accès à l’Application</Text>
        <Text style={styles.paragraph}>
          L’Application est accessible gratuitement aux utilisateurs disposant d’un appareil mobile compatible et d’un accès
          à Internet. Certaines fonctionnalités sont réservées aux administrateurs disposant d’un compte validé par EPF
          Projets (adresse e-mail professionnelle et présence dans la base de données interne).
        </Text>

        <Text style={styles.sectionTitle}>4. Comptes utilisateurs</Text>
        <Text style={styles.paragraph}>
          Chaque utilisateur doit créer un compte personnel pour accéder aux services proposés. La création de compte
          nécessite uniquement les données essentielles à la gestion des études et postulations (nom, prénom, adresse
          e-mail, profil de base).
        </Text>

        <Text style={styles.sectionTitle}>5. Fonctionnalités de l’Application</Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Utilisateurs standards :</Text> consultation des études disponibles, postulation à une étude,
          mise à jour du profil.{"\n"}
          <Text style={styles.bold}>Administrateurs :</Text> ajout, modification ou suppression d’études et d’événements,
          marquage d’une étude comme "complète", consultation des candidatures et sélection des candidats.
        </Text>

        <Text style={styles.sectionTitle}>6. Obligations des utilisateurs</Text>
        <Text style={styles.paragraph}>
          L’utilisateur s’engage à :
          {"\n"}• Utiliser l’Application de façon légale, loyale et appropriée ;
          {"\n"}• Ne pas compromettre la sécurité ou la stabilité de l’Application ;
          {"\n"}• Fournir des informations exactes lors de la création de son compte ;
          {"\n"}• Respecter la confidentialité des informations accessibles via l’Application.
        </Text>

        <Text style={styles.sectionTitle}>7. Données personnelles</Text>
        <Text style={styles.paragraph}>
          L’Application collecte uniquement les données strictement nécessaires au bon fonctionnement du service.
          {"\n"}Les données sont :
          {"\n"}• Conservées de manière sécurisée ;
          {"\n"}• Utilisées uniquement par EPF Projets ;
          {"\n"}• Non partagées à des tiers sans consentement.
          {"\n"}Conformément au RGPD, chaque utilisateur dispose d’un droit d’accès, de rectification, de suppression ou
          d’opposition à ses données personnelles. Pour exercer ces droits, contactez : info@epfprojets.com.
        </Text>

        <Text style={styles.sectionTitle}>8. Propriété intellectuelle</Text>
        <Text style={styles.paragraph}>
          L’ensemble du contenu de l’Application (interface, code, logo, textes, éléments graphiques) est la propriété
          exclusive de EPF Projets. Toute reproduction ou exploitation sans autorisation est interdite.
        </Text>

        <Text style={styles.sectionTitle}>9. Responsabilité</Text>
        <Text style={styles.paragraph}>
          EPF Projets s’efforce de maintenir l’Application accessible et fonctionnelle, mais ne peut être tenu responsable
          en cas d’interruption, d’erreurs ou de perte de données, sauf en cas de faute grave avérée.
        </Text>

        <Text style={styles.sectionTitle}>10. Modifications des CGU</Text>
        <Text style={styles.paragraph}>
          EPF Projets se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés via
          l’Application. L’utilisation continue après modification vaut acceptation.
        </Text>

        <Text style={styles.sectionTitle}>11. Droit applicable</Text>
        <Text style={styles.paragraph}>
          Les présentes CGU sont régies par le droit français. En cas de litige, les tribunaux compétents seront ceux du
          ressort du siège social de EPF Projets.
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
    paddingTop: height * 0.12, // espace en dessous du bouton
    paddingBottom: height * 0.015,
    paddingHorizontal: '5%',
    alignItems: 'center',
  },
  title: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: '5%',
    paddingBottom: height * 0.05,
  },
  sectionTitle: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    marginTop: height * 0.02,
    marginBottom: height * 0.01,
  },
  paragraph: {
    fontSize: width * 0.04,
    lineHeight: height * 0.03,
    marginBottom: height * 0.015,
  },
  bold: {
    fontWeight: 'bold',
  },
});