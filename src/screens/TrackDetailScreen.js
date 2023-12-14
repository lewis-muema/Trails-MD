import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const TrackDetailScreen = () => {
  return <View><Text style={styles.title}>TrackDetail Screen</Text></View>;
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default TrackDetailScreen;
