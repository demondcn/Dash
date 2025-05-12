"use client"

import { useState } from "react"
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from "react-native"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import { Button } from "../components/ui/Button"
import { useGames } from "../context/GamesContext"

export const GameDetailsScreen = ({ route, navigation }) => {
  const { game } = route.params
  const { addToCart, purchaseGame, cartItems, userGames } = useGames()
  const [loading, setLoading] = useState(false)

  const discountedPrice = game.discount_percent > 0 ? game.price * (1 - game.discount_percent / 100) : null

  // Verificar si el juego ya está en el carrito o en la biblioteca
  const isInCart = cartItems.some((item) => item.id.toString() === game.id.toString())
  const isOwned = userGames.some((item) => item.id.toString() === game.id.toString())

  const handleAddToCart = async () => {
    setLoading(true)
    try {
      const { success, error } = await addToCart(game.id)

      if (success) {
        Alert.alert("Añadido al carrito", "El juego ha sido añadido a tu carrito.", [
          {
            text: "Seguir comprando",
            style: "cancel",
          },
          {
            text: "Ver carrito",
            onPress: () => navigation.navigate("Cart"),
          },
        ])
      } else if (error) {
        Alert.alert("Error", error)
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo añadir el juego al carrito.")
    } finally {
      setLoading(false)
    }
  }

  const handleBuyNow = async () => {
    setLoading(true)
    try {
      const { success, error } = await purchaseGame(game.id)

      if (success) {
        Alert.alert("¡Compra exitosa!", "El juego ha sido añadido a tu biblioteca.", [
          {
            text: "Ver biblioteca",
            onPress: () => navigation.navigate("Library"),
          },
          {
            text: "Seguir comprando",
            style: "cancel",
          },
        ])
      } else if (error) {
        Alert.alert("Error", error)
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo completar la compra.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {game.title}
        </Text>
        <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate("Cart")}>
          <Ionicons name="cart-outline" size={24} color="#FFFFFF" />
          {cartItems.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Image source={{ uri: game.banner_url || game.image_url }} style={styles.banner} resizeMode="cover" />

        <View style={styles.infoSection}>
          <Text style={styles.title}>{game.title}</Text>

          <View style={styles.developerInfo}>
            <Text style={styles.developerLabel}>Desarrollador:</Text>
            <Text style={styles.developerValue}>{game.developer || "Desconocido"}</Text>
          </View>

          <View style={styles.developerInfo}>
            <Text style={styles.developerLabel}>Editor:</Text>
            <Text style={styles.developerValue}>{game.publisher || "Desconocido"}</Text>
          </View>

          <View style={styles.tagsContainer}>
            {game.tags &&
              game.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
          </View>

          <Text style={styles.description}>{game.description || "No hay descripción disponible para este juego."}</Text>
        </View>

        <View style={styles.priceSection}>
          {game.discount_percent > 0 && (
            <View style={styles.discountContainer}>
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>-{game.discount_percent}%</Text>
              </View>
              <Text style={styles.originalPrice}>${game.price.toFixed(2)}</Text>
            </View>
          )}

          <Text style={styles.price}>${discountedPrice ? discountedPrice.toFixed(2) : game.price.toFixed(2)}</Text>
        </View>

        <View style={styles.buttonsContainer}>
          {isOwned ? (
            <Button title="Jugar" onPress={() => {}} style={styles.playButton} />
          ) : (
            <>
              <Button title="Comprar ahora" onPress={handleBuyNow} loading={loading} style={styles.buyButton} />

              {!isInCart ? (
                <Button
                  title="Añadir al carrito"
                  onPress={handleAddToCart}
                  variant="outline"
                  loading={loading}
                  style={styles.cartButton}
                />
              ) : (
                <Button
                  title="Ver carrito"
                  variant="secondary"
                  onPress={() => navigation.navigate("Cart")}
                  style={styles.cartButton}
                />
              )}
            </>
          )}
        </View>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    flex: 1,
    textAlign: "center",
  },
  backButton: {
    padding: 8,
  },
  cartButton: {
    padding: 8,
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    right: 0,
    top: 0,
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
  },
  banner: {
    width: "100%",
    height: 250,
  },
  infoSection: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  developerInfo: {
    flexDirection: "row",
    marginBottom: 8,
  },
  developerLabel: {
    color: "#999",
    fontSize: 14,
    marginRight: 8,
  },
  developerValue: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: "#333",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  description: {
    color: "#CCCCCC",
    fontSize: 14,
    lineHeight: 20,
  },
  priceSection: {
    padding: 16,
    backgroundColor: "#1A1A1A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  discountContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  discountBadge: {
    backgroundColor: "#8A2BE2",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  discountText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  originalPrice: {
    color: "#999",
    fontSize: 16,
    textDecorationLine: "line-through",
  },
  price: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  buttonsContainer: {
    padding: 16,
    gap: 12,
  },
  buyButton: {
    marginBottom: 8,
  },
  playButton: {
    backgroundColor: "#4CAF50",
  },
})
