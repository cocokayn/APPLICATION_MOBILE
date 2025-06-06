import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Import des composants
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
import PreferenceScreen from './components/PreferenceScreen'; // en haut du fichier
import ConditionsUtilScreen from './components/ConditionsutilScreen';
import QuiSommesNousScreen from './components/QuiSommesNousScreen';
import ContactScreen from './components/ContactScreen';
import MentionsLegalesScreen from './components/MentionsLegalesScreen';
import ModifEvenementScreen from './components/ModifEvenementScreen';
import CreationEventScreen from './components/CreationEventScreen';
import AjouterEtudeScreen from './components/AjouterEtudeScreen';
import ModifierEtudeScreen from './components/ModifierEtudeScreen';
import SupprimerEtude from './components/SupprimerEtude';
import ConsulterCandidatScreen from './components/ConsulterCandidatScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Écran combiné : Page d’accueil + liste articles
function HomeScreen() {
  return (
    <>
      <Pagegarde />
      <NewsList />
    </>
  );
}

// Barre de navigation du bas
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Etudes') iconName = 'school-outline';
          else if (route.name === 'Evénements') iconName = 'calendar-outline';
          else if (route.name === 'Articles') iconName = 'newspaper-outline';
          else if (route.name === 'Profil') iconName = 'person-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#376787',     // 🔵 Bleu personnalisé
        tabBarInactiveTintColor: '#b0b0b0',   // 🔘 Gris clair
      })}
    >
      <Tab.Screen name="Etudes" component={EtudesScreen} />
      <Tab.Screen name="Evénements" component={EvenementsScreen} />
      <Tab.Screen name="Articles" component={HomeScreen} />
      <Tab.Screen name="Profil" component={Profilscreen} />
    </Tab.Navigator>
  );
}

// App principale avec stack
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="CreerCompte" component={CreerCompte} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Détail Article" component={NewsDetail} />
        <Stack.Screen name="Preferences" component={PreferenceScreen} options={{ title: 'Préférences' }} />
        <Stack.Screen name="QuiSommesNous" component={QuiSommesNousScreen} />
        <Stack.Screen
          name="EtudesDetail"
          component={EtudesDetailScreen}
          options={{ headerShown: true, title: 'Détail de l’étude' }}
        />
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
