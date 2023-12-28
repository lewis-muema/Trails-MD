/* eslint-disable no-plusplus */
import React, { useContext, useEffect } from 'react';
import {
  ActivityIndicator, StyleSheet, View, Text,
} from 'react-native';
import MapView, {
  Polyline, Marker, showCallout, hideCallout,
} from 'react-native-maps';
import { Context as LocationContext } from '../context/locationContext';

const Map = () => {
  const {
    state: { currentLocation, polylines }, setPolyLines,
  } = useContext(LocationContext);
  useEffect(() => {
    setPolyLines();
  }, [currentLocation]);
  if (!currentLocation) {
    return <View>
      <Text style={styles.loadingText}>
        Please make sure your location is turned on in your device settings
      </Text>
      <ActivityIndicator size='large' />
    </View>;
  }
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
    { polylines.map((polyline, index) => <Polyline
      key={index}
      strokeWidth={4}
      strokeColor="green"
      coordinates={polyline.map(loc => loc.coords)}/>)
    }
    { polylines.map((polyline, index) => <Marker
        key={index}
        coordinate={polyline[0] ? polyline[0].coords : null}
        title={`Waypoint ${index + 1} starts here`}
        onPress={showCallout}
        onDeselect={hideCallout}
      />)
    }
    { polylines.map((polyline, index) => <Marker
        key={index}
        coordinate={polyline[polyline.length - 1] ? polyline[polyline.length - 1].coords : null}
        title={`Waypoint ${index + 1} ends here`}
        onPress={showCallout}
        onDeselect={hideCallout}
      />)
    }
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
  loadingText: {
    width: 200,
    textAlign: 'center',
    alignSelf: 'center',
    marginBottom: 15,
    color: 'grey',
    fontSize: 17,
    fontWeight: '500',
  },
});

export default Map;
