import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // plus utile

// Import de ton SwipeTabs personnalisé
import SwipeTabs from './components/SwipeTabs';

// Import des autres composants
import LoginScreen from './components/LoginScreen';
import Pagegarde from './components/Pagegarde';
import NewsList from './components/Newslist';
import NewsDetail from './components/NewsDetail';
import Profilscreen from './components/Profilscreen';
import CreerCompte from './components/CreerCompte';
import EtudesScreen from './components/EtudesScreen';
import EtudesDetailScreen from './components/EtudesDetailScreen';
import EvenementsScreen from './components/EvenementsScreen';
import InfosPersoScreen from './components/InfosPersoScreen';
import HistoriqueScreen from './components/HistoriqueScreen';
import PreferenceScreen from './components/PreferenceScreen'; 
import ConditionsUtilScreen from './components/ConditionsutilScreen';
import QuiSommesNousScreen from './components/QuiSommesNousScreen';
import ContactScreen from './components/ContactScreen';
import MentionsLegalesScreen from './components/MentionsLegalesScreen';
import ModifEvenementScreen from './components/ModifEvenementScreen';
import CreationEventScreen from './components/CreationEventScreen';
import AjouterEtudeScreen from './components/AjouterEtudeScreen';
import ModifierEtudeScreen from './components/ModifierEtudeScreen';
import ConsulterCandidatScreen from './components/ConsulterCandidatScreen';

const Stack = createNativeStackNavigator();

// Garder HomeScreen si besoin pour la page Articles + Pagegarde (optionnel)
function HomeScreen({ navigation }) {
  return (
    <>
      <Pagegarde />
      <NewsList navigation={navigation} />
    </>
  );
}

// MainTabs est remplacé par SwipeTabs, on n’a plus besoin de createBottomTabNavigator

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="CreerCompte" component={CreerCompte} />

        {/* Ici, on utilise SwipeTabs pour la navigation principale avec swipe + onglets */}
        <Stack.Screen name="Main" component={SwipeTabs} />

        {/* Autres écrans du stack */}
        <Stack.Screen name="EvenementsScreen" component={EvenementsScreen} />
        <Stack.Screen name="Détail Article" component={NewsDetail} />
        <Stack.Screen name="Preferences" component={PreferenceScreen} options={{ title: 'Préférences' }} />
        <Stack.Screen name="QuiSommesNous" component={QuiSommesNousScreen} />
        <Stack.Screen name="EtudesDetail" component={EtudesDetailScreen} />
        <Stack.Screen name="InfosPerso" component={InfosPersoScreen} options={{ title: 'Infos personnelles' }} />
        <Stack.Screen name="Historique" component={HistoriqueScreen} options={{ title: 'Historique' }} />
        <Stack.Screen name="ConditionsUtil" component={ConditionsUtilScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Contact" component={ContactScreen} />
        <Stack.Screen name="MentionsLegales" component={MentionsLegalesScreen} />
        <Stack.Screen name="ModifEvenement" component={ModifEvenementScreen} />
        <Stack.Screen name="CreationEvent" component={CreationEventScreen} />
        <Stack.Screen name="AjouterEtude" component={AjouterEtudeScreen} />
        <Stack.Screen name="ModifierEtude" component={ModifierEtudeScreen} />
        <Stack.Screen name="ConsulterCandidatScreen" component={ConsulterCandidatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
