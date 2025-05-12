"use client"

import { useState } from "react"
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, RefreshControl } from "react-native"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import { useGames } from "../context/GamesContext"

export const LibraryScreen = ({ navigation }) => {
  const { userGames, loading } = useGames()
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = () => {
    setRefreshing(true)
    // Simulación de recarga
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }

  const handleGamePress = (game) => {
    navigation.navigate("GameDetails", { game })
  }

  const formatPlaytime = (minutes) => {
    if (!minutes) return "0h"

    if (minutes < 60) {
      return `${minutes}m`
    }

    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (remainingMinutes === 0) {
      return `${hours}h`
    }

    return `${hours}h ${remainingMinutes}m`
  }

  const renderGameItem = ({ item }) => (
    <TouchableOpacity style={styles.gameItem} onPress={() => handleGamePress(item)}>
      <Image source={{ uri: item.image_url }} style={styles.gameImage} />
      <View style={styles.gameInfo}>
        <Text style={styles.gameTitle}>{item.title}</Text>
        <Text style={styles.gamePlaytime}>
          {item.last_played ? `Último juego: ${new Date(item.last_played).toLocaleDateString()}` : "No jugado aún"}
        </Text>
        <Text style={styles.gamePlaytime}>Tiempo de juego: {formatPlaytime(item.playtime_minutes)}</Text>
      </View>
      <TouchableOpacity style={styles.playButton}>
        <Ionicons name="play" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Biblioteca</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando tu biblioteca...</Text>
        </View>
      ) : userGames.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image source={require("../assets/controller.png")} style={styles.emptyIcon} resizeMode="contain" />
          <Text style={styles.emptyTitle}>Tu biblioteca está vacía</Text>
          <Text style={styles.emptyText}>Compra juegos para añadirlos a tu biblioteca</Text>
          <TouchableOpacity style={styles.browseButton} onPress={() => navigation.navigate("Home")}>
            <Text style={styles.browseButtonText}>Explorar juegos</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={userGames}
          renderItem={renderGameItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#8A2BE2" />}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: "#1A1A1A",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  filterButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    color: "#CCCCCC",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: "#8A2BE2",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  listContent: {
    padding: 16,
  },
  gameItem: {
    flexDirection: "row",
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    marginBottom: 12,
    overflow: "hidden",
  },
  gameImage: {
    width: 80,
    height: 80,
  },
  gameInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  gameTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  gamePlaytime: {
    color: "#CCCCCC",
    fontSize: 12,
  },
  playButton: {
    backgroundColor: "#8A2BE2",
    width: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyIcon: {
    width: 100,
    height: 100,
    marginBottom: 16,
    tintColor: "#8A2BE2",
  },
})
