import React from 'react';
import { View, Image, StyleSheet, Button, Text } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation'; 

type Props = StackScreenProps<RootStackParamList, 'Presentation'>;

const PresentationScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: 'https://i.pinimg.com/736x/2f/6b/2b/2f6b2b1b133b0ffce51b861e51e759ff.jpg' }} // Reemplaza con tu URL
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={styles.content}>
        <View style={styles.banner}>
          <Text style={styles.bannerText}>IDK</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Ver Juegos" onPress={() => navigation.navigate('MainTabs')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: '30%',
  },
  image: {
    width: '100%',
    height: '100%',
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
  },
  content: {
    flex: 1,
    backgroundColor: '#163A59',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#163A59',
  },
});

export default PresentationScreen;
