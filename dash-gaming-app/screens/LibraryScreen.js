"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
  Modal,
  ScrollView,
} from "react-native"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import { useGames } from "../context/GamesContext"
import { Button } from "../components/ui/Button"

export const LibraryScreen = ({ navigation }) => {
  const { userGames, loading } = useGames()
  const [refreshing, setRefreshing] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [filteredGames, setFilteredGames] = useState([])
  const [activeFilter, setActiveFilter] = useState("all") // all, recent, mostPlayed, alphabetical
  const [activeCategory, setActiveCategory] = useState("all") // all, action, adventure, etc.

  // Categorías para filtrar
  const categories = [
    { id: "all", name: "Todas" },
    { id: "action", name: "Acción" },
    { id: "adventure", name: "Aventura" },
    { id: "rpg", name: "RPG" },
    { id: "strategy", name: "Estrategia" },
    { id: "sports", name: "Deportes" },
    { id: "indie", name: "Indie" },
  ]

  // Aplicar filtros a los juegos
  const applyFilters = () => {
    let filtered = [...userGames]

    // Filtrar por categoría
    if (activeCategory !== "all") {
      filtered = filtered.filter(
        (game) => game.tags && game.tags.some((tag) => tag.toLowerCase() === activeCategory.toLowerCase()),
      )
    }

    // Ordenar según el filtro activo
    switch (activeFilter) {
      case "recent":
        filtered.sort((a, b) => {
          if (!a.last_played) return 1
          if (!b.last_played) return -1
          return new Date(b.last_played) - new Date(a.last_played)
        })
        break
      case "mostPlayed":
        filtered.sort((a, b) => (b.playtime_minutes || 0) - (a.playtime_minutes || 0))
        break
      case "alphabetical":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      default:
        // Por defecto, no hacer nada
        break
    }

    setFilteredGames(filtered)
    setShowFilterModal(false)
  }

  // Restablecer filtros
  const resetFilters = () => {
    setActiveFilter("all")
    setActiveCategory("all")
    setFilteredGames([])
    setShowFilterModal(false)
  }

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

  // Determinar qué juegos mostrar
  const gamesToDisplay = filteredGames.length > 0 ? filteredGames : userGames

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
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilterModal(true)}>
          <Ionicons name="filter" size={24} color="#FFFFFF" />
          {(activeFilter !== "all" || activeCategory !== "all") && <View style={styles.filterBadge} />}
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando tu biblioteca...</Text>
        </View>
      ) : gamesToDisplay.length === 0 ? (
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
          data={gamesToDisplay}
          renderItem={renderGameItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#8A2BE2" />}
        />
      )}

      {/* Modal de filtros */}
      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtrar biblioteca</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.filterSectionTitle}>Ordenar por</Text>
              <View style={styles.filterOptions}>
                <TouchableOpacity
                  style={[styles.filterOption, activeFilter === "all" && styles.filterOptionActive]}
                  onPress={() => setActiveFilter("all")}
                >
                  <Text style={[styles.filterOptionText, activeFilter === "all" && styles.filterOptionTextActive]}>
                    Predeterminado
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.filterOption, activeFilter === "recent" && styles.filterOptionActive]}
                  onPress={() => setActiveFilter("recent")}
                >
                  <Text style={[styles.filterOptionText, activeFilter === "recent" && styles.filterOptionTextActive]}>
                    Jugados recientemente
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.filterOption, activeFilter === "mostPlayed" && styles.filterOptionActive]}
                  onPress={() => setActiveFilter("mostPlayed")}
                >
                  <Text
                    style={[styles.filterOptionText, activeFilter === "mostPlayed" && styles.filterOptionTextActive]}
                  >
                    Más jugados
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.filterOption, activeFilter === "alphabetical" && styles.filterOptionActive]}
                  onPress={() => setActiveFilter("alphabetical")}
                >
                  <Text
                    style={[styles.filterOptionText, activeFilter === "alphabetical" && styles.filterOptionTextActive]}
                  >
                    Alfabético
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.filterSectionTitle}>Categorías</Text>
              <View style={styles.categoriesContainer}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[styles.categoryOption, activeCategory === category.id && styles.categoryOptionActive]}
                    onPress={() => setActiveCategory(category.id)}
                  >
                    <Text
                      style={[
                        styles.categoryOptionText,
                        activeCategory === category.id && styles.categoryOptionTextActive,
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.filterActions}>
                <Button title="Restablecer" variant="outline" onPress={resetFilters} style={styles.resetButton} />
                <Button title="Aplicar filtros" onPress={applyFilters} style={styles.applyButton} />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    position: "relative",
  },
  filterBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#8A2BE2",
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
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1A1A1A",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  modalTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalBody: {
    padding: 16,
  },
  filterSectionTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 8,
  },
  filterOptions: {
    marginBottom: 20,
  },
  filterOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#2A2A2A",
  },
  filterOptionActive: {
    backgroundColor: "#8A2BE2",
  },
  filterOptionText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  filterOptionTextActive: {
    fontWeight: "bold",
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  categoryOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#2A2A2A",
  },
  categoryOptionActive: {
    backgroundColor: "#8A2BE2",
  },
  categoryOptionText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  categoryOptionTextActive: {
    fontWeight: "bold",
  },
  filterActions: {
    flexDirection: "row",
    marginTop: 16,
    marginBottom: 30,
  },
  resetButton: {
    flex: 1,
    marginRight: 8,
  },
  applyButton: {
    flex: 2,
  },
})
