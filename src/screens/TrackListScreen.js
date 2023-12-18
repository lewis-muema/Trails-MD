import React from 'react';
import {
  View, StyleSheet, Text, Button,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const TrackListScreen = () => {
  const navigation = useNavigation();
  return <View>
      <Text style={styles.title}>Hi</Text>
      <Button title='Track details' onPress={() => navigation.navigate('TrackDetail')} />
    </View>;
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default TrackListScreen;
