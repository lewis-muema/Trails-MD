/* eslint-disable no-plusplus */
import React, { useState, useEffect } from 'react';
import {
  StyleSheet, View, Text,
} from 'react-native';
import MapView, {
  Polyline, Marker, showCallout, hideCallout,
} from 'react-native-maps';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import moment from 'moment';
import distanceCalc from './distanceCalc';

const MiniMap = ({ locations }) => {
  const { centerOfMap, getPolylines, getTotalDistance } = distanceCalc();
  const [polys, setPolys] = useState(0);

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

  return <View style={locations.selected ? styles.mapContainerSelected : styles.mapContainer}>
    <View style={locations.selected ? styles.selectOverlay : styles.hidden}>
      <FontAwesome name="check-square" style={styles.selectOverlayIcon} size={24} color="#113231" />
    </View>
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

const styles = StyleSheet.create({
  mapContainer: {
    width: '100%',
    backgroundColor: '#faeed9',
    marginTop: 10,
    borderRadius: 10,
    padding: 5,
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowRadius: 3,
  },
  mapContainerSelected: {
    width: '100%',
    backgroundColor: '#faeed9',
    marginTop: 10,
    borderRadius: 10,
    padding: 5,
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowRadius: 3,
  },
  selectOverlay: {
    backgroundColor: '#faeed97a',
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
    borderColor: '#faeed9',
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
    marginBottom: 15,
    marginLeft: 10,
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
    color: '#113231',
  },
  mapDetailsLeftTextBottom: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 10,
    marginHorizontal: 5,
    color: '#5c2f16',
  },
  mapDetailsRightText: {
    fontSize: 28,
    fontWeight: '700',
    marginHorizontal: 5,
    color: '#113231',
  },
  hidden: {
    display: 'none',
  },
  selectOverlayIcon: {
    marginLeft: 'auto',
    marginRight: 10,
    marginTop: 10,
  },
});

export default MiniMap;
