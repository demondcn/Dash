"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import { useGames } from "../context/GamesContext"
import { Button } from "../components/ui/Button"
import { LinearGradient } from "expo-linear-gradient"

export const CartScreen = ({ navigation }) => {
  const { cartItems, removeFromCart, clearCart, purchaseGame, cartLoading } = useGames()
  const [processing, setProcessing] = useState(false)
  const [selectedItems, setSelectedItems] = useState({})

  // Calcular el total
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      if (selectedItems[item.id] || selectedItems[item.id] === undefined) {
        const price = item.discount_percent ? item.price * (1 - item.discount_percent / 100) : item.price
        return total + price
      }
      return total
    }, 0)
  }

  // Manejar la eliminación de un elemento
  const handleRemoveItem = (itemId) => {
    Alert.alert("Eliminar del carrito", "¿Estás seguro de que quieres eliminar este juego del carrito?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Eliminar",
        onPress: async () => {
          const { success } = await removeFromCart(itemId)
          if (success) {
            // Eliminar de los elementos seleccionados
            const newSelectedItems = { ...selectedItems }
            delete newSelectedItems[itemId]
            setSelectedItems(newSelectedItems)
          }
        },
        style: "destructive",
      },
    ])
  }

  // Manejar la compra de todos los elementos seleccionados
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      Alert.alert("Carrito vacío", "Añade juegos a tu carrito para continuar con la compra.")
      return
    }

    // Verificar si hay elementos seleccionados
    const hasSelectedItems =
      Object.values(selectedItems).some((selected) => selected === true) || Object.keys(selectedItems).length === 0

    if (!hasSelectedItems) {
      Alert.alert("Selecciona juegos", "Selecciona al menos un juego para continuar con la compra.")
      return
    }

    setProcessing(true)

    try {
      // Comprar cada juego seleccionado
      for (const item of cartItems) {
        if (selectedItems[item.id] || selectedItems[item.id] === undefined) {
          await purchaseGame(item.id)
        }
      }

      // Mostrar mensaje de éxito
      Alert.alert("¡Compra exitosa!", "Los juegos han sido añadidos a tu biblioteca.", [
        {
          text: "Ver biblioteca",
          onPress: () => navigation.navigate("Library"),
        },
        {
          text: "Seguir comprando",
          onPress: () => navigation.navigate("Home"),
        },
      ])
    } catch (error) {
      Alert.alert("Error", "Ha ocurrido un error al procesar tu compra. Inténtalo de nuevo.")
    } finally {
      setProcessing(false)
    }
  }

  // Manejar la selección/deselección de un elemento
  const toggleSelectItem = (itemId) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] === undefined ? false : !prev[itemId],
    }))
  }

  // Seleccionar/deseleccionar todos los elementos
  const toggleSelectAll = () => {
    if (cartItems.length === 0) return

    // Verificar si todos están seleccionados
    const allSelected = cartItems.every((item) => selectedItems[item.id] !== false)

    // Crear un nuevo objeto con todos seleccionados o deseleccionados
    const newSelectedItems = {}
    cartItems.forEach((item) => {
      newSelectedItems[item.id] = !allSelected
    })

    setSelectedItems(newSelectedItems)
  }

  // Renderizar un elemento del carrito
  const renderCartItem = ({ item }) => {
    const isSelected = selectedItems[item.id] !== false
    const discountedPrice = item.discount_percent ? item.price * (1 - item.discount_percent / 100) : item.price

    return (
      <View style={styles.cartItem}>
        <TouchableOpacity
          style={[styles.checkbox, isSelected && styles.checkboxSelected]}
          onPress={() => toggleSelectItem(item.id)}
        >
          {isSelected && <Ionicons name="checkmark" size={18} color="#FFFFFF" />}
        </TouchableOpacity>

        <Image source={{ uri: item.image_url }} style={styles.gameImage} />

        <View style={styles.gameInfo}>
          <Text style={styles.gameTitle}>{item.title}</Text>
          <View style={styles.priceContainer}>
            {item.discount_percent > 0 && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>-{item.discount_percent}%</Text>
              </View>
            )}
            <View>
              {item.discount_percent > 0 && <Text style={styles.originalPrice}>${item.price.toFixed(2)}</Text>}
              <Text style={styles.price}>${discountedPrice.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveItem(item.id)}>
          <Ionicons name="trash-outline" size={22} color="#FF4D4F" />
        </TouchableOpacity>
      </View>
    )
  }

  // Renderizar el estado vacío
  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="cart-outline" size={80} color="#8A2BE2" style={styles.emptyIcon} />
      <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
      <Text style={styles.emptyText}>Añade juegos a tu carrito para comprarlos</Text>
      <Button title="Explorar juegos" onPress={() => navigation.navigate("Home")} style={styles.exploreButton} />
    </View>
  )

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <LinearGradient colors={["#1A1A1A", "#121212"]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Carrito de compras</Text>
        <TouchableOpacity onPress={toggleSelectAll} style={styles.selectAllButton}>
          <Text style={styles.selectAllText}>
            {cartItems.every((item) => selectedItems[item.id] !== false) ? "Deseleccionar todo" : "Seleccionar todo"}
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      {cartLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8A2BE2" />
          <Text style={styles.loadingText}>Cargando carrito...</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmptyCart}
          />

          {cartItems.length > 0 && (
            <View style={styles.checkoutContainer}>
              <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalAmount}>${calculateTotal().toFixed(2)}</Text>
              </View>

              <View style={styles.checkoutButtons}>
                <Button
                  title="Vaciar carrito"
                  onPress={() => {
                    Alert.alert("Vaciar carrito", "¿Estás seguro de que quieres vaciar tu carrito?", [
                      {
                        text: "Cancelar",
                        style: "cancel",
                      },
                      {
                        text: "Vaciar",
                        onPress: () => clearCart(),
                        style: "destructive",
                      },
                    ])
                  }}
                  variant="outline"
                  style={styles.clearButton}
                />
                <Button
                  title={processing ? "Procesando..." : "Finalizar compra"}
                  onPress={handleCheckout}
                  loading={processing}
                  style={styles.checkoutButton}
                />
              </View>
            </View>
          )}
        </>
      )}
    </View>
  )
}

const { width } = Dimensions.get("window")

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
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    flex: 1,
    textAlign: "center",
  },
  backButton: {
    padding: 8,
  },
  selectAllButton: {
    padding: 8,
  },
  selectAllText: {
    color: "#8A2BE2",
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: 12,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#8A2BE2",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: "#8A2BE2",
  },
  gameImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  gameInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  gameTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  price: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  originalPrice: {
    color: "#999",
    fontSize: 14,
    textDecorationLine: "line-through",
    marginRight: 4,
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
  removeButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  emptyText: {
    color: "#CCCCCC",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  exploreButton: {
    width: width * 0.6,
  },
  checkoutContainer: {
    backgroundColor: "#1A1A1A",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  totalLabel: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "500",
  },
  totalAmount: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  checkoutButtons: {
    flexDirection: "row",
  },
  clearButton: {
    flex: 1,
    marginRight: 8,
  },
  checkoutButton: {
    flex: 2,
    backgroundColor: "#8A2BE2",
  },
})
