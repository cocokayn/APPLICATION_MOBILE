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
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

const categories = [
  { label: 'Tout', value: 'all' },
  { label: 'Technologie', value: 'technology' },
  { label: 'Finance', value: 'business' },
  { label: 'Environnement', value: 'health' },
  { label: 'Sciences', value: 'science' },
  { label: 'Sport', value: 'sport' },
  { label: 'Agriculture', value: 'general' },
  { label: 'JE', value: 'je' },
];

export default function NewsList() {
  const [articlesByCategory, setArticlesByCategory] = useState({
    JE: [
      {
        title: 'Article exemple 1',
        description: 'Description de l’article exemple 1.',
        url: 'https://example.com/article1',
        urlToImage: 'https://placehold.co/400x200',
      },
      {
        title: 'Article exemple 2',
        description: 'Description de l’article exemple 2.',
        url: 'https://example.com/article2',
        urlToImage: 'https://placehold.co/400x200',
      },
    ],
  });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArticleUrl, setSelectedArticleUrl] = useState(null);
  const [modalTextArticle, setModalTextArticle] = useState(null);
  const [isAdmin, setIsAdmin] = useState(true);

  const [modalAjoutVisible, setModalAjoutVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [addType, setAddType] = useState('text');

  useEffect(() => {
    loadJeArticles();

    categories.forEach(async (cat) => {
      if (cat.value !== 'all' && cat.value !== 'je') {
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

  const loadJeArticles = async () => {
    const saved = await AsyncStorage.getItem('jeArticles');
    const parsed = saved ? JSON.parse(saved) : [];
    if (parsed.length > 0) {
      setArticlesByCategory(prev => ({ ...prev, JE: parsed }));
    }
  };

  const saveJeArticles = async (newList) => {
    await AsyncStorage.setItem('jeArticles', JSON.stringify(newList));
    setArticlesByCategory(prev => ({ ...prev, JE: newList }));
  };

  const addArticle = () => {
    const newArticle = {
      title: newTitle,
      description: newDescription,
      url: newUrl || null,
      urlToImage: newImage,
    };
    const updated = [...(articlesByCategory.JE || []), newArticle];
    saveJeArticles(updated);
    setModalAjoutVisible(false);
    setNewTitle('');
    setNewDescription('');
    setNewUrl('');
    setNewImage(null);
  };

  const deleteArticle = (index) => {
    Alert.alert(
      'Confirmation',
      'Voulez-vous vraiment supprimer cet article ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            const updated = [...articlesByCategory.JE];
            updated.splice(index, 1);
            saveJeArticles(updated);
          },
        },
      ]
    );
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) setNewImage(result.assets[0].uri);
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}... Voir suite` : text;
  };

  const renderArticlesForCategory = (catLabel) => {
    const isAllCategory = selectedCategory === 'all';
    const data = articlesByCategory[catLabel] || [];

    return (
      <View key={catLabel}>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>{catLabel}</Text>
          <View style={styles.titleLine} />
        </View>

        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => {
                if (item.url) setSelectedArticleUrl(item.url);
                else setModalTextArticle(item);
              }}
            >
              <View style={[styles.articleBubble, !isAllCategory && styles.articleBubbleVertical]}>
                {item.urlToImage && <Image source={{ uri: item.urlToImage }} style={styles.image} />}
                <Text style={styles.titre}>{item.title}</Text>
                <Text>{truncateText(item.description)}</Text>
                {catLabel === 'JE' && (
                  <TouchableOpacity onPress={() => deleteArticle(index)} style={styles.deleteButton}>
                    <Text style={styles.deleteText}>Supprimer</Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          )}
          horizontal={isAllCategory}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={isAllCategory ? styles.scrollContainer : styles.verticalListContainer}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ScrollView horizontal contentContainerStyle={styles.filterContainer} showsHorizontalScrollIndicator={false}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.value}
              style={[styles.filterButton, selectedCategory === cat.value && styles.selectedFilter]}
              onPress={() => setSelectedCategory(cat.value)}
            >
              <Text style={[styles.filterText, selectedCategory === cat.value && styles.selectedFilterText]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {isAdmin && selectedCategory === 'je' && (
          <TouchableOpacity style={styles.addButton} onPress={() => setModalAjoutVisible(true)}>
            <Text style={styles.addButtonText}>+ Ajouter un article</Text>
          </TouchableOpacity>
        )}

        {selectedCategory === 'all'
          ? categories.filter(cat => cat.value !== 'all').map(cat => renderArticlesForCategory(cat.label === 'JE' ? 'JE' : cat.label))
          : renderArticlesForCategory(selectedCategory === 'je' ? 'JE' : categories.find(cat => cat.value === selectedCategory)?.label)}

        <Modal visible={!!selectedArticleUrl} animationType="slide">
          <View style={{ flex: 1 }}>
            {selectedArticleUrl && <WebView source={{ uri: selectedArticleUrl }} />}
            <TouchableOpacity onPress={() => setSelectedArticleUrl(null)} style={styles.closeButtonBottom}>
              <Text style={styles.modalClose}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Modal visible={modalAjoutVisible} animationType="slide">
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
              <TouchableOpacity
                style={[styles.filterButton, addType === 'text' && styles.selectedFilter]}
                onPress={() => setAddType('text')}
              >
                <Text style={[styles.filterText, addType === 'text' && styles.selectedFilterText]}>Texte</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterButton, addType === 'link' && styles.selectedFilter, { marginLeft: 10 }]}
                onPress={() => setAddType('link')}
              >
                <Text style={[styles.filterText, addType === 'link' && styles.selectedFilterText]}>Lien</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              placeholder="Titre"
              value={newTitle}
              onChangeText={setNewTitle}
              style={[styles.input, { marginBottom: 20 }]}
            />
            <TextInput
              placeholder="Description"
              value={newDescription}
              onChangeText={setNewDescription}
              style={[styles.input, { marginBottom: 20 }]}
            />
            {addType === 'link' && (
              <TextInput
                placeholder="Lien de l'article"
                value={newUrl}
                onChangeText={setNewUrl}
                style={[styles.input, { marginBottom: 20 }]}
              />
            )}

            <TouchableOpacity onPress={pickImage} style={[styles.imagePicker, { marginBottom: 20 }]}>
              <Text style={{ color: '#fff' }}>Choisir une image</Text>
            </TouchableOpacity>
            {newImage && (
              <Image
                source={{ uri: newImage }}
                style={{ width: '100%', height: 200, marginBottom: 20, borderRadius: 10 }}
              />
            )}

            <TouchableOpacity style={styles.addButton} onPress={addArticle}>
              <Text style={styles.addButtonText}>Ajouter</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalAjoutVisible(false)}
              style={[styles.closeButtonBottom, { marginTop: 20, position: 'relative', bottom: 0 }]}
            >
              <Text style={styles.modalClose}>Annuler</Text>
            </TouchableOpacity>
          </ScrollView>
        </Modal>

        {/* Modal texte pour article JE sans URL */}
        <Modal visible={!!modalTextArticle} animationType="slide" onRequestClose={() => setModalTextArticle(null)}>
          <ScrollView contentContainerStyle={{ padding: 20, flex: 1, backgroundColor: '#fff' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 24, marginBottom: 10 }}>{modalTextArticle?.title}</Text>
            {modalTextArticle?.urlToImage && (
              <Image
                source={{ uri: modalTextArticle.urlToImage }}
                style={{ width: '100%', height: 200, marginBottom: 10, borderRadius: 10 }}
              />
            )}
            <Text style={{ fontSize: 16 }}>{modalTextArticle?.description}</Text>
            <TouchableOpacity
              onPress={() => setModalTextArticle(null)}
              style={[styles.closeButtonBottom, { position: 'relative', bottom: 0, marginTop: 20 }]}
            >
              <Text style={styles.modalClose}>Fermer</Text>
            </TouchableOpacity>
          </ScrollView>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  scrollContent: { paddingBottom: 20 },
  scrollContainer: { paddingHorizontal: 16 },
  verticalListContainer: { paddingHorizontal: 0 },
  articleBubble: {
    width: width * 0.8,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  articleBubbleVertical: {
    width: '100%',
    marginHorizontal: 0,
  },
  image: { width: '100%', height: 150, borderRadius: 20, marginBottom: 10 },
  titre: { fontWeight: 'bold', fontSize: 18, marginBottom: 6, color: '#222' },
  sectionTitleContainer: { marginVertical: 10, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', color: '#444' },
  titleLine: {
    width: 50,
    height: 4,
    backgroundColor: '#376787',
    marginTop: 6,
    borderRadius: 3,
  },
  filterContainer: { paddingVertical: 10, paddingHorizontal: 16, flexDirection: 'row' },
  filterButton: {
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginRight: 10,
  },
  selectedFilter: {
    backgroundColor: '#376787',
    borderColor: '#376787',
  },
  filterText: { color: '#555' },
  selectedFilterText: { color: '#fff' },
  closeButtonBottom: {
    backgroundColor: '#376787',
    padding: 15,
    marginHorizontal: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  modalClose: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  addButton: {
    backgroundColor: '#376787',
    borderRadius: 30,
    marginHorizontal: 16,
    marginBottom: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  imagePicker: {
    backgroundColor: '#007AFF',
    borderRadius: 15,
    padding: 12,
    alignItems: 'center',
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#ff3b30',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  deleteText: { color: 'white', fontWeight: 'bold' },
});
