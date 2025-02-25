import React from 'react';
import { View, Image, StyleSheet, Button, Text, ImageBackground } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';

type Props = StackScreenProps<RootStackParamList, 'Presentation'>;

const backgroundImageUri = 'https://i0.wp.com/www.marcelopedra.com.ar/blog/wp-content/uploads/2013/10/animated-gifs-of-fighting-game-backgrounds-7.gif?resize=624%2C396&ssl=1'; // Cambia esta URL por la de tu imagen

const PresentationScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ImageBackground source={{ uri: backgroundImageUri }} style={styles.container} resizeMode="cover">
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: 'https://i.pinimg.com/736x/2f/6b/2b/2f6b2b1b133b0ffce51b861e51e759ff.jpg' }} 
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Barra separadora */}
      <View style={styles.separator} />

      <View style={styles.content}>
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            Descubre Dash, la tienda de juegos más eficiente y rápida del mercado. 
            Encuentra los mejores títulos, ofertas exclusivas y una experiencia de compra sin igual.
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Ver Juegos" onPress={() => navigation.navigate('MainTabs')} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: '20%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  separator: {
    width: '100%',
    height: 25, // Ajusta el grosor de la barra
    backgroundColor: '#2C3E50', // Color sólido para la barra
  },
  banner: {
    width: '90%',
    height: 450,
    backgroundColor: '#2C3E50',
    alignSelf: 'center',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 45,
  },
  bannerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 20,
    backgroundColor: 'trasnparent',
  },
});

export default PresentationScreen;
