/* eslint-disable consistent-return */
/* eslint-disable arrow-body-style */
import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  FlatList, Image,
  Appearance,
  Alert,
} from 'react-native';
import { Button } from 'react-native-elements';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as trackContext } from '../context/trackContext';
import { Context as PaletteContext } from '../context/paletteContext';

const AccountScreen = () => {
  const {
    state: { offline },
    signout, deleteAccount, offlineMode,
  } = useContext(AuthContext);
  const {
    saveTrailsOffline,
  } = useContext(trackContext);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
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

  const confirmDelete = () => {
    Alert.alert(
      'Delete your account',
      'This action is irresverible. You will loose all your data. Are you sure you want to delete your acount?', [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => deleteAccount(val => setLoading(val)),
          style: 'destructive',
        },
      ],
    );
  };

  const setOfflineMode = () => {
    offlineMode(offline ? '' : 'offline', () => saveTrailsOffline(offline ? '' : 'offline'));
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
        <View style={styles.account}>
          <View style={styles.signOut}>
            <View style={styles.offlineMode}>
              <Text style={styles.offlineModeTop}>{ email }</Text>
              <Text style={styles.offlineModeTitle}>
                You are signed in to:
                </Text>
            </View>
            <TouchableOpacity style={styles.signOutButton} onPress={() => signout()}>
              <Text style={styles.signOutButtonText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.signOut}>
            <View style={styles.offlineMode}>
              <Text style={styles.offlineModeTop}>Offline mode</Text>
              <Text style={styles.offlineModeTitle}>
                (This mode allows you to record and save trails with data/wifi turned off.)
                </Text>
            </View>
            <TouchableOpacity
              style={offline ? styles.onlineButton : styles.offlineButton}
              onPress={() => setOfflineMode()}>
              <Text style={styles.offlineButtonText}>{ offline ? 'Go online' : 'Go Offline'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.signOut}>
            <View style={styles.offlineMode}>
              <Text style={styles.offlineModeTop}>Delete my account</Text>
              <Text style={styles.offlineModeTitle}>
                (Warning: This action is irreversible!
                You will lose all your saved trails.)
                </Text>
            </View>
            <View style={styles.deleteButtonCont}>
              <Button
                title='Delete'
                buttonStyle={styles.deleteButton}
                disabledStyle={styles.deleteButton}
                titleStyle={styles.deleteButtonText}
                onPress={() => confirmDelete()}
                loading={loading}
                disabled={loading}
              />
            </View>
          </View>
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
    color: palette.background,
    textShadowColor: '#171717',
    textShadowOffset: { width: -2, height: 2 },
    textShadowRadius: 5,
  },
  account: {
    backgroundColor: palette.background,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 10,
  },
  signOut: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  signOutButton: {
    borderWidth: 2,
    borderColor: palette.text,
    padding: 10,
    borderRadius: 20,
    marginLeft: 'auto',
    marginRight: 10,
    marginVertical: 5,
    height: 40,
    alignSelf: 'center',
  },
  deleteButtonText: {
    fontWeight: '600',
    color: 'white',
    fontSize: 15,
  },
  deleteButton: {
    borderWidth: 2,
    borderColor: 'red',
    borderRadius: 20,
    marginVertical: 5,
    height: 40,
    backgroundColor: 'red',
    alignSelf: 'flex-end',
    width: 80,
  },
  deleteButtonCont: {
    marginLeft: 'auto',
    marginRight: 10,
  },
  offlineButton: {
    borderWidth: 2,
    borderColor: 'grey',
    backgroundColor: 'grey',
    padding: 10,
    borderRadius: 20,
    marginLeft: 'auto',
    marginRight: 10,
    marginVertical: 5,
    height: 40,
    alignSelf: 'center',
  },
  onlineButton: {
    borderWidth: 2,
    borderColor: 'green',
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 20,
    marginLeft: 'auto',
    marginRight: 10,
    marginVertical: 5,
    height: 40,
    alignSelf: 'center',
  },
  offlineButtonText: {
    fontWeight: '600',
    color: 'white',
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
  offlineMode: {
    justifyContent: 'center',
    width: '65%',
  },
  offlineModeTop: {
    marginLeft: 20,
    fontSize: 18,
    fontWeight: '500',
    color: palette.text,
  },
  offlineModeTitle: {
    marginLeft: 20,
    fontSize: 10,
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
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    marginRight: 20,
  },
  bgImageBoxes: {
    width: 100,
    height: 150,
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
    overflow: 'hidden',
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
