import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from "react-native"
import { LinearGradient } from "expo-linear-gradient"

export const FeaturedGame = ({ game, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(game)}>
      <ImageBackground source={{ uri: game.banner_url || game.image_url }} style={styles.background} resizeMode="cover">
        <LinearGradient colors={["transparent", "rgba(0,0,0,0.8)"]} style={styles.gradient}>
          <View style={styles.content}>
            <Text style={styles.title}>{game.title}</Text>
            <Text style={styles.description} numberOfLines={2}>
              {game.description}
            </Text>
            <View style={styles.priceContainer}>
              {game.discount_percent > 0 ? (
                <>
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>-{game.discount_percent}%</Text>
                  </View>
                  <Text style={styles.originalPrice}>${game.price.toFixed(2)}</Text>
                  <Text style={styles.price}>${(game.price * (1 - game.discount_percent / 100)).toFixed(2)}</Text>
                </>
              ) : (
                <Text style={styles.price}>${game.price.toFixed(2)}</Text>
              )}
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 250,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
  },
  background: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    flex: 1,
    justifyContent: "flex-end",
  },
  content: {
    padding: 16,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    color: "#CCCCCC",
    fontSize: 14,
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  price: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  originalPrice: {
    color: "#999",
    fontSize: 14,
    textDecorationLine: "line-through",
    marginRight: 8,
    marginLeft: 8,
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
})
