/* eslint-disable arrow-body-style */
import React, { useContext } from 'react';
import {
  View, StyleSheet, Text, Button, SafeAreaView,
} from 'react-native';
import { Context as AuthContext } from '../context/AuthContext';


const AccountScreen = () => {
  const { signout } = useContext(AuthContext);

  return <SafeAreaView>
    <View>
      <Text style={styles.title}>Account Screen</Text>
      <Button title='Sign Out' onPress={() => signout()}></Button>
    </View>
   </SafeAreaView>;
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default AccountScreen;
