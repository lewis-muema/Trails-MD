import React from 'react';
import {
  View, StyleSheet, Text, Button,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SignupScreen = () => {
  const navigation = useNavigation();

  return <View>
      <Text style={styles.title}>Signup Screen</Text>
      <Button title='Sign in' onPress={() => navigation.navigate('Signin')} />
    </View>;
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default SignupScreen;
