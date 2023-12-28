import React, { useContext, useEffect } from 'react';
import {
  View, StyleSheet, Text, Button, SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Context as AuthContext } from '../context/AuthContext';

const TrackListScreen = () => {
  const navigation = useNavigation();
  const {
    validateAuth,
  } = useContext(AuthContext);

  useEffect(() => {
    validateAuth();
  }, []);

  return <SafeAreaView>
    <View>
      <Text style={styles.title}>Hi</Text>
      <Button title='Track details' onPress={() => navigation.navigate('TrackDetail')} />
    </View>
  </SafeAreaView>;
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default TrackListScreen;
