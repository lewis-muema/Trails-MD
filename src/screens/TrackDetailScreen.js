import React, {
  useState, useEffect, useContext, useRef,
} from 'react';
import {
  View, StyleSheet, Text, Animated, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import {
  FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons, AntDesign,
} from '@expo/vector-icons';
import { Context as locationContext } from '../context/locationContext';
import { Context as trackContext } from '../context/trackContext';
import Loader from '../components/loader';
import LineChart from '../components/lineChart';
import TrailMap from '../components/trailMap';
import useSaveTrack from '../hooks/useSaveTrack';

const H_MAX_HEIGHT = 500;
const H_MIN_HEIGHT = 50;
const H_SCROLL_DISTANCE = H_MAX_HEIGHT - H_MIN_HEIGHT;

const TrackDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('Loading');
  const [saveTrack, error, success, saveTrail, editTrack] = useSaveTrack();
  const {
    state: {
      trail, mapCenter, distance, time, avgPace,
    }, fetchOneTrack, deleteTrack,
  } = useContext(trackContext);
  const { setMode } = useContext(locationContext);

  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const headerScrollHeight = scrollOffsetY.interpolate({
    inputRange: [0, H_SCROLL_DISTANCE],
    outputRange: [H_MAX_HEIGHT, H_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const confirmDelete = () => {
    setMessage('Deleting');
    Alert.alert(
      `Delete ${trail?.name}`,
      `Are you sure you want to delete ${trail?.name}?`, [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => deleteTrack(val => setLoading(val), route.params.id, () => navigation.navigate('TrackList')),
          style: 'destructive',
        },
      ],
    );
  };

  const edit = () => {
    editTrack();
    navigation.navigate('TrackCreate');
  };

  useEffect(() => {
    navigation.addListener('focus', () => {
      setMode('create');
      fetchOneTrack(val => setLoading(val), route.params.id);
    });
  }, []);
  return <View style={styles.detailsContainer}>
      <ScrollView
        onScroll={Animated.event([
          { nativeEvent: { contentOffset: { y: scrollOffsetY } } },
        ], { useNativeDriver: false })}
        scrollEventThrottle={16}
      >
        <View style={{ paddingTop: H_MAX_HEIGHT }}>
          { trail?.locations ? <View style={styles.detailsBottomContainer}>
            <View style={styles.mapDetails}>
              <View>
                <Text style={styles.mapDetailsLeftTextTop}>{ trail.name }</Text>
                <Text style={styles.mapDetailsLeftTextBottom}>
                  { moment(trail?.locations[0]?.timestamp).format('MMMM Do, YYYY HH:mm a') }
                </Text>
              </View>
              <View style={styles.mapDetailsRight}>
                <Text style={styles.mapDetailsRightText}>
                  { distance >= 1000 ? `${Math.round(distance / 100) / 10}km` : `${Math.trunc(distance)}m` }
                </Text>
              </View>
            </View>
            <View style={styles.paceRow}>
              <View>
                <View style={styles.timeRow}>
                  <FontAwesome name="clock-o" size={20} color="#113231" />
                  <Text style={styles.timeTaken}>
                    Duration: { moment.duration({ seconds: time / 1000 }).humanize() }
                  </Text>
                </View>
              </View>
              <View style={styles.paceColRight}>
                <View style={styles.timeRow}>
                    <MaterialIcons name="shutter-speed" size={20} color="#113231" />
                    <Text style={styles.timeTaken}>
                      Average pace: {
                      Math.floor(avgPace)
                      }'{ Math.trunc((avgPace % 1) * 100)
                      }{ avgPace > 0 ? '"' : '' }
                    </Text>
                  </View>
              </View>
            </View>
              <View style={styles.timeRow}>
                <Ionicons name="speedometer" size={20} color="#113231" />
                <Text style={styles.timeTaken}>
                  Speed (km/h)
                </Text>
              </View>
              <LineChart data={trail} field={'speed'} />
            <View>
              <View style={styles.timeRow}>
                <MaterialCommunityIcons name="elevation-rise" size={20} color="#113231" />
                <Text style={styles.timeTaken}>Elevation (m)</Text>
              </View>
              <LineChart data={trail} field={'altitude'} />
            </View>
          </View> : null }
        </View>
      </ScrollView>
      <Animated.View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: headerScrollHeight,
          width: '100%',
          overflow: 'hidden',
        }}
        >
          <View style={styles.outerContainer}>
            <View style={styles.mapContainer}>
              { loading || trail.locations === undefined
                ? <Loader loading={loading} screen={true} message={ message } centre={true}/>
                : null }
              <TrailMap locations={trail} mapCenter={mapCenter} />
              <View style={styles.actionsMenu}>
                <TouchableOpacity onPress={() => edit()}>
                  <AntDesign name="edit" style={styles.actionIcons} size={25} color="#113231" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => confirmDelete()}>
                  <MaterialIcons name="delete" style={styles.actionIcons} size={25} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
      </Animated.View>
    </View>;
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontWeight: '600',
  },
  bg: {
    height: '100%',
  },
  outerContainer: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'black',
    bottom: 0,
  },
  mapContainer: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    justifyContent: 'center',
    bottom: 0,
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: '#faeed9',
  },
  detailsBottomContainer: {
    width: '100%',
    padding: 15,
    backgroundColor: '#faeed9',
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
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 5,
  },
  timeTaken: {
    fontSize: 15,
    fontWeight: '700',
    marginHorizontal: 5,
    color: '#113231',
  },
  paceRow: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  paceColRight: {
    marginLeft: 'auto',
  },
  actions: {
    position: 'absolute',
    top: 70,
    right: 25,
    backgroundColor: '#113231',
    padding: 10,
    borderRadius: 20,
  },
  actionsMenu: {
    position: 'absolute',
    top: 70,
    right: 25,
    backgroundColor: '#faeed9',
    borderRadius: 20,
    flexDirection: 'row',
  },
  actionIcons: {
    fontWeight: '700',
    padding: 10,
  },
});

export default TrackDetailScreen;
