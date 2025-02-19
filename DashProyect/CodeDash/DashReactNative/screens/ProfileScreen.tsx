import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../types/navigation';
import { Award, Clock, Gamepad2 , Heart, Star, Users } from 'lucide-react-native';


type Props = BottomTabScreenProps<TabParamList, 'Perfil'>;

const ProfileScreen: React.FC<Props> = () => {
  //Apartado de ejemplo de Usuario
  const userStats = {
    gamesOwned: 42,
    achievements: 156,
    playTime: "320h",
    friends: 25,
  };
  const recentActivity = [
    { id: '1', type: 'achievement', game: 'Cuphead', description: 'Logro desbloqueado: "No Hit Run"' },
    { id: '2', type: 'purchase', game: 'Hollow Knight', description: 'Nuevo juego añadido a la biblioteca' },
    { id: '3', type: 'playtime', game: 'Celeste', description: '2 horas jugadas hoy' },
  ];
  const games = [
    { id: '1', title: 'Game 1', imageUrl: 'https://via.placeholder.com/150' },
    { id: '2', title: 'Game 2', imageUrl: 'https://via.placeholder.com/150' },
    { id: '3', title: 'Game 3', imageUrl: 'https://via.placeholder.com/150' },
    { id: '4', title: 'Game 4', imageUrl: 'https://via.placeholder.com/150' },
  ];
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://placeholder.com/user-avatar.jpg' }}
          style={styles.avatar}
        />
        <Text style={styles.username}>PlayerOne</Text>
        <Text style={styles.status}>Online</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Gamepad2 size={24} color="#66c0f4" />
          <Text style={styles.statNumber}>{userStats.gamesOwned}</Text>
          <Text style={styles.statLabel}>Juegos</Text>
        </View>
        <View style={styles.statItem}>
          <Award size={24} color="#66c0f4" />
          <Text style={styles.statNumber}>{userStats.achievements}</Text>
          <Text style={styles.statLabel}>Logros</Text>
        </View>
        <View style={styles.statItem}>
          <Clock size={24} color="#66c0f4" />
          <Text style={styles.statNumber}>{userStats.playTime}</Text>
          <Text style={styles.statLabel}>Jugadas</Text>
        </View>
        <View style={styles.statItem}>
          <Users size={24} color="#66c0f4" />
          <Text style={styles.statNumber}>{userStats.friends}</Text>
          <Text style={styles.statLabel}>Amigos</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Juegos Favoritos</Text>
        <View style={styles.favoriteGames}>
          {games.slice(0, 3).map(game => (
            <View key={game.id} style={styles.favoriteGame}>
              <Image source={{ uri: game.imageUrl }} style={styles.favoriteGameImage} />
              <Text style={styles.favoriteGameTitle}>{game.title}</Text>
              <Text style={styles.favoriteGameTime}>32h jugadas</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actividad Reciente</Text>
        {recentActivity.map(activity => (
          <View key={activity.id} style={styles.activityItem}>
            <View style={styles.activityIcon}>
              {activity.type === 'achievement' && <Star size={20} color="#66c0f4" />}
              {activity.type === 'purchase' && <Gamepad2 size={20} color="#66c0f4" />}
              {activity.type === 'playtime' && <Clock size={20} color="#66c0f4" />}
            </View>
            <View style={styles.activityInfo}>
              <Text style={styles.activityGame}>{activity.game}</Text>
              <Text style={styles.activityDescription}>{activity.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b2838',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2a475e',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#66c0f4',
  },
  username: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  status: {
    color: '#66c0f4',
    fontSize: 16,
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#2a475e',
    marginVertical: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  statLabel: {
    color: '#8f98a0',
    fontSize: 12,
    marginTop: 2,
  },
  section: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#2a475e',
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  favoriteGames: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  favoriteGame: {
    width: '30%',
  },
  favoriteGameImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },
  favoriteGameTitle: {
    color: '#ffffff',
    fontSize: 14,
    marginTop: 5,
  },
  favoriteGameTime: {
    color: '#8f98a0',
    fontSize: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#2a475e',
    padding: 10,
    borderRadius: 8,
  },
  activityIcon: {
    marginRight: 10,
  },
  activityInfo: {
    flex: 1,
  },
  activityGame: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activityDescription: {
    color: '#8f98a0',
    fontSize: 14,
    marginTop: 2,
  },
});

export default ProfileScreen;