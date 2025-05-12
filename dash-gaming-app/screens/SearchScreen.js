"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Keyboard,
} from "react-native"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import { useGames } from "../context/GamesContext"

export const SearchScreen = ({ navigation }) => {
  const { games } = useGames()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [recentSearches, setRecentSearches] = useState(["Cyberpunk", "Elden Ring", "Hades", "RPG"])
  const [loading, setLoading] = useState(false)
  const [showRecent, setShowRecent] = useState(true)

  // Categorías populares para búsqueda rápida
  const popularCategories = [
    { name: "Acción", icon: "flame-outline" },
    { name: "Aventura", icon: "compass-outline" },
    { name: "RPG", icon: "game-controller-outline" },
    { name: "Estrategia", icon: "grid-outline" },
    { name: "Deportes", icon: "football-outline" },
    { name: "Indie", icon: "star-outline" },
  ]

  // Realizar búsqueda cuando cambia la consulta
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([])
      setShowRecent(true)
      return
    }

    setLoading(true)
    setShowRecent(false)

    // Simular retraso de búsqueda
    const timer = setTimeout(() => {
      const results = games.filter(
        (game) =>
          game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (game.tags && game.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))) ||
          (game.description && game.description.toLowerCase().includes(searchQuery.toLowerCase())),
      )
      setSearchResults(results)
      setLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, games])

  // Manejar la selección de un juego
  const handleGameSelect = (game) => {
    // Guardar la búsqueda en recientes si no existe ya
    if (searchQuery.trim() !== "" && !recentSearches.includes(searchQuery)) {
      setRecentSearches((prev) => [searchQuery, ...prev.slice(0, 4)])
    }

    // Navegar a los detalles del juego
    navigation.navigate("GameDetails", { game })
  }

  // Manejar la selección de una búsqueda reciente
  const handleRecentSearch = (query) => {
    setSearchQuery(query)
  }

  // Manejar la selección de una categoría
  const handleCategorySelect = (category) => {
    setSearchQuery(category)
  }

  // Limpiar búsquedas recientes
  const clearRecentSearches = () => {
    setRecentSearches([])
  }

  // Renderizar un elemento de resultado de búsqueda
  const renderSearchResult = ({ item }) => {
    const discountedPrice = item.discount_percent > 0 ? item.price * (1 - item.discount_percent / 100) : null

    return (
      <TouchableOpacity style={styles.resultItem} onPress={() => handleGameSelect(item)}>
        <Image source={{ uri: item.image_url }} style={styles.resultImage} />
        <View style={styles.resultInfo}>
          <Text style={styles.resultTitle}>{item.title}</Text>
          <Text style={styles.resultDeveloper}>{item.developer || "Desarrollador desconocido"}</Text>
          <View style={styles.resultPriceContainer}>
            {item.discount_percent > 0 && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>-{item.discount_percent}%</Text>
              </View>
            )}
            <Text style={styles.resultPrice}>
              ${discountedPrice ? discountedPrice.toFixed(2) : item.price.toFixed(2)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar juegos, categorías..."
            placeholderTextColor="#999999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
            returnKeyType="search"
            onSubmitEditing={() => Keyboard.dismiss()}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#999999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8A2BE2" />
        </View>
      ) : showRecent ? (
        <View style={styles.content}>
          {recentSearches.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Búsquedas recientes</Text>
                <TouchableOpacity onPress={clearRecentSearches}>
                  <Text style={styles.clearText}>Borrar</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.recentSearchesContainer}>
                {recentSearches.map((query, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.recentSearchItem}
                    onPress={() => handleRecentSearch(query)}
                  >
                    <Ionicons name="time-outline" size={16} color="#999999" style={styles.recentSearchIcon} />
                    <Text style={styles.recentSearchText}>{query}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categorías populares</Text>
            <View style={styles.categoriesContainer}>
              {popularCategories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.categoryItem}
                  onPress={() => handleCategorySelect(category.name)}
                >
                  <View style={styles.categoryIcon}>
                    <Ionicons name={category.icon} size={24} color="#FFFFFF" />
                  </View>
                  <Text style={styles.categoryText}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      ) : searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={renderSearchResult}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.resultsList}
        />
      ) : (
        <View style={styles.noResultsContainer}>
          <Ionicons name="search-outline" size={64} color="#666666" />
          <Text style={styles.noResultsText}>No se encontraron resultados para "{searchQuery}"</Text>
          <Text style={styles.noResultsSubtext}>Intenta con otra búsqueda o explora las categorías</Text>
        </View>
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
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: "#1A1A1A",
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    height: 40,
  },
  clearButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  clearText: {
    color: "#8A2BE2",
    fontSize: 14,
  },
  recentSearchesContainer: {
    marginTop: 8,
  },
  recentSearchItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  recentSearchIcon: {
    marginRight: 12,
  },
  recentSearchText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  categoryItem: {
    width: "30%",
    alignItems: "center",
    marginBottom: 16,
    marginHorizontal: "1.5%",
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2A2A2A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryText: {
    color: "#FFFFFF",
    fontSize: 14,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  resultsList: {
    padding: 16,
  },
  resultItem: {
    flexDirection: "row",
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  resultImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
  },
  resultInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  resultTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultDeveloper: {
    color: "#CCCCCC",
    fontSize: 14,
  },
  resultPriceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  discountBadge: {
    backgroundColor: "#8A2BE2",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  discountText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  resultPrice: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noResultsText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  noResultsSubtext: {
    color: "#CCCCCC",
    fontSize: 14,
    textAlign: "center",
  },
})
