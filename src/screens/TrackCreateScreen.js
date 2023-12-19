import React from 'react';
import {
  View, StyleSheet, Text, SafeAreaView,
} from 'react-native';

const TrackCreateScreen = () => {
  return <SafeAreaView>
    <View><Text style={styles.title}>TrackCreate Screen</Text></View>
  </SafeAreaView>;
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default TrackCreateScreen;
