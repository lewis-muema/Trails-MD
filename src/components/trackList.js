import {
  View, StyleSheet, FlatList,
  TouchableOpacity, RefreshControl,
} from 'react-native';
import MiniMap from './miniMap';

const TrackList = ({
  trails, loading, onRefresh, viewTrack, select,
}) => {
  return <FlatList
    removeClippedSubviews={true}
    horizontal={false}
    showsVerticalScrollIndicator={false}
    data={trails}
    style={styles.miniMapContainer}
    refreshControl={
      <RefreshControl refreshing={loading} onRefresh={() => onRefresh()} />
    }
    initialNumToRender={3}
    renderItem={({ item, index }) => <TouchableOpacity
      activeOpacity={1}
        onPress={() => viewTrack(item, index)}
        onLongPress={() => select(index)}>
        <View style={styles.miniMap}>
          <MiniMap locations={item} />
        </View>
      </TouchableOpacity>
    }
  />;
};

const styles = StyleSheet.create({
  miniMap: {
    pointerEvents: 'none',
  },
  miniMapContainer: {
    width: '100%',
  },
});

export default TrackList;
