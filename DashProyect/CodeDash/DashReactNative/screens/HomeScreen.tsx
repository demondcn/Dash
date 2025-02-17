import { StyleSheet, View, FlatList, TouchableOpacity, Image, Text } from "react-native"

const games = [
  { id: "1", title: "Super Mario Odyssey", price: "$59.99", image: "https://via.placeholder.com/100" },
  {
    id: "2",
    title: "The Legend of Zelda: Breath of the Wild",
    price: "$59.99",
    image: "https://via.placeholder.com/100",
  },
  { id: "3", title: "Animal Crossing: New Horizons", price: "$59.99", image: "https://via.placeholder.com/100" },
]

export default function HomeScreen({ navigation }) {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.gameItem} onPress={() => navigation.navigate("GameDetail", { game: item })}>
      <Image source={{ uri: item.image }} style={styles.gameImage} />
      <View style={styles.gameInfo}>
        <Text style={styles.gameTitle}>{item.title}</Text>
        <Text style={styles.gamePrice}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <FlatList data={games} renderItem={renderItem} keyExtractor={(item) => item.id} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  gameItem: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  gameImage: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    marginRight: 10,
  },
  gameInfo: {
    flex: 1,
    justifyContent: "center",
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  gamePrice: {
    fontSize: 14,
    color: "#888",
  },
})

