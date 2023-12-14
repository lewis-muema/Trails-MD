/* eslint-disable arrow-body-style */
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const AccountScreen = () => {
  return <View><Text style={styles.title}>Account Screen</Text></View>;
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default AccountScreen;
