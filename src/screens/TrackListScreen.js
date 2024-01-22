import React, { useState, useContext, useEffect } from 'react';
import {
  View, StyleSheet,
  Text, SafeAreaView, ImageBackground, Image, FlatList,
  TouchableOpacity, RefreshControl,
} from 'react-native';
import {
  FontAwesome, MaterialCommunityIcons, Ionicons, MaterialIcons,
} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Loader from '../components/loader';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as trackContext } from '../context/trackContext';
import { Context as locationContext } from '../context/locationContext';
import MiniMap from '../components/miniMap';

const TrackListScreen = () => {
  const navigation = useNavigation();
  const {
    validateAuth,
  } = useContext(AuthContext);
  const {
    state: {
      trails, distance, multiselect, selectCount,
    },
    fetchTracks, setMapCenter, multiSelect, clearSelect,
  } = useContext(trackContext);
  const { setMode } = useContext(locationContext);
  const [loading, setLoading] = useState(false);

  const viewTrack = (item, index) => {
    if (multiselect) {
      select(index);
    } else {
      setMapCenter(item);
      navigation.navigate('TrackDetail', { id: item.id });
    }
  };

  const select = (index) => {
    if (!loading) {
      multiSelect(trails, index, selectCount);
    }
  };

  useEffect(() => {
    validateAuth();
    navigation.addListener('focus', () => {
      setMode('create');
      fetchTracks(val => setLoading(val));
    });
  }, []);

  const onRefresh = () => {
    fetchTracks(val => setLoading(val));
  };

  return <ImageBackground source={require('../../assets/bg4.png')} resizeMode="cover" style={styles.bg}>
    <SafeAreaView>
        <Loader loading={loading} screen={false} message='Loading' />
        <View style={styles.container}>
          <View style={styles.flexRow}>
            <Image style={styles.trailsLogo} source={require('../../assets/logo.png')} />
            <View style={multiselect ? styles.actionsContainer : styles.hidden}>
              <Text style={styles.selectedTitle}>{ selectCount } trails selected</Text>
              <View style={styles.flexRow}>
                <View style={styles.actionsRow}>
                  <TouchableOpacity onPress={() => clearSelect(trails)}>
                    <MaterialIcons name="clear-all" style={styles.actionIcons} size={24} color="black" />
                    <Text style={styles.actionTitles}>Clear</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.actionsRow}>
                  <MaterialIcons name="delete" style={styles.actionIcons} size={25} color="red" />
                  <Text style={styles.actionTitles}>Delete</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.dashContainer}>
            <View style={styles.dashSectionLeft}>
              <MaterialCommunityIcons name="map-marker-distance" style={styles.dashIcons} />
              <Text style={styles.dashTitle}>Total distance : </Text>
              <Text style={styles.dashText}>
                { distance >= 1000 ? `${Math.round(distance / 100) / 10} km` : `${Math.trunc(distance)} m` }
              </Text>
            </View>
            <View style={styles.dashSectionRight}>
              <Ionicons name="trail-sign-outline" style={styles.dashIcons} />
              <Text style={styles.dashTitle}>Total trails : </Text>
              <Text style={styles.dashText}>{ trails.length }</Text>
            </View>
          </View>
          <View style={styles.joinView}>
            { !loading && trails.length === 0 ? <View style={{ alignItems: 'center' }}>
              <Image style={styles.joinImg} source={require('../../assets/follow.png')} />
              <TouchableOpacity style={styles.joinButton} onPress={() => navigation.navigate('TrackCreate')}>
                <Text style={styles.joinButtonText}>Start adding trails</Text>
                <FontAwesome style={styles.joinButtonIcon} name="hand-pointer-o" />
              </TouchableOpacity>
            </View> : null }
            <FlatList
              removeClippedSubviews={true}
              horizontal={false}
              showsVerticalScrollIndicator={false}
              data={trails}
              style={styles.miniMapContainer}
              refreshControl={
                <RefreshControl refreshing={loading} onRefresh={onRefresh} />
              }
              initialNumToRender={5}
              renderItem={({ item, index }) => <TouchableOpacity
                activeOpacity={1}
                 onPress={() => viewTrack(item, index)}
                 onLongPress={() => select(index)}>
                  <View style={styles.miniMap}>
                    <MiniMap locations={item} />
                  </View>
                </TouchableOpacity>
              }
            />
          </View>
        </View>
    </SafeAreaView>
  </ImageBackground>;
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'left',
    fontWeight: '600',
    fontFamily: 'manuscript',
    fontSize: 60,
    color: '#faeed9',
    textShadowColor: '#171717',
    textShadowOffset: { width: -2, height: 4 },
    textShadowRadius: 3,
    paddingHorizontal: 5,
  },
  superscript: {
    textAlign: 'left',
    fontFamily: 'manuscript',
    color: '#faeed9',
    textShadowColor: 'black',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 2,
  },
  joinView: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '85%',
  },
  joinImg: {
    width: 300,
    height: 250,
    resizeMode: 'contain',
  },
  joinButton: {
    width: 250,
    height: 50,
    backgroundColor: '#113231',
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#faeed9',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  dashContainer: {
    width: '100%',
    height: 30,
    marginTop: 10,
    flexDirection: 'row',
    backgroundColor: '#113231',
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#faeed9',
  },
  dashSectionLeft: {
    flex: 5,
    paddingVertical: 3,
    flexDirection: 'row',
  },
  dashSectionRight: {
    flex: 4,
    paddingVertical: 3,
    flexDirection: 'row',
  },
  dashIcons: {
    fontSize: 15,
    color: '#faeed9',
    marginLeft: 10,
  },
  dashTitle: {
    color: '#faeed9',
    fontWeight: '700',
    marginLeft: 5,
  },
  dashText: {
    color: '#faeed9',
    fontWeight: '700',
    fontSize: 17,
    marginTop: -2,
    marginLeft: 5,
  },
  joinButtonText: {
    color: '#faeed9',
    fontSize: 15,
    fontWeight: '700',
    marginRight: 5,
  },
  joinButtonIcon: {
    marginRight: -10,
    color: '#faeed9',
    fontSize: 15,
    fontWeight: '700',
  },
  logo: {
    flexDirection: 'row',
  },
  trailsLogo: {
    width: 220,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'flex-start',
    marginBottom: -15,
    marginLeft: -15,
  },
  container: {
    marginHorizontal: 20,
    height: '100%',
  },
  bg: {
    height: '100%',
  },
  miniMap: {},
  miniMapContainer: {
    width: '100%',
  },
  actionIcons: {
    fontWeight: '700',
    paddingHorizontal: 5,
  },
  flexRow: {
    flexDirection: 'row',
  },
  actionsContainer: {
    marginLeft: 'auto',
  },
  actionsRow: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#faeed97a',
    borderRadius: 10,
    height: 60,
  },
  actionTitles: {
    fontSize: 11,
    fontWeight: '900',
  },
  selectedTitle: {
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'right',
    marginHorizontal: 10,
  },
  hidden: {
    display: 'none',
  },
});

export default TrackListScreen;
