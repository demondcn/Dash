import React from 'react';
import { StyleSheet, View, Text, FlatList, Image } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../types/navigation';
import { games } from '../data/games';

type Props = BottomTabScreenProps<TabParamList, 'Biblioteca'>;

// Simulamos que el usuario ha comprado algunos juegos
const purchasedGames = games.slice(0, 3);

const LibraryScreen: React.FC<Props> = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Biblioteca</Text>
      <FlatList
        data={purchasedGames}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.gameItem}>
            <Image source={{ uri: item.imageUrl }} style={styles.gameImage} />
            <View style={styles.gameInfo}>
              <Text style={styles.gameTitle}>{item.title}</Text>
              <Text style={styles.gameDeveloper}>{item.developer}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default LibraryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b2838',
    padding: 10,
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  gameItem: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#2a475e',
    borderRadius: 5,
    overflow: 'hidden',
  },
  gameImage: {
    width: 80,
    height: 80,
  },
  gameInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  gameTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gameDeveloper: {
    color: '#8f98a0',
    marginTop: 5,
  },
});