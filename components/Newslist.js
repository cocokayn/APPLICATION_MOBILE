import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ScrollView,
  Modal
} from 'react-native';
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');

const categories = [
  { label: 'Tout', value: 'all' },
  { label: 'Technologie', value: 'technology' },
  { label: 'Finance', value: 'business' },
  { label: 'Environnement', value: 'health' },
  { label: 'Sciences', value: 'science' },
  { label: 'Sport', value: 'sport' },
  { label: 'Agriculture', value: 'general' },
];

export default function NewsList() {
  const [articlesByCategory, setArticlesByCategory] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArticleUrl, setSelectedArticleUrl] = useState(null);

  useEffect(() => {
    categories.forEach(async (cat) => {
      if (cat.value !== 'all') {
        try {
          const response = await fetch(
            `https://newsapi.org/v2/top-headlines?country=us&category=${cat.value}&apiKey=c9c1ec38c3304a588537249cdcd797ce`
          );
          const data = await response.json();
          setArticlesByCategory(prev => ({ ...prev, [cat.label]: data.articles }));
        } catch (error) {
          console.error(`Erreur de fetch pour ${cat.label} :`, error);
        }
      }
    });
  }, []);

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}... Voir suite` : text;
  };

  const renderArticlesForCategory = (catLabel) => {
    const isAllCategory = selectedCategory === 'all';

    return (
      <View key={catLabel}>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>{catLabel}</Text>
          <View style={styles.titleLine} />
        </View>

        <FlatList
          data={articlesByCategory[catLabel] || []}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setSelectedArticleUrl(item.url)}>
              <View
                style={[
                  styles.articleBubble,
                  !isAllCategory && styles.articleBubbleVertical,
                ]}
              >
                {item.urlToImage && (
                  <Image source={{ uri: item.urlToImage }} style={styles.image} />
                )}
                <Text style={styles.titre}>{item.title}</Text>
                <Text>{truncateText(item.description)}</Text>
              </View>
            </TouchableOpacity>
          )}
          horizontal={isAllCategory}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={
            isAllCategory ? styles.scrollContainer : styles.verticalListContainer
          }
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Barre de recherche */}
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Rechercher articles"
            style={styles.searchInput}
          />
          <Image source={require('../assets/para2.png')} style={styles.searchIcon} />
        </View>

        {/* Filtres */}
        <ScrollView horizontal contentContainerStyle={styles.filterContainer} showsHorizontalScrollIndicator={false}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.value}
              style={[
                styles.filterButton,
                selectedCategory === cat.value && styles.selectedFilter
              ]}
              onPress={() => setSelectedCategory(cat.value)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedCategory === cat.value && styles.selectedFilterText
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Articles */}
        {selectedCategory === 'all'
          ? categories
              .filter(cat => cat.value !== 'all')
              .map(cat => renderArticlesForCategory(cat.label))
          : renderArticlesForCategory(
              categories.find(cat => cat.value === selectedCategory)?.label
            )}

        {/* Modal WebView */}
        <Modal visible={!!selectedArticleUrl} animationType="slide">
          <View style={{ flex: 1 }}>
            {selectedArticleUrl && (
              <WebView source={{ uri: selectedArticleUrl }} />
            )}
            <TouchableOpacity
              onPress={() => setSelectedArticleUrl(null)}
              style={styles.closeButtonBottom}
            >
              <Text style={styles.modalClose}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 20 },
  scrollContainer: {
    paddingHorizontal: 16,
  },
  verticalListContainer: {
    paddingHorizontal: 0, // tu peux ajuster si besoin
  },
  articleBubble: {
    width: width * 0.8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  articleBubbleVertical: {
    width: '95%',       // pleine largeur en vertical avec un peu de marge
    marginHorizontal: 'auto',  // centré horizontalement
  },
  titre: { fontWeight: 'bold', fontSize: 16, marginBottom: 8 },
  image: { width: '100%', height: 200, borderRadius: 10, marginBottom: 8 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 30,
    paddingHorizontal: 20,
    margin: 16,
    height: 70,
  },
  searchInput: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
  },
  searchIcon: {
    width: 28,
    height: 28,
    marginLeft: 10,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 10,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginRight: 10,
  },
  titleLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#000',
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    marginRight: 10,
  },
  selectedFilter: {
    backgroundColor: '#493d8a',
  },
  filterText: {
    fontSize: 14,
    color: '#333',
  },
  selectedFilterText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButtonBottom: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#493d8a',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
  },
  modalClose: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
