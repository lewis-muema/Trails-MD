import React, { useState, useContext } from 'react';
import {
  View, StyleSheet, FlatList, Text,
  TouchableOpacity, RefreshControl,
} from 'react-native';
import moment from 'moment';
import MiniMap from './singleMiniMap';
import distanceCalc from './distanceCalc';
import { Context as PaletteContext } from '../context/paletteContext';

const TrackThemeBottom = ({
  trails, loading, onRefresh, viewTrack, select,
}) => {
  const [activeMap, setActiveMap] = useState(0);
  const { state: { palette } } = useContext(PaletteContext);
  const { getPolylines, getTotalDistance } = distanceCalc();

  const polylinesDistances = (loc) => {
    const poly = getPolylines(loc);
    const totalDist = getTotalDistance(poly);
    return totalDist;
  };
  const trail = () => {
    if (trails[activeMap]) {
      return [trails[activeMap]];
    }
    return [];
  };
  const styles = paletteStyles(palette);

  return <View style={styles.miniMap}>
    <FlatList
      removeClippedSubviews={true}
      horizontal={false}
      showsVerticalScrollIndicator={false}
      data={trail()}
      style={styles.miniMapContainer}
      contentContainerStyle={styles.miniMapContent}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={() => onRefresh()} />
      }
      renderItem={({ item, index }) => <MiniMap locations={item} />
      }
    />
    <FlatList
      removeClippedSubviews={true}
      horizontal={false}
      showsVerticalScrollIndicator={false}
      data={trails}
      style={styles.miniMapList}
      renderItem={({ item, index }) => <TouchableOpacity
        activeOpacity={1}
          onPress={() => viewTrack(item, index)}
          onLongPress={() => select(index)}>
          <View style={styles.mapDetails}>
            <View>
              <Text style={styles.mapDetailsLeftTextTop}>{ item.name }</Text>
              <Text style={styles.mapDetailsLeftTextBottom}>
                { moment(item.locations[0].timestamp).format('MMMM Do, YYYY hh:mm a') }
              </Text>
            </View>
            <View style={styles.mapDetailsRight}>
              <Text style={styles.mapDetailsRightText}>
                { polylinesDistances(item.locations) >= 1000 ? `${Math.round(polylinesDistances(item.locations) / 100) / 10}km` : `${Math.trunc(polylinesDistances(item.locations))}m` }
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      }
    />
  </View>;
};

const paletteStyles = palette => StyleSheet.create({
  miniMap: {
    width: '100%',
    height: '100%',
    marginTop: 10,
  },
  miniMapContainer: {
    width: '100%',
    height: '95%',
  },
  miniMapContent: {
    flex: 1,
    justifyContent: 'stretch',
  },
  miniMapList: {
    position: 'absolute',
    width: '100%',
    height: '60%',
    bottom: 0,
    backgroundColor: palette.background,
  },
  mapDetails: {
    flexDirection: 'row',
    borderWidth: 3,
    borderColor: palette.text,
    height: 80,
    backgroundColor: palette.background,
    margin: 5,
    borderRadius: 10,
    position: 'relative',
  },
  mapDetailsRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    flex: 1,
  },
  mapDetailsLeftTextTop: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 'auto',
    marginHorizontal: 5,
    color: palette.text,
  },
  mapDetailsLeftTextBottom: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 'auto',
    marginHorizontal: 5,
    color: palette.metricsBottom,
  },
  mapDetailsRightText: {
    fontSize: 28,
    fontWeight: '700',
    marginHorizontal: 5,
    color: palette.text,
  },
});

export default TrackThemeBottom;
