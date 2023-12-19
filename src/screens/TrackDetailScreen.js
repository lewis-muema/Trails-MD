import React from 'react';
import {
  View, StyleSheet, Text, SafeAreaView,
} from 'react-native';


const TrackDetailScreen = () => {
  return <SafeAreaView>
    <View><Text style={styles.title}>TrackDetail Screen</Text></View>
  </SafeAreaView>;
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default TrackDetailScreen;
