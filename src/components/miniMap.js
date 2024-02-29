/* eslint-disable no-plusplus */
import React, { useState, useContext, useEffect } from 'react';
import {
  StyleSheet, View, Text,
} from 'react-native';
import MapView, {
  Polyline, Marker, showCallout, hideCallout, PROVIDER_GOOGLE,
} from 'react-native-maps';
import { FontAwesome } from '@expo/vector-icons';
import moment from 'moment';
import distanceCalc from './distanceCalc';
import { Context as PaletteContext } from '../context/paletteContext';

const MiniMap = ({ locations }) => {
  const { centerOfMap, getPolylines, getTotalDistance } = distanceCalc();
  const [polys, setPolys] = useState(0);
  const { state: { palette } } = useContext(PaletteContext);

  const center = () => {
    return centerOfMap(locations.locations, 0.008);
  };
  const polylines = () => {
    return getPolylines(locations.locations);
  };

  const getDistance = () => {
    const totalDist = getTotalDistance(polylines());
    setPolys(totalDist);
  };

  useEffect(() => {
    getDistance();
  }, []);

  const styles = paletteStyles(palette);

  return <View style={locations.selected ? styles.mapContainerSelected : styles.mapContainer}>
    <FontAwesome name="check-square" style={locations.selected ? styles.selectOverlayIcon : styles.hidden} size={24} color={palette.text} />
    <View style={locations.selected ? styles.selectOverlay : styles.hidden}>
    </View>
    <MapView
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      initialRegion={center()}
      region={center()}
      customMapStyle={palette.mapstyle}
      liteMode={true}
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
    <View style={styles.mapDetails}>
      <View>
        <Text style={styles.mapDetailsLeftTextTop}>{ locations.name }</Text>
        <Text style={styles.mapDetailsLeftTextBottom}>
          { moment(locations.locations[0].timestamp).format('MMMM Do, YYYY HH:mm a') }
        </Text>
      </View>
      <View style={styles.mapDetailsRight}>
        <Text style={styles.mapDetailsRightText}>
          { polys >= 1000 ? `${Math.round(polys / 100) / 10}km` : `${Math.trunc(polys)}m` }
        </Text>
      </View>
    </View>
  </View>;
};

const paletteStyles = palette => StyleSheet.create({
  mapContainer: {
    width: '100%',
    backgroundColor: palette.background,
    marginTop: 10,
    borderRadius: 10,
    padding: 5,
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowRadius: 3,
  },
  mapContainerSelected: {
    width: '100%',
    backgroundColor: palette.background,
    marginTop: 10,
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
    height: 150,
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
  mapDetails: {
    flexDirection: 'row',
  },
  mapDetailsRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    flex: 1,
  },
  mapDetailsLeftTextTop: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 10,
    marginHorizontal: 5,
    color: palette.text,
  },
  mapDetailsLeftTextBottom: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 10,
    marginHorizontal: 5,
    color: palette.metricsBottom,
  },
  mapDetailsRightText: {
    fontSize: 28,
    fontWeight: '700',
    marginHorizontal: 5,
    color: palette.text,
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
