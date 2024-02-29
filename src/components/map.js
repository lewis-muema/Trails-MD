/* eslint-disable no-plusplus */
import React, { useContext, useEffect } from 'react';
import {
  ActivityIndicator, StyleSheet, View, Text,
} from 'react-native';
import MapView, {
  Polyline, Marker, showCallout, hideCallout, PROVIDER_GOOGLE,
} from 'react-native-maps';
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { Context as LocationContext } from '../context/locationContext';
import { Context as PaletteContext } from '../context/paletteContext';

const Map = () => {
  const {
    state: { currentLocation, polylines }, setPolyLines,
  } = useContext(LocationContext);
  const { state: { palette } } = useContext(PaletteContext);
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
    provider={PROVIDER_GOOGLE}
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
    customMapStyle={palette.mapstyle}
  >
    { polylines.map((polyline, index) => <Polyline
      key={index}
      strokeWidth={4}
      strokeColor={palette.text}
      coordinates={polyline.map(loc => loc.coords)}/>)
    }
    { polylines.map((polyline, index) => <Marker
        key={index}
        coordinate={polyline[0] ? polyline[0].coords : null}
        title={`Waypoint ${index + 1} starts here`}
        onPress={showCallout}
        onDeselect={hideCallout}
      >
          <FontAwesome name="flag" style={styles.flag} color={palette.metricsTop} />
      </Marker>)
    }
    { polylines.map((polyline, index) => <Marker
        key={index}
        coordinate={polyline[polyline.length - 1] ? polyline[polyline.length - 1].coords : null}
        title={`Waypoint ${index + 1} ends here`}
        onPress={showCallout}
        onDeselect={hideCallout}
      >
        { currentLocation.coords.longitude === polyline[polyline.length - 1].coords.longitude
        && currentLocation.coords.latitude === polyline[polyline.length - 1].coords.latitude
          ? <FontAwesome5 name="walking" style={styles.flag} color={palette.text} />
          : <FontAwesome name="flag" style={styles.flag} color={palette.metricsTop} /> }
      </Marker>)
    }
    <Marker
      coordinate={currentLocation.coords}
      title='You are here'
      onPress={showCallout}
      onDeselect={hideCallout}
    >
      <FontAwesome5 name="walking" style={styles.flag} color="#5c2f16" />
    </Marker>
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
  flag: {
    marginBottom: 15,
    marginLeft: 10,
    fontSize: 25,
  },
});

export default Map;
