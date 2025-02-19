import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList, TabParamList } from '../types/navigation';
import { games } from '../data/games';
import { Search } from 'lucide-react-native';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Tienda'>,
  StackScreenProps<RootStackParamList, 'GameDetails'>
>;

const StoreScreen: React.FC<Props> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredGames = games.filter(game => 
    game.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Search size={20} color="#8f98a0" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar juegos..."
          placeholderTextColor="#8f98a0"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={filteredGames}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.gameItem}
            onPress={() => navigation.navigate('GameDetails', { gameId: item.id })}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.gameImage} />
            <View style={styles.gameInfo}>
              <Text style={styles.gameTitle}>{item.title}</Text>
              <Text style={styles.gamePrice}>${item.price.toFixed(2)}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b2838',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a475e',
    margin: 10,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    padding: 10,
    fontSize: 16,
  },
  gameItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2a475e',
  },
  gameImage: {
    width: 100,
    height: 60,
    borderRadius: 5,
  },
  gameInfo: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  gameTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gamePrice: {
    color: '#66c0f4',
    marginTop: 5,
  },
});

export default StoreScreen;