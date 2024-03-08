import React, { useState, useContext, useEffect } from 'react';
import {
  View, StyleSheet,
  Text, SafeAreaView, ImageBackground, Image, FlatList,
  TouchableOpacity, RefreshControl, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  FontAwesome, MaterialCommunityIcons, Ionicons, MaterialIcons,
} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import Loader from '../components/loader';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as trackContext } from '../context/trackContext';
import { Context as locationContext } from '../context/locationContext';
import { Context as PaletteContext } from '../context/paletteContext';
import Banner from '../components/banner';
import Spacer from '../components/Spacer';
import TrackList from '../components/trackList';
import TrackThemeBottom from '../components/singleTrack';

const TrackListScreen = () => {
  const navigation = useNavigation();
  const {
    validateAuth,
  } = useContext(AuthContext);
  const { state: { palette, background, fontsLoaded } } = useContext(PaletteContext);
  const {
    state: {
      trails, distance, multiselect, selectCount, success, error,
    },
    fetchTracks, setMapCenter, multiSelect, clearSelect, deleteManyTracks,
  } = useContext(trackContext);
  const [loading, setLoading] = useState(false);
  const [offline, setOffline] = useState('');

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

  const confirmDelete = () => {
    Alert.alert(
      `Delete ${selectCount} trails`,
      `This action is irresverible. Are you sure you want to delete these ${selectCount} trails?`, [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => deleteManyTracks(val => setLoading(val), trails, offline),
          style: 'destructive',
        },
      ],
    );
  };

  useEffect(() => {
    validateAuth();
    navigation.addListener('focus', async () => {
      const value = await AsyncStorage.getItem('offline');
      setOffline(value);
      await AsyncStorage.setItem('mode', 'create');
      fetchTracks(val => setLoading(val), value);
    });
  }, []);

  const styles = paletteStyles(palette, fontsLoaded);

  const onRefresh = () => {
    fetchTracks(val => setLoading(val), offline);
  };

  return <ImageBackground source={background.image} resizeMode="cover" style={styles.bg}>
    <Spacer></Spacer>
    <Spacer></Spacer>
    <SafeAreaView>
        <Loader offset={true} loading={loading} screen={false} message='' centre={true} />
        <View style={styles.container}>
          <View style={styles.flexRow}>
            <View style={styles.trailsLogoCont}>
              <Svg
                style={styles.trailsLogoBG}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 300 120"
                fill={palette.background}
              >
                <Path d="M256 31.9c-1.4 2.7-1.3 14.4.2 15.9.8.8 4.7 1.2 11 1.2 8.6 0 10-.2 11.9-2.1 1.8-1.8 2.1-3 1.7-7.5-.7-8.4-2.1-9.4-13.9-9.4-8.7 0-9.9.2-10.9 1.9zM223.4 34.4c-2.7 1.4-6.3 4-8 5.7-2.6 2.7-3 3.9-3.5 11.7-.7 10.1.4 13.3 6.3 18 4.1 3.2 4 4.2-.3 4.2-3.1 0-5.2 2.4-6.3 7.3-.5 2.2-1.1 2.7-2.4 2.2-.9-.4-2.7-1-3.9-1.2-2.1-.5-2.2-1-1.8-7.7.2-3.9.3-7.8.3-8.6-.1-.8-.2-7.7-.3-15.3-.1-16.2-.1-16.2-11.1-17.2-8.1-.8-12.1.4-12.6 3.6-.4 3.2-2.3 3.4-3.6.4-1.2-2.5-1.3-2.5-9.4-2-12.2.9-12.6 1-13.3 4.8-.4 1.8-.8 14.3-.9 27.7-.2 13.5-.5 24.7-.6 25-.3.8-4.9-28-5.6-35.8-.4-3.9-1-7.2-1.4-7.2-.5 0-1.1-2.8-1.5-6.3-1.1-9.9-.9-9.7-13.3-9.7-13.7 0-17.5 1.6-18 7.6-.1 2.2-.7 6.4-1.3 9.4-.6 3-1.5 10.2-1.9 16-.5 5.8-1.5 13.4-2.3 17-1.4 6.3-1.5 6.4-1.6 2.2 0-2.4-.6-7.4-1.2-11.3-.7-4.8-.7-7.9 0-10.2 1.3-4 1.6-13 .6-18.2-.9-4.6-4.6-9.2-9.2-11.1-3.9-1.7-24.8-1.9-29-.4-1.5.6-3.4 1.8-4 2.7-1.2 1.5-1.4 1.5-3.1 0-1.6-1.4-4.7-1.7-19.2-2-13.5-.2-17.6 0-18.7 1.1-1.9 2-1.8 18.5.2 20.2.8.7 2.2.9 3.1.6 3.5-1.3 4.3 2.1 3.7 15.9-.3 7.2-.2 16.6.1 20.8.9 9.3 1.5 9.7 12.6 10.2 6.1.3 8.1.1 9.1-1.1.9-1.1 1.3-7.4 1.3-23.7l.1-22.2 3-.3c3.9-.5 5.3-1.7 5.8-5 .2-1.5.5 1.4.6 6.5 0 5.2-.3 9.4-.9 9.8-1.3.8-1.3 5.2 0 6 .6.4 1 6 1 13.4 0 9.7.3 13.1 1.4 14 1.6 1.3 13.8 3 17.2 2.3 1.4-.2 2.7-.8 3-1.3.3-.5 1.9-.2 3.5.7 3.5 1.8 12.9 1.1 16.5-1.1 1.2-.8 2.5-1 3-.5s4.8 1.2 9.6 1.6c8.5.6 8.7.6 11.1-2 2-2.1 2.6-2.4 3.6-1.2.6.7 4.4 1.8 8.4 2.4 6.2 1 8.6 1.1 13 .3.4 0 .7-.9.7-1.8 0-1.4.5-1.2 2.5 1 2.4 2.5 3.1 2.7 11.3 2.7 5.5 0 9.2-.4 10-1.2.7-.7 1.2-4.6 1.3-10.3 0-4.9.5-9.9 1-11 .6-1.4.8.1.4 4.9-.6 8.5 1.6 16.4 4.9 17.1 3.9 1 25.6-.1 26.8-1.3.6-.6 1.1-3.9 1.1-7.4 0-3.5.2-5.2.4-3.8.8 4.9 2.5 8 4.4 8 1.1 0 3.8 1.2 6.2 2.7 5.3 3.4 17.4 4.6 19.6 1.9.7-.9 1.9-1.6 2.7-1.6 2.2 0 8.2-8.3 9.4-13 .7-2.5 1.5-7 1.9-10 .7-4.9.5-6-1.7-9.5-2.7-4.2-5.5-6.8-10.6-9.8l-3.1-1.9 2.9.5c5.2.9 8.3-.9 8.9-5.1 1.3-8.2-2.4-16.7-8.6-19.8-1.7-.9-5.8-1.9-9.2-2.1-5-.4-6.8 0-11.1 2.1zM62 43.1c0 1.1-.4 1.8-1 1.4-.5-.3-.7-1.2-.3-2 .7-2.1 1.3-1.9 1.3.6zm116.7 18.6c-.2 2.7-.3.5-.3-4.7s.1-7.4.3-4.8c.2 2.7.2 6.9 0 9.5zm0 12c-.4.3-.7 0-.7-.7s.3-1 .7-.7c.3.4.3 1 0 1.4zM242.5 93c.3.5.4 1 .1 1-.3 0-.8-.5-1.1-1-.3-.6-.4-1-.1-1 .3 0 .8.4 1.1 1z" />
              </Svg>
              <Text style={styles.trailsLogoText}>TRAILS</Text>
              <Text style={styles.trailsLogoMD}>MD</Text>
            </View>
            <View style={multiselect ? styles.actionsContainer : styles.hidden}>
              <Text style={styles.selectedTitle}>{ selectCount } trails selected</Text>
              <View style={styles.flexRow}>
                <View style={styles.actionsRow}>
                  <TouchableOpacity onPress={() => clearSelect(trails, offline)}>
                    <MaterialIcons name="clear-all" style={styles.actionIcons} size={24} color="black" />
                    <Text style={styles.actionTitles}>Clear</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    onPress={() => confirmDelete()}
                  >
                    <MaterialIcons name="delete" style={styles.actionIcons} size={25} color="red" />
                    <Text style={styles.actionTitles}>Delete</Text>
                  </TouchableOpacity>
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
            { !loading && trails.length === 0 ? <View style={styles.joinViewBanner}>
              <Image style={styles.joinImg} source={require('../../assets/follow.png')} />
              <TouchableOpacity style={styles.joinButton} onPress={() => navigation.navigate('TrackCreate')}>
                <Text style={styles.joinButtonText}>Start adding trails</Text>
                <FontAwesome style={styles.joinButtonIcon} name="hand-pointer-o" />
              </TouchableOpacity>
            </View> : null }
            <TrackList trails={trails}
              loading={loading}
              onRefresh={() => onRefresh()}
              viewTrack={(item, index) => viewTrack(item, index)}
              select={index => select(index)} />
            { error ? <View style={styles.error}>
              <Banner message={error} type='error'></Banner>
              </View> : null
            }
            { success ? <View style={styles.error}>
              <Banner message={success} type='success'></Banner>
              </View> : null
            }
          </View>
        </View>
    </SafeAreaView>
  </ImageBackground>;
};

const paletteStyles = (palette, fontsLoaded) => StyleSheet.create({
  title: {
    textAlign: 'left',
    fontWeight: '600',
    fontFamily: 'manuscript',
    fontSize: 60,
    color: palette.background,
    textShadowColor: '#171717',
    textShadowOffset: { width: -2, height: 4 },
    textShadowRadius: 3,
    paddingHorizontal: 5,
  },
  superscript: {
    textAlign: 'left',
    fontFamily: 'manuscript',
    color: palette.background,
    textShadowColor: 'black',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 2,
  },
  joinView: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '82%',
    zIndex: 1000,
  },
  joinViewBanner: {
    paddingTop: '35%',
    alignItems: 'center',
  },
  joinImg: {
    width: 300,
    height: 250,
    resizeMode: 'contain',
  },
  joinButton: {
    width: 250,
    height: 50,
    backgroundColor: palette.text,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: palette.background,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  dashContainer: {
    width: '100%',
    height: 30,
    marginTop: 10,
    flexDirection: 'row',
    backgroundColor: palette.text,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: palette.background,
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
    color: palette.background,
    marginLeft: 10,
  },
  dashTitle: {
    color: palette.background,
    fontWeight: '700',
    marginLeft: 5,
  },
  dashText: {
    color: palette.background,
    fontWeight: '700',
    fontSize: 17,
    marginTop: -2,
    marginLeft: 5,
  },
  joinButtonText: {
    color: palette.background,
    fontSize: 15,
    fontWeight: '700',
    marginRight: 5,
  },
  joinButtonIcon: {
    marginRight: -10,
    color: palette.background,
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
  miniMap: {
    pointerEvents: 'none',
  },
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
    backgroundColor: palette.background,
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
  error: {
    marginHorizontal: 30,
    position: 'absolute',
    bottom: 30,
    width: '85%',
    alignSelf: 'center',
  },
  trailsLogoCont: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    display: fontsLoaded ? 'grid' : 'none',
    position: 'relative',
  },
  trailsLogoText: {
    fontFamily: fontsLoaded ? 'manuscript-font' : '',
    fontSize: 80,
    color: palette.text,
  },
  trailsLogoMD: {
    fontFamily: fontsLoaded ? 'manuscript-font' : '',
    fontSize: 18,
    marginTop: 6,
    marginLeft: 2,
    letterSpacing: 1,
    color: palette.text,
  },
  trailsLogoBG: {
    position: 'absolute',
    height: '140%',
    width: '130%',
    top: '-27%',
    left: '-15%',
  },
});

export default TrackListScreen;
