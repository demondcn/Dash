import React from 'react';
import { View, Image, ImageBackground, StyleSheet, Button, Text } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient'; 
import { RootStackParamList } from '../types/navigation';

type Props = StackScreenProps<RootStackParamList, 'Presentation'>;

const backgroundImageUri = 'https://i0.wp.com/www.marcelopedra.com.ar/blog/wp-content/uploads/2013/10/animated-gifs-of-fighting-game-backgrounds-7.gif?resize=624%2C396&ssl=1';

const PresentationScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ImageBackground source={{ uri: backgroundImageUri }} style={styles.image} resizeMode="cover">
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          start={{ x: 0.5, y: 0 }} 
          end={{ x: 0, y: 0 }} 
          style={styles.gradient}
        />

        {/* Icono arriba a la izquierda sin afectar al resto */}
        <Image source={require('../assets/DashSF.png')} style={styles.icon} />

        <View style={styles.content}>
          <Text style={styles.bannerText}>
            Descubre Dash, la tienda de juegos más eficiente y rápida del mercado. 
            Encuentra los mejores títulos, ofertas exclusivas y una experiencia de compra sin igual.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Ver Juegos" onPress={() => navigation.navigate('MainTabs')} />
        </View>

      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject, // Atajo para ocupar toda la pantalla
  },
  icon: {
    position: 'absolute', // Evita que afecte el layout
    width: 300, // Ajusta el tamaño del icono
    height: 300,
    resizeMode: 'contain',
  },
  bannerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    padding: 20,
    textAlign: 'center',
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
  },
});

export default PresentationScreen;
