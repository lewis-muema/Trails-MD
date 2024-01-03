import React, { useContext, useEffect } from 'react';
import {
  View, StyleSheet, Text, Button, SafeAreaView, ImageBackground,
} from 'react-native';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { Context as AuthContext } from '../context/AuthContext';

const TrackListScreen = () => {
  const navigation = useNavigation();
  const {
    validateAuth,
  } = useContext(AuthContext);

  useEffect(() => {
    validateAuth();
  }, []);

  const [fontsLoaded] = useFonts({
    manuscript: require('../../assets/fonts/Manuscript.ttf'),
  });

  return <ImageBackground source={require('../../assets/bg4.png')} resizeMode="cover" style={styles.bg}>
    <SafeAreaView>
        <View style={styles.container}>
          { fontsLoaded ? <View style={styles.logo}>
            <Text style={styles.title}>TRAILS</Text>
            <Text style={styles.superscript}>MD</Text>
          </View> : null }
          <Button title='Track details' onPress={() => navigation.navigate('TrackDetail')} />
        </View>
    </SafeAreaView>
  </ImageBackground>;
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'left',
    fontWeight: '600',
    fontFamily: 'manuscript',
    fontSize: 60,
    color: '#faeed9',
    textShadowColor: '#171717',
    textShadowOffset: { width: -2, height: 4 },
    textShadowRadius: 3,
    paddingHorizontal: 5,
  },
  superscript: {
    textAlign: 'left',
    fontFamily: 'manuscript',
    color: '#faeed9',
    textShadowColor: 'black',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 2,
  },
  logo: {
    flexDirection: 'row',
  },
  trailsLogo: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  container: {
    marginHorizontal: 20,
  },
  bg: {
    height: '100%',
  },
});

export default TrackListScreen;
