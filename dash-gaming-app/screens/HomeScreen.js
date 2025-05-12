"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, FlatList, RefreshControl, Image, TouchableOpacity } from "react-native"
import { StatusBar } from "expo-status-bar"
import { FeaturedGame } from "../components/FeaturedGame"
import { GameCard } from "../components/GameCard"
import { Ionicons } from "@expo/vector-icons"
import { useGames } from "../context/GamesContext"

export const HomeScreen = ({ navigation }) => {
  const { games, cartItems, loading } = useGames()
  const [refreshing, setRefreshing] = useState(false)
  const [featuredGame, setFeaturedGame] = useState(null)
  const [newReleases, setNewReleases] = useState([])
  const [topSellers, setTopSellers] = useState([])
  const [specialOffers, setSpecialOffers] = useState([])

  useEffect(() => {
    if (games.length > 0) {
      // Set featured game (newest release)
      setFeaturedGame(games[0])

      // Set new releases (newest 10 games)
      setNewReleases(games.slice(0, 10))

      // Set top sellers (random selection for demo)
      const shuffled = [...games].sort(() => 0.5 - Math.random())
      setTopSellers(shuffled.slice(0, 10))

      // Set special offers (games with discount)
      setSpecialOffers(games.filter((game) => game.discount_percent > 0))
    }
  }, [games])

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

  const renderGameSection = (title, data) => {
    if (!data || data.length === 0) return null

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <FlatList
          data={data}
          renderItem={({ item }) => <GameCard game={item} onPress={handleGamePress} />}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <View style={styles.headerLogoContainer}>
          <Image source={require("../assets/logo.png")} style={styles.headerLogo} resizeMode="contain" />
          <Text style={styles.headerTitle}>DASH</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <Ionicons name="search" size={24} color="#FFFFFF" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Cart")} style={styles.cartIconContainer}>
            <Ionicons name="cart-outline" size={24} color="#FFFFFF" style={styles.icon} />
            {cartItems.length > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#8A2BE2" />}
      >
        {loading ? (
          <Text style={styles.loadingText}>Cargando juegos...</Text>
        ) : (
          <>
            {featuredGame && <FeaturedGame game={featuredGame} onPress={handleGamePress} />}

            {renderGameSection("Nuevos Lanzamientos", newReleases)}
            {renderGameSection("Más Vendidos", topSellers)}
            {renderGameSection("Ofertas Especiales", specialOffers)}

            <View style={styles.featuresSection}>
              <Text style={styles.featuresSectionTitle}>¿Por qué elegir DASH?</Text>

              <View style={styles.featureItem}>
                <Ionicons name="pricetag-outline" size={24} color="#8A2BE2" />
                <Text style={styles.featureText}>Precios competitivos y sin comisiones ocultas</Text>
              </View>

              <View style={styles.featureItem}>
                <Ionicons name="people-outline" size={24} color="#8A2BE2" />
                <Text style={styles.featureText}>Comunidad activa</Text>
              </View>

              <View style={styles.featureItem}>
                <Ionicons name="game-controller-outline" size={24} color="#8A2BE2" />
                <Text style={styles.featureText}>Juegos indies y triple A</Text>
              </View>

              <View style={styles.featureItem}>
                <Ionicons name="headset-outline" size={24} color="#8A2BE2" />
                <Text style={styles.featureText}>Soporte 24/7</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
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
  headerLogoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerLogo: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#8A2BE2",
  },
  headerIcons: {
    flexDirection: "row",
  },
  icon: {
    marginLeft: 20,
  },
  cartIconContainer: {
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    right: -6,
    top: -6,
    backgroundColor: "#FF4D4F",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingText: {
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  featuresSection: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  featuresSectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 12,
  },
})
