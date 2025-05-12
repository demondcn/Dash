import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native"

export const GameCard = ({ game, onPress }) => {
  const discountedPrice = game.discount_percent > 0 ? game.price * (1 - game.discount_percent / 100) : null

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(game)}>
      <Image source={{ uri: game.image_url }} style={styles.image} resizeMode="cover" />
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {game.title}
        </Text>
        <View style={styles.priceContainer}>
          {game.discount_percent > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{game.discount_percent}%</Text>
            </View>
          )}
          <View>
            {discountedPrice && <Text style={styles.originalPrice}>${game.price.toFixed(2)}</Text>}
            <Text style={styles.price}>${discountedPrice ? discountedPrice.toFixed(2) : game.price.toFixed(2)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 150,
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 12,
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: 200,
  },
  infoContainer: {
    padding: 8,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  price: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  originalPrice: {
    color: "#999",
    fontSize: 12,
    textDecorationLine: "line-through",
  },
  discountBadge: {
    backgroundColor: "#8A2BE2",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
})
