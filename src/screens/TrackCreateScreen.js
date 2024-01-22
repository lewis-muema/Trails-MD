import React, {
  useCallback, useContext, useState, useEffect,
} from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity,
} from 'react-native';
import { Input, Button } from 'react-native-elements';
import { useIsFocused, useNavigation, CommonActions } from '@react-navigation/native';
import { Feather, Ionicons } from '@expo/vector-icons';
import Map from '../components/map';
import Banner from '../components/banner';
import { Context as locationContext } from '../context/locationContext';
import { Context as trackContext } from '../context/trackContext';
import useLocation from '../hooks/useLocation';
import useSaveTrack from '../hooks/useSaveTrack';
import Metrics from '../components/metrics';
// import '../_mockLocation';

const nameRef = React.createRef();
const baseColor = '#113231';

const TrackCreateScreen = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {
    state: {
      name, recording, locations, trackStatus, savedStatus, mode,
    },
    addLocation,
    startRecording,
    stopRecording,
    changeName,
    reset,
  } = useContext(locationContext);
  const { state: { trail }, setMapCenter } = useContext(trackContext);
  const [saveTrack, trackError, trackSuccess] = useSaveTrack();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // useCallback maintains the state of the function sent
  // to the watcher to prevent it from sending a new callback every time react rerenders.
  const callback = useCallback(location => addLocation(location, recording), [recording]);
  useLocation(isFocused || recording, callback);

  const record = () => {
    if (name) {
      recording ? stopRecording() : startRecording();
    } else {
      nameRef.current.shake();
      setError('Please enter a name to start tracking');
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
    navigation.addListener('focus', () => {
      if (mode === 'create') {
        reset();
      }
    });
  }, []);

  return <View style={styles.outerContainer}>
    <View style={styles.mapContainer}>
      <Map />
    </View>
    <Metrics />
    <View style={styles.controls}>
      <View style={styles.inputCard}>
        {
          !recording && locations.length && savedStatus
            ? <TouchableOpacity style={{ zIndex: 1000 }} onPress={() => reset()}>
                <View style={styles.addTrail}>
                  <Ionicons name="add-circle-sharp" size={16} color="#b6541c" />
                  <Text style={styles.addTrailText}>Add New Trail</Text>
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
          autoCorrect={false}
          errorMessage={error}
          leftIcon={
            <Feather name="map-pin" size={18} color={baseColor} />
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
              onPress={() => saveTrack(val => setLoading(val))}
              loading={loading}
              disabled={loading}
            /> : null}
          {!recording && locations.length && savedStatus
            ? <Button
              title='View Trail'
              buttonStyle={styles.updateTrackButton}
              titleStyle={styles.updateTrackButtonText}
              onPress={() => viewTrail()}
            /> : null}
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
    </View>
  </View>;
};

const styles = StyleSheet.create({
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
  },
  inputCard: {
    backgroundColor: '#faeed9',
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
    height: '100%',
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  mapContainer: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    justifyContent: 'center',
    bottom: 0,
  },
  label: {
    color: baseColor,
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
    backgroundColor: baseColor,
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
    borderColor: '#5c2f16',
    backgroundColor: '#faeed9',
    borderRadius: 10,
    width: '100%',
    fontSize: 14,
    marginTop: 15,
  },
  updateTrackButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#b6541c',
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
    backgroundColor: '#faeed9',
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
    color: '#b6541c',
    marginLeft: 2,
  },
});

export default TrackCreateScreen;
