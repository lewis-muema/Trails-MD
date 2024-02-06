/* eslint-disable consistent-return */
/* eslint-disable arrow-body-style */
import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Button,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  FlatList, Image,
  Appearance,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as PaletteContext } from '../context/paletteContext';

const AccountScreen = () => {
  const { signout } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const {
    state:
    {
      palette, palettes, activePalette, background, backgrounds, activeBgImage,
    }, changeTheme, changeBG,
  } = useContext(PaletteContext);

  const useImageColors = async () => {
    const colorScheme = Appearance.getColorScheme();
  };

  const getData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        setEmail(value);
      }
    } catch (e) {
      // error reading value
    }
  };

  const styles = paletteStyles(palette);

  useEffect(() => {
    getData('email');
    useImageColors();
  }, []);

  return <ImageBackground source={background.image} resizeMode="cover" style={styles.bg}>
    <SafeAreaView>
      <View>
        <Text style={styles.title}>Account</Text>
        <View style={styles.signOut}>
          <Text style={styles.emailTitle}>{ email }</Text>
          <TouchableOpacity style={styles.signOutButton} onPress={() => signout()}>
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.palette}>
          <Text style={styles.paletteTitle}>Palette</Text>
          <View>
          <FlatList
              horizontal={true}
              data={palettes}
              style={styles.paletteRow}
              renderItem={({ item, index }) => <TouchableOpacity
                activeOpacity={1}
                onPress={() => changeTheme(index)}
              >
                <View style={styles.paletteBoxes}>
                  {
                    index === activePalette ? <View style={styles.activePalette}>
                      <Feather name="check-circle" size={20} color="white" />
                    </View> : null
                  }
                  <View style={{ backgroundColor: item.text, ...styles.paletteBox }}></View>
                  <View style={{ backgroundColor: item.background, ...styles.paletteBox }}></View>
                  <View style={{
                    backgroundColor: item.buttonsInactive,
                    ...styles.paletteBox,
                  }}></View>
                  <View style={{
                    backgroundColor: item.metricsTop,
                    ...styles.paletteBox,
                  }}></View>
                  <View style={{
                    backgroundColor: item.metricsBottom,
                    ...styles.paletteBox,
                  }}></View>
                </View>
              </TouchableOpacity>
              }
            />
          </View>
          <Text style={styles.paletteTitle}>Background</Text>
          <View>
          <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={backgrounds}
              style={styles.paletteRow}
              renderItem={({ item, index }) => <TouchableOpacity
                activeOpacity={1}
                onPress={() => changeBG(index)}
              >
                <View style={styles.bgImageBoxes}>
                  {
                    index === activeBgImage ? <View style={styles.activePalette}>
                      <Feather name="check-circle" size={20} color="white" />
                    </View> : null
                  }
                    <Image style={styles.bgImages} source={item.image}/>
                </View>
              </TouchableOpacity>
              }
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
   </ImageBackground>;
};

const paletteStyles = palette => StyleSheet.create({
  title: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 22,
    marginVertical: 10,
    color: palette.text,
  },
  signOut: {
    flexDirection: 'row',
    backgroundColor: palette.background,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 10,
  },
  signOutButton: {
    borderWidth: 2,
    borderColor: 'black',
    padding: 10,
    borderRadius: 20,
    marginLeft: 'auto',
    marginRight: 10,
    marginVertical: 5,
  },
  signOutButtonText: {
    fontWeight: '600',
    color: palette.text,
  },
  emailTitle: {
    alignSelf: 'center',
    marginLeft: 20,
    fontSize: 18,
    fontWeight: '500',
    color: palette.text,
  },
  paletteTitle: {
    marginLeft: 20,
    fontSize: 14,
    marginTop: 10,
    fontWeight: '600',
    color: palette.text,
  },
  bg: {
    height: '100%',
  },
  bgImages: {
    width: 100,
    height: 150,
    resizeMode: 'cover',
  },
  bgImageBoxes: {
    borderWidth: 1,
    borderColor: 'black',
    width: 100,
    height: 150,
    borderRadius: 5,
    marginRight: 20,
  },
  palette: {
    backgroundColor: palette.background,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 10,
  },
  paletteBox: {
    width: '100%',
    height: 10,
  },
  paletteBoxes: {
    borderWidth: 1,
    borderColor: 'black',
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 20,
  },
  paletteRow: {
    marginVertical: 10,
    marginHorizontal: 20,
  },
  card: {
    backgroundColor: palette.background,
  },
  activePalette: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000047',
  },
});

export default AccountScreen;
