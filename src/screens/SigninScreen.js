import React from 'react';
import {
  View, StyleSheet, Text, Button,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SigninScreen = () => {
  const navigation = useNavigation();

  return <View>
      <Text style={styles.title}>Signin Screen</Text>
      <Button title='Log in' onPress={() => navigation.navigate('Home', { screen: 'Tracks' })} />
      <Button title='Sign up' onPress={() => navigation.navigate('Signup')} />
    </View>;
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default SigninScreen;
