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
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as trackContext } from '../context/trackContext';
import { Context as PaletteContext } from '../context/paletteContext';
import Banner from '../components/banner';
import InfoCard from '../components/infoCard';
import Spacer from '../components/Spacer';

const AccountScreen = () => {
  const navigation = useNavigation();
  const {
    state: { offline },
    signout, deleteAccount, offlineMode,
  } = useContext(AuthContext);
  const {
    state: {
      success, error,
    },
    saveTrailsOffline,
  } = useContext(trackContext);
  const [email, setEmail] = useState('');
  const [guestMode, setGuestMode] = useState('');
  const [loading, setLoading] = useState(false);
  const [offlineLoading, setOfflineLoading] = useState(false);
  const {
    state:
    {
      palette, palettes, activePalette, background, backgrounds, activeBgImage,
    }, changeTheme, changeBG, showInfoCard,
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

  const signup = () => {
    navigation.navigate('Auth', { screen: 'Signup' });
  };

  const exitGuestMode = async () => {
    saveTrailsOffline('', () => offlineMode(''), () => {});
    await AsyncStorage.removeItem('guest');
    await AsyncStorage.removeItem('deleted_trails_state');
    await AsyncStorage.removeItem('offline');
    navigation.navigate('Auth', { screen: 'Signin' });
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
    saveTrailsOffline(offline ? '' : 'offline', () => offlineMode(offline ? '' : 'offline'), off => setOfflineLoading(off));
  };

  const styles = paletteStyles(palette);

  useEffect(() => {
    navigation.addListener('focus', async () => {
      showInfoCard(false);
      getData('email');
      useImageColors();
      const value = await AsyncStorage.getItem('offline');
      const guest = await AsyncStorage.getItem('guest');
      setGuestMode(guest);
      offlineMode(value, () => {});
    });
  }, []);

  return <ImageBackground source={background.image} resizeMode="cover" style={styles.bg}>
    <Spacer></Spacer>
    <SafeAreaView>
      <View>
        <Text style={styles.title}>Account</Text>
        <View style={styles.account}>
          <View style={styles.signOut}>
            <View style={styles.offlineMode}>
              <Text style={styles.offlineModeTop}>{ guestMode === 'yes' ? 'Guest' : email }</Text>
              <Text style={styles.offlineModeTitle}>
                You are signed in as:
              </Text>
            </View>
            <View style={styles.deleteButtonCont}>
            { guestMode === 'yes'
              ? <Button
                  title='Create account'
                  buttonStyle={offline ? styles.guestButton : styles.guestButton}
                  disabledStyle={offline ? styles.guestButton : styles.guestButton}
                  titleStyle={styles.deleteButtonText}
                  onPress={() => signup()}
                />
              : <Button
                title='Sign Out'
                buttonStyle={offline ? styles.signOutButton : styles.signOutButton}
                disabledStyle={offline ? styles.signOutButton : styles.signOutButton}
                titleStyle={styles.signOutButtonText}
                onPress={() => signout()}
                disabled={!!offline}
              /> }
            </View>
          </View>
          { guestMode === 'yes'
            ? <View style={styles.signOut}>
            <View style={styles.offlineMode}>
              <Text style={styles.offlineModeTop}>Use another account</Text>
              <Text style={styles.offlineModeTitle}>
                (Exit guest mode)
              </Text>
            </View>
            <View style={styles.deleteButtonCont}>
                <Button
                  title={ 'Sign in' }
                  buttonStyle={styles.offlineButton}
                  disabledStyle={styles.offlineButton}
                  titleStyle={styles.deleteButtonText}
                  onPress={() => exitGuestMode()}
                />
              </View>
          </View> : null }
          { guestMode === 'yes'
            ? <Text style={styles.guestModeTitle}>
                Note: In guest mode, your trails are only saved to this device,
                If you uninstall the app or clear the app data you will loose all your trails.
                If you want them to be backed up to the server you can create an account
                using the button above. Then all your saved trails will be backed up to your account
              </Text>
            : <View>
            <View style={styles.signOut}>
              <View style={styles.offlineMode}>
                <Text style={styles.offlineModeTop}>Offline mode: { offline ? 'On' : 'Off' }</Text>
                <Text style={styles.offlineModeTitle}>
                  (This mode allows you to record and save trails with data/wifi turned off.)
                  </Text>
              </View>
              <View style={styles.deleteButtonCont}>
                <Button
                  title={ offline ? 'Go online' : 'Go Offline'}
                  buttonStyle={offline ? styles.onlineButton : styles.offlineButton}
                  disabledStyle={offline ? styles.onlineButton : styles.offlineButton}
                  titleStyle={styles.deleteButtonText}
                  onPress={() => setOfflineMode()}
                  loading={offlineLoading}
                  disabled={offlineLoading}
                />
              </View>
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
                  disabled={loading || !!offline}
                />
              </View>
            </View>
          </View> }
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
        <TouchableOpacity onPress={() => showInfoCard(true)}>
          <View style={styles.privacyButtonTop}>
            <Text style={styles.privacyButton}>PRIVACY POLICY</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    <InfoCard message={['This app allows you to record trails on your phone both offline and online. In order to work in online mode an internet connection is required to communicate with the server.',
      'This app sends the trails to the server as a backup. If you prefer to not send your trails to the server feel free to utilise the offline mode and guest mode. These modes store your data locally on your device.',
      'Privacy is a key priority to me and hence I have devoted to make all the processes in this app as secure as possible from using encryption of credentials during login to refreshing tokens on a regular basis.',
      'All the data collected in this app is stored securely and can only be accessed by logged in users. The data can be deleted at any moment using the delete account button. This will delete your account along with all the trails associated with it.',
      'If you find any security vulnerability that has been inadvertently caused by me, or have any question regarding how the app protects your privacy, please send me an email at mdkkcontact@gmail.com']}
    title='Privacy policy' type='privacy' cta='Got it!' />
    { error ? <View style={styles.error}>
      <Banner message={error} type='error'></Banner>
      </View> : null
    }
    { success ? <View style={styles.error}>
      <Banner message={success} type='success'></Banner>
      </View> : null
    }
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
  privacyButton: {
    marginVertical: 15,
    backgroundColor: palette.background,
    color: palette.text,
    textAlign: 'center',
    borderRadius: 10,
    fontSize: 18,
    fontWeight: '900',
  },
  privacyButtonTop: {
    borderRadius: 10,
    backgroundColor: palette.background,
    marginHorizontal: 20,
    marginTop: 30,
  },
  signOutButton: {
    borderWidth: 2,
    borderColor: palette.text,
    borderRadius: 20,
    marginVertical: 5,
    height: 40,
    backgroundColor: palette.background,
    alignSelf: 'flex-end',
    width: 90,
  },
  deleteButtonText: {
    fontWeight: '600',
    color: 'white',
    fontSize: 15,
  },
  signOutButtonText: {
    fontWeight: '600',
    color: palette.text,
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
    borderColor: palette.text,
    backgroundColor: palette.text,
    borderRadius: 20,
    marginVertical: 5,
    height: 40,
    alignSelf: 'flex-end',
    width: 100,
  },
  onlineButton: {
    borderWidth: 2,
    borderColor: 'green',
    backgroundColor: 'green',
    borderRadius: 20,
    marginVertical: 5,
    height: 40,
    alignSelf: 'flex-end',
    width: 100,
  },
  guestButton: {
    borderWidth: 2,
    borderColor: 'green',
    backgroundColor: 'green',
    borderRadius: 20,
    marginVertical: 5,
    height: 40,
    alignSelf: 'flex-end',
    width: 'auto',
  },
  offlineButtonText: {
    fontWeight: '600',
    color: 'white',
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
  guestModeTitle: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
    fontSize: 11,
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
  error: {
    marginHorizontal: 30,
    position: 'absolute',
    bottom: 30,
    width: '85%',
    alignSelf: 'center',
  },
});

export default AccountScreen;
