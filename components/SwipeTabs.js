import * as React from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions, StyleSheet, SafeAreaView } from 'react-native';
import { TabView } from 'react-native-tab-view';
import { Ionicons } from '@expo/vector-icons';

// Tes écrans
import ArticlesScreen from './Newslist';
import EtudesScreen from './EtudesScreen';
import EvenementsScreen from './EvenementsScreen';
import ProfilScreen from './Profilscreen';

export default function SwipeTabs({ navigation }) {
  const layout = useWindowDimensions();

  // ordre changé ici : Etudes, Evenements, Articles, Profil
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'etudes', title: 'Études', icon: 'school-outline' },
    { key: 'evenements', title: 'Événements', icon: 'calendar-outline' },
    { key: 'articles', title: 'Articles', icon: 'newspaper-outline' },
    { key: 'profil', title: 'Profil', icon: 'person-outline' },
  ]);

  // renderScene avec props navigation passées aux écrans
  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'articles':
        return <ArticlesScreen navigation={navigation} />;
      case 'etudes':
        return <EtudesScreen navigation={navigation} />;
      case 'evenements':
        return <EvenementsScreen navigation={navigation} />;
      case 'profil':
        return <ProfilScreen navigation={navigation} />;
      default:
        return null;
    }
  };

  // barre d'onglets personnalisée en bas
  const renderTabBar = () => {
    return (
      <SafeAreaView style={styles.tabBarContainer}>
        <View style={styles.tabBar}>
          {routes.map((routeItem, i) => {
            const focused = i === index;
            return (
              <TouchableOpacity
                key={routeItem.key}
                onPress={() => setIndex(i)}
                style={styles.tabItem}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={routeItem.icon}
                  size={24}
                  color={focused ? '#376787' : '#b0b0b0'}
                />
                <Text style={[styles.tabTitle, focused && styles.tabTitleFocused]}>
                  {routeItem.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
    );
  };

  return (
    <>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        swipeEnabled
        renderTabBar={() => null} // on cache le tabView natif
      />
      {renderTabBar()}
    </>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    paddingBottom: 20, // un peu plus pour safe area iOS (zone en bas)
  },
  tabItem: {
    alignItems: 'center',
  },
  tabTitle: {
    fontSize: 12,
    color: '#b0b0b0',
    marginTop: 2,
  },
  tabTitleFocused: {
    color: '#376787',
    fontWeight: 'bold',
  },
});
