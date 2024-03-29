/* eslint-disable no-plusplus */
import React, { useContext } from 'react';
import {
  StyleSheet, View, Platform,
} from 'react-native';
import MapView, {
  Polyline, Marker, showCallout, hideCallout, PROVIDER_GOOGLE,
} from 'react-native-maps';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import distanceCalc from './distanceCalc';
import { Context as PaletteContext } from '../context/paletteContext';
import { Context as locationContext } from '../context/locationContext';

const TrailMap = ({ locations }) => {
  const { centerOfMap, getPolylines } = distanceCalc();
  const { state: { play, progress } } = useContext(locationContext);
  const center = () => {
    return centerOfMap(locations.locations, 0.01);
  };
  const { state: { palette } } = useContext(PaletteContext);
  const polylines = () => {
    return locations.locations ? getPolylines(locations.locations) : [];
  };
  if (!locations.locations) {
    return <View></View>;
  }
  return <View style={styles.mapContainer}>
    <MapView
      style={styles.map}
      initialRegion={center()}
      region={center()}
      provider={PROVIDER_GOOGLE}
      customMapStyle={palette.mapstyle}
    >
      { polylines().map((polyline, index) => <Polyline
        key={index}
        strokeWidth={4}
        strokeColor={palette.text}
        coordinates={polyline.map(loc => loc.coords)}/>)
      }
      { polylines().map((polyline, index) => <Marker
          key={index}
          coordinate={polyline[0] ? polyline[0].coords : null}
          title={`Waypoint ${index + 1} starts here`}
          onPress={showCallout}
          onDeselect={hideCallout}
          tracksViewChanges={false}
        >
          <FontAwesome name="flag" style={styles.flag} color={palette.metricsTop} />
        </Marker>)
      }
      { polylines().map((polyline, index) => <Marker
          key={index}
          coordinate={polyline[polyline.length - 1] ? polyline[polyline.length - 1].coords : null}
          title={`Waypoint ${index + 1} ends here`}
          onPress={showCallout}
          onDeselect={hideCallout}
          tracksViewChanges={false}
          >
          <FontAwesome name="flag-checkered" style={styles.flag} color={palette.metricsTop} />
          </Marker>)
      }
      { (progress > 0 || play) && locations?.locations[progress]?.coords
        ? <Marker
        coordinate={locations?.locations[progress]?.coords}
        title='You were here'
        onPress={showCallout}
        onDeselect={hideCallout}
        tracksViewChanges={Platform.OS === 'ios'}
      >
        <FontAwesome5 name="walking" style={styles.flag} color={palette.text} />
      </Marker> : null }
    </MapView>
  </View>;
};

const styles = StyleSheet.create({
  mapContainer: {
    width: '100%',
  },
  map: {
    width: '100%',
    height: 500,
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
    marginBottom: 0,
    marginLeft: 15,
    fontSize: 20,
  },
});

export default TrailMap;
