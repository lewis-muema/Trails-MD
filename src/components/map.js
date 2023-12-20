/* eslint-disable no-plusplus */
import React, { useContext } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import MapView, {
  Polyline, Marker, showCallout, hideCallout,
} from 'react-native-maps';
import { Context as LocationContext } from '../context/locationContext';

const Map = () => {
  const { state: { currentLocation } } = useContext(LocationContext);

  if (!currentLocation) {
    return <ActivityIndicator size='large' />;
  }
  const coords = [];
  return <MapView
    style={styles.map}
    initialRegion={{
      ...currentLocation.coords,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }}
    region={{
      ...currentLocation.coords,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }}
  >
    <Polyline coordinates={coords}/>
    <Marker
      coordinate={currentLocation.coords}
      title='You are here'
      onPress={showCallout}
      onDeselect={hideCallout}
    />
  </MapView>;
};

const styles = StyleSheet.create({
  map: {
    height: '100%',
  },
});

export default Map;
