import React, { useCallback, useContext, useState } from 'react';
import {
  View, StyleSheet,
} from 'react-native';
import { Input, Button } from 'react-native-elements';
import { useIsFocused } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import Map from '../components/map';
import Banner from '../components/banner';
import { Context as locationContext } from '../context/locationContext';
import useLocation from '../hooks/useLocation';
import useSaveTrack from '../hooks/useSaveTrack';
// import '../_mockLocation';

const nameRef = React.createRef();
const baseColor = '#316429';

const TrackCreateScreen = () => {
  const isFocused = useIsFocused();
  const {
    state: {
      name, recording, locations,
    },
    addLocation,
    startRecording,
    stopRecording,
    changeName,
  } = useContext(locationContext);
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

  return <View style={styles.outerContainer}>
    <View style={styles.mapContainer}>
      <Map />
    </View>
    <View style={styles.controls}>
      <View style={styles.inputCard}>
        <Input
          ref={nameRef}
          label='Trail title'
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
            title={recording ? 'Stop Tracking' : 'Start Tracking'}
            buttonStyle={recording ? styles.saveTrackButton : styles.createTrackButton}
            disabledStyle={styles.createTrackButton}
            titleStyle={styles.createTrackButtonText}
            onPress={record}
            disabled={loading}
          />
          {!recording && locations.length
            ? <Button
              title='Save Trail'
              buttonStyle={styles.saveButton}
              disabledStyle={styles.saveButton}
              titleStyle={styles.createTrackButtonText}
              onPress={() => saveTrack(val => setLoading(val))}
              loading={loading}
              disabled={loading}
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
    backgroundColor: '#d2e3c0',
    margin: 30,
    paddingVertical: 30,
    paddingHorizontal: 10,
    borderRadius: 10,
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
  error: {
    marginHorizontal: 30,
    position: 'absolute',
    top: -50,
    width: '85%',
    alignSelf: 'center',
  },
});

export default TrackCreateScreen;
