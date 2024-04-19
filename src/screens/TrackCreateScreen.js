import React, {
  useCallback, useContext, useState, useEffect,
} from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity, Alert,
  ScrollView, KeyboardAvoidingView, Keyboard,
} from 'react-native';
import { fetch } from '@react-native-community/netinfo';
import { Input, Button } from 'react-native-elements';
import { useIsFocused, useNavigation, CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather, Ionicons, AntDesign } from '@expo/vector-icons';
import Map from '../components/map';
import Banner from '../components/banner';
import InfoCard from '../components/infoCard';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as locationContext } from '../context/locationContext';
import { Context as trackContext } from '../context/trackContext';
import { Context as PaletteContext } from '../context/paletteContext';
import useLocation from '../hooks/useLocation';
import useSaveTrack from '../hooks/useSaveTrack';
import Metrics from '../components/metrics';
import Spacer from '../components/Spacer';
// import '../_mockLocation';

const nameRef = React.createRef();

const TrackCreateScreen = ({ route }) => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {
    state: {
      name, recording, locations, trackStatus, savedStatus,
    },
    addLocation,
    startRecording,
    stopRecording,
    changeName,
    reset,
    setPermission,
  } = useContext(locationContext);
  const { offlineMode } = useContext(AuthContext);
  const { state: { palette }, showInfoCard } = useContext(PaletteContext);
  const { state: { trail }, setMapCenter, saveTrailsOffline } = useContext(trackContext);
  const [saveTrack, trackError, trackSuccess] = useSaveTrack();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [offline, setOffline] = useState('');
  const [mode, setMode] = useState('');
  const [guest, setGuest] = useState('');
  // useCallback maintains the state of the function sent
  // to the watcher to prevent it from sending a new callback every time react rerenders.
  const callback = useCallback(location => addLocation(location, recording), [recording]);
  useLocation(isFocused || recording, callback);

  const record = () => {
    if (name) {
      recording ? stopRecording() : startRecording();
      Keyboard.dismiss();
    } else {
      nameRef.current.shake();
      setError('Please enter a name to start tracking');
    }
  };

  const saveTrail = () => {
    fetch().then((state) => {
      if (state.isConnected || guest === 'yes' || offline) {
        saveTrack(val => setLoading(val), offline);
      } else if (!offline) {
        Alert.alert(
          'You are offline',
          'You seem to be offline. Would you like to use offline mode?', [
            {
              text: 'Cancel',
              onPress: () => {},
              style: 'cancel',
            },
            {
              text: 'Go Offline',
              onPress: () => setOfflineMode(),
              style: 'default',
            },
          ],
        );
      }
    });
  };

  const setOfflineMode = () => {
    saveTrailsOffline('offline', () => offlineMode('offline'), off => saveTrailOffline(off));
  };

  const saveTrailOffline = (off) => {
    if (!off) {
      saveTrack(val => setLoading(val), 'offline');
    }
  };

  const viewTrail = () => {
    setMapCenter(trail);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{
          name: 'TrackList',
        }],
      }),
    );
    navigation.navigate('Tracks', {
      screen: 'TrackDetail',
      params: {
        id: trail.id,
      },
    });
    reset();
  };

  useEffect(() => {
    navigation.addListener('focus', async () => {
      const val = await AsyncStorage.getItem('offline');
      const modeVal = await AsyncStorage.getItem('mode');
      const guestVal = await AsyncStorage.getItem('guest');
      const permissions = await AsyncStorage.getItem('permissions');
      setPermission(permissions);
      setGuest(guestVal);
      setMode(modeVal);
      setOffline(val);
      if (!permissions) {
        showInfoCard(true);
      }
    });
  }, []);

  const styles = paletteStyles(palette);

  return <View style={styles.outerContainer}>
    <View style={styles.mapContainer}>
      <Map />
    </View>
    <InfoCard message={['This app collects location data to enable recording of trails, display the map and stats about your current location such as speed, bearing and coordinates even when the app is closed or not in use.',
      'In order to do this, the app will request for location permissions',
      'You can click on the link below to read the privacy policy for more information on this']}
    title='Use your location' link='https://sites.google.com/view/trailsmd/privacy-policy' type='permission' cta='Grant permissions' image='' />
    <View style={styles.metricsCont}>
      <Spacer></Spacer>
      <Spacer></Spacer>
      <Metrics />
    </View>
    <KeyboardAvoidingView
      style={styles.controls}
      keyboardVerticalOffset={-40}
      behavior={'position'}
    >
      <View style={styles.inputCard}>
        {
          !recording && locations.length
            ? <TouchableOpacity style={{ zIndex: 1000 }} onPress={() => reset()}>
                <View style={styles.addTrail}>
                  <AntDesign name="closecircle" size={15} color={palette.metricsTop} style={{ marginRight: 3 }} />
                  <Text style={styles.addTrailText}>Reset Trail</Text>
                </View>
              </TouchableOpacity>
            : null
        }
        <Input
          ref={nameRef}
          label='Trail Name'
          placeholder='Enter name'
          value={name}
          onChangeText={(val) => {
            changeName(val);
            setError('');
          }
          }
          labelStyle={styles.label}
          inputStyle={styles.inputTextSytle}
          placeholderTextColor={palette.text}
          inputContainerStyle={{ borderColor: palette.text }}
          autoCorrect={false}
          errorMessage={error}
          disabled={recording}
          leftIcon={
            <Feather name="map-pin" size={18} color={palette.text} />
          }
        />
        <View style={styles.createTrackContainer}>
          <Button
            title={trackStatus}
            buttonStyle={recording ? styles.saveTrackButton : styles.createTrackButton}
            disabledStyle={styles.createTrackButton}
            titleStyle={styles.createTrackButtonText}
            onPress={record}
            disabled={loading}
          />
          {!recording && locations.length && !savedStatus
            ? <Button
              title='Save Trail'
              buttonStyle={styles.saveButton}
              disabledStyle={styles.saveButton}
              titleStyle={styles.createTrackButtonText}
              onPress={() => saveTrail()}
              loading={loading}
              disabled={loading}
            /> : null}
          {!recording && locations.length && savedStatus
            ? <View style={{ marginTop: 15 }}><Button
              title='View Trail'
              buttonStyle={styles.updateTrackButton}
              titleStyle={styles.updateTrackButtonText}
              onPress={() => viewTrail()}
            /></View> : null}
        </View>
      </View>
      { trackError ? <View style={styles.error}>
        <Banner message={trackError} type='error'></Banner>
        </View> : null
      }
      { trackSuccess ? <View style={styles.error}>
        <Banner message={trackSuccess} type='success'></Banner>
        </View> : null
      }
    </KeyboardAvoidingView>
  </View>;
};

const paletteStyles = palette => StyleSheet.create({
  title: {
    textAlign: 'center',
    fontWeight: '600',
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 250,
    justifyContent: 'center',
    marginTop: 'auto',
  },
  inputCard: {
    backgroundColor: palette.background,
    width: '85%',
    alignSelf: 'center',
    marginBottom: 50,
    paddingVertical: 30,
    paddingHorizontal: 10,
    borderRadius: 10,
    shadowColor: '#171717',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  outerContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    top: 0,
  },
  mapContainer: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    justifyContent: 'center',
    bottom: 0,
  },
  label: {
    color: palette.text,
    fontSize: 14,
  },
  inputTextSytle: {
    marginLeft: 10,
  },
  createTrackContainer: {
    width: '90%',
    alignSelf: 'center',
  },
  createTrackButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  createTrackButton: {
    backgroundColor: palette.text,
    borderRadius: 10,
    width: '100%',
    fontSize: 14,
  },
  saveTrackButton: {
    backgroundColor: '#c91f1f',
    borderRadius: 10,
    width: '100%',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#c91f1f',
    borderRadius: 10,
    width: '100%',
    fontSize: 14,
    marginTop: 15,
  },
  updateTrackButton: {
    borderWidth: 2,
    borderColor: palette.metricsBottom,
    backgroundColor: palette.background,
    borderRadius: 10,
    width: '100%',
    fontSize: 14,
  },
  updateTrackButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.metricsTop,
  },
  error: {
    marginHorizontal: 30,
    position: 'absolute',
    top: -70,
    width: '85%',
    alignSelf: 'center',
  },
  addTrail: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginRight: 10,
    marginBottom: -20,
    zIndex: 1000,
    backgroundColor: palette.background,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: '#171717',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  addTrailText: {
    fontWeight: '600',
    fontSize: 14,
    color: palette.metricsTop,
    marginLeft: 2,
  },
});

export default TrackCreateScreen;
