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
            <TouchableOpacity onPress={() => item.url && setSelectedArticleUrl(item.url)}>
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
        <View style={styles.header}>
  <Text style={styles.headerTitle}>📰 Articles - EPF Projets</Text>
</View>
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 20 },
  scrollContainer: { paddingHorizontal: 16 },
  verticalListContainer: { paddingHorizontal: 0 },
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
  articleBubbleVertical: { width: '95%', marginHorizontal: 'auto' },
  titre: { fontWeight: 'bold', fontSize: 16, marginBottom: 8 },
  image: { width: '100%', height: 200, borderRadius: 10, marginBottom: 8 },
  sectionTitleContainer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginVertical: 10 },
  sectionTitle: { fontWeight: 'bold', fontSize: 20, marginRight: 10 },
  titleLine: { flex: 1, height: 2, backgroundColor: '#000' },
  filterContainer: { paddingHorizontal: 16, marginBottom: 10 },
  filterButton: { paddingVertical: 8, paddingHorizontal: 16, backgroundColor: '#e0e0e0', borderRadius: 20, marginRight: 10 },
  selectedFilter: { backgroundColor: '#376787' },
  filterText: { fontSize: 14, color: '#333' },
  selectedFilterText: { color: 'white', fontWeight: 'bold' },
  closeButtonBottom: {
    position: 'absolute', bottom: 30, alignSelf: 'center', backgroundColor: '#376787', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 30,
  },
  modalClose: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  addButton: {
    backgroundColor: '#376787',
    paddingVertical: 12,
    marginHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  selectedFilter: { backgroundColor: '#376787' },
  filterText: { fontSize: 14, color: '#333' },
  selectedFilterText: { color: 'white', fontWeight: 'bold' },
  closeButtonBottom: {
    position: 'absolute', bottom: 30, alignSelf: 'center', backgroundColor: '#376787', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 30,
  },
  modalClose: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  addButton: {
    backgroundColor: '#008000',
    paddingVertical: 12,
    marginHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  input: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  imagePicker: {
    backgroundColor: '#376787',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#d9534f',
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  deleteText: { color: 'white', fontWeight: 'bold' },
  header: {
  alignItems: 'center',
  marginVertical: 20,
},
headerTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#2A2A2A',
},
});