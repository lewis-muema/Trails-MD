/* eslint-disable no-plusplus */
import React from 'react';
import {
  StyleSheet, View,
} from 'react-native';
import MapView, {
  Polyline, Marker, showCallout, hideCallout,
} from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import distanceCalc from './distanceCalc';

const TrailMap = ({ locations, mapCenter }) => {
  const { centerOfMap, getPolylines } = distanceCalc();
  const center = () => {
    return locations.locations
      ? centerOfMap(locations.locations, 0.01)
      : mapCenter;
  };
  const polylines = () => {
    return locations.locations ? getPolylines(locations.locations) : [];
  };

  return <View style={styles.mapContainer}>
    <MapView
      style={styles.map}
      initialRegion={center()}
      region={center()}
    >
      { polylines().map((polyline, index) => <Polyline
        key={index}
        strokeWidth={4}
        strokeColor="#113231"
        coordinates={polyline.map(loc => loc.coords)}/>)
      }
      { polylines().map((polyline, index) => <Marker
          key={index}
          coordinate={polyline[0] ? polyline[0].coords : null}
          title={`Waypoint ${index + 1} starts here`}
          onPress={showCallout}
          onDeselect={hideCallout}
        >
          <Ionicons name="md-flag-sharp" style={styles.flag} color="green" />
        </Marker>)
      }
      { polylines().map((polyline, index) => <Marker
          key={index}
          coordinate={polyline[polyline.length - 1] ? polyline[polyline.length - 1].coords : null}
          title={`Waypoint ${index + 1} ends here`}
          onPress={showCallout}
          onDeselect={hideCallout}>
            <Ionicons name="md-flag-sharp" style={styles.flag} color="red" />
          </Marker>)
      }
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
    marginBottom: 15,
    marginLeft: 10,
    fontSize: 20,
  },
});

export default TrailMap;
