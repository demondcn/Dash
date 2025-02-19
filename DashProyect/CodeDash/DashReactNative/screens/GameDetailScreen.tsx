import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { games } from '../data/games';

type Props = NativeStackScreenProps<RootStackParamList, 'GameDetails'>;

const GameDetailsScreen: React.FC<Props> = ({ route }) => {
  const { gameId } = route.params;
  const game = games.find(g => g.id === gameId);

  if (!game) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Juego no encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: game.imageUrl }} style={styles.banner} />
      <View style={styles.content}>
        <Text style={styles.title}>{game.title}</Text>
        <Text style={styles.developer}>{game.developer}</Text>
        <Text style={styles.date}>Fecha de lanzamiento: {game.releaseDate}</Text>
        <Text style={styles.price}>${game.price.toFixed(2)}</Text>
        <TouchableOpacity style={styles.buyButton}>
          <Text style={styles.buyButtonText}>Comprar</Text>
        </TouchableOpacity>
        <Text style={styles.description}>{game.description}</Text>
      </View>
    </ScrollView>
  );
};

export default GameDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b2838',
  },
  banner: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 15,
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  developer: {
    color: '#8f98a0',
    marginTop: 5,
  },
  date: {
    color: '#8f98a0',
    marginTop: 5,
  },
  price: {
    color: '#66c0f4',
    fontSize: 20,
    marginTop: 10,
  },
  buyButton: {
    backgroundColor: '#1a9fff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buyButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  description: {
    color: '#c6d4df',
    marginTop: 20,
    lineHeight: 20,
  },
  errorText: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});