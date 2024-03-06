/* eslint-disable no-plusplus */
import React, { useState, useContext, useEffect } from 'react';
import {
  StyleSheet, View, Text, FlatList, TouchableOpacity,
} from 'react-native';
import MapView, {
  Polyline, Marker, showCallout, hideCallout, PROVIDER_GOOGLE,
} from 'react-native-maps';
import { FontAwesome } from '@expo/vector-icons';
import distanceCalc from './distanceCalc';
import { Context as PaletteContext } from '../context/paletteContext';

const MiniMap = ({ locations }) => {
  const { centerOfMap, getPolylines } = distanceCalc();
  const { state: { palette } } = useContext(PaletteContext);

  const center = () => {
    return centerOfMap(locations.locations, 0.008);
  };
  const polylines = () => {
    return getPolylines(locations.locations);
  };

  const styles = paletteStyles(palette);

  return <View style={styles.mapContainer}>
    <MapView
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      initialRegion={center()}
      region={center()}
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
          tracksViewChanges={false}>
            <FontAwesome name="flag" style={styles.flag} color={palette.metricsTop} />
          </Marker>)
      }
    </MapView>
  </View>;
};

const paletteStyles = palette => StyleSheet.create({
  mapContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: palette.background,
    borderRadius: 10,
    padding: 5,
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowRadius: 3,
  },
  selectOverlay: {
    backgroundColor: palette.background,
    opacity: 0.3,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 5,
    zIndex: 1000,
  },
  map: {
    pointerEvents: 'none',
    width: '100%',
    height: '40%',
    borderWidth: 2,
    borderColor: palette.background,
    borderRadius: 10,
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
  hidden: {
    display: 'none',
  },
  selectOverlayIcon: {
    right: 10,
    top: 10,
    position: 'absolute',
    zIndex: 2000,
  },
});

export default MiniMap;
