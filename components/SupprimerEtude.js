import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SupprimerEtudeScreen() {
  const navigation = useNavigation();
  const [etudes, setEtudes] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    // Remplacer ceci par une vraie requête fetch pour récupérer les études
    setEtudes([
      { id: '1', titre: 'Site Internet pour Orange' },
      { id: '2', titre: 'Bilan carbone pour Buc' },
    ]);
  }, []);

  const toggleSelect = (id) => {
    setSelectedIds((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) {
      Alert.alert('Aucune sélection', 'Sélectionnez au moins une étude à supprimer.');
      return;
    }

    Alert.alert(
      'Confirmer la suppression',
      `Supprimer ${selectedIds.length} étude(s) ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            // TODO: appel API pour supprimer sur le serveur
            setEtudes((prev) => prev.filter((etude) => !selectedIds.includes(etude.id)));
            setSelectedIds([]);
            Alert.alert('Succès', 'Étude(s) supprimée(s)');
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedIds.includes(item.id);
    return (
      <TouchableOpacity
        style={[styles.itemContainer, isSelected && styles.selectedItem]}
        onPress={() => toggleSelect(item.id)}
      >
        <Text style={styles.itemText}>{item.titre}</Text>
        <View style={styles.badge}>
          {isSelected && <View style={styles.badgeInner} />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Supprimer une étude</Text>

      <FlatList
        data={etudes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteSelected}>
        <Text style={styles.deleteButtonText}>Supprimer la sélection</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
  },
  selectedItem: {
    backgroundColor: '#e6f0f8',
  },
  itemText: {
    fontSize: 16,
    flex: 1,
  },
  badge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#376787',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  badgeInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#376787',
  },
  deleteButton: {
    backgroundColor: '#d9534f',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
