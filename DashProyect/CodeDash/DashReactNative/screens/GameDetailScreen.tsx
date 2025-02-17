import { StyleSheet, View, Image, Text, TouchableOpacity } from "react-native"

export default function GameDetailScreen({ route }) {
  const { game } = route.params

  return (
    <View style={styles.container}>
      <Image source={{ uri: game.image }} style={styles.gameImage} />
      <Text style={styles.gameTitle}>{game.title}</Text>
      <Text style={styles.gamePrice}>{game.price}</Text>
      <TouchableOpacity style={styles.addToCartButton} onPress={() => alert("Game added to cart!")}>
        <Text style={styles.addToCartButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  gameImage: {
    width: 200,
    height: 200,
    resizeMode: "cover",
    marginBottom: 20,
  },
  gameTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  gamePrice: {
    fontSize: 18,
    color: "#888",
    marginBottom: 20,
  },
  addToCartButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  addToCartButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})

