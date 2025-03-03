  import React from 'react';
  import { View, Image, ImageBackground, StyleSheet, Text, TouchableOpacity } from 'react-native';
  import { StackScreenProps } from '@react-navigation/stack';
  import { LinearGradient } from 'expo-linear-gradient'; 
  import { RootStackParamList } from '../types/navigation';

  type Props = StackScreenProps<RootStackParamList, 'Presentation'>;

  const backgroundImageUri = 'https://i0.wp.com/www.marcelopedra.com.ar/blog/wp-content/uploads/2013/10/animated-gifs-of-fighting-game-backgrounds-7.gif?resize=624%2C396&ssl=1';

  const PresentationScreen: React.FC<Props> = ({ navigation }) => {
    return (
      <View style={styles.container}>
        <ImageBackground source={{ uri: backgroundImageUri }} style={styles.image} resizeMode='cover'>
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradient}
          />
        </ImageBackground>
        <View style={styles.Nav}>
          <Image source={require('../assets/DashSF.png')} style={styles.logo} />
          <View style={styles.NavLinks}>
            <TouchableOpacity onPress={() => navigation.navigate('MainTabs')}>
              <Text style={styles.navText}>Inicio</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Text style={styles.navText}>Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
              <Text style={styles.navText}>Ajustes</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.ConText}>
            <Text style={styles.TextPre}>
                Descubre Dash {'\n'}
                la tienda de juegos más eficiente y rápida del mercado.{'\n'}
                Encuentra los mejores títulos, ofertas exclusivas {'\n'}
                y una experiencia de compra sin igual.
            </Text>
        </View>
        <View style={styles.ConImg}>
          <Image source={require('../assets/final.png')} style={styles.ImgPre} />
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      position: 'relative',
    },
    image: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    gradient: {
      ...StyleSheet.absoluteFillObject,
    },
    Nav: {
      position: 'absolute',
      width: '100%',
      height: 70, 
      backgroundColor: 'rgba(0, 0, 0, 0.5)', 
      flexDirection: 'row', 
      alignItems: 'center', 
      paddingHorizontal: 10,
      top: 65,
    },
    logo: {
      width: 170,
      height: 70,
      marginRight: 15,
    },
    NavLinks: {
      flexDirection: 'row',
      flex: 1,
      justifyContent: 'space-around',
    },
    navText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
    ConText: {
      width: '100%',
      position: 'absolute',
      bottom: 300,
      left: 20, 
      right: 0, 
      alignItems: 'flex-start',
    },
    TextPre: {
      color: 'white',
      fontSize: 30,
      fontWeight: 'bold',
      textAlign: 'left', 
    },
    ConImg: {
      width: '100%',
      position: 'absolute',
      bottom: 120,
      alignItems: 'flex-end',
    },
    ImgPre:{
      width: 750,
      height: 500,
      marginRight: 70,
    }
  });


export default PresentationScreen;
