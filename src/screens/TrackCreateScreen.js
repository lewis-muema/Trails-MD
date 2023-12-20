import React, { useContext, useState } from 'react';
import {
  View, StyleSheet, SafeAreaView,
} from 'react-native';
import { Input, Button } from 'react-native-elements';
import { useIsFocused } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import Map from '../components/map';
import Spacer from '../components/Spacer';
import Banner from '../components/banner';
import { Context as locationContext } from '../context/locationContext';
import useLocation from '../hooks/useLocation';
// import '../_mockLocation';

const nameRef = React.createRef();
const baseColor = '#316429';

const TrackCreateScreen = () => {
  const isFocused = useIsFocused();
  const [name, setName] = useState('');
  const { addLocation } = useContext(locationContext);
  const [err] = useLocation(isFocused, location => addLocation(location));
  return <View style={styles.outerContainer}>
    <View style={styles.mapContainer}>
      <Map />
    </View>
    <SafeAreaView style={styles.container}>
    <View style={styles.controls}>
      <View style={styles.inputCard}>
        <Input
          ref={nameRef}
          label='Track name'
          value={name}
          onChangeText={val => setName(val)}
          labelStyle={styles.label}
          inputStyle={styles.inputTextSytle}
          autoCorrect={false}
          leftIcon={
            <Feather name="map-pin" size={18} color={baseColor} />
          }
        />
        <View style={styles.createTrackContainer}>
          <Button
            title='Create Track'
            buttonStyle={styles.createTrackButton}
            titleStyle={styles.createTrackButtonText}
          />
        </View>
      </View>
      { err ? <Spacer>
        <Banner message='Please enable location services' type='error'></Banner>
        </Spacer> : null
      }
    </View>
  </SafeAreaView>
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
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '100%',
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
    width: '60%',
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
});

export default TrackCreateScreen;
