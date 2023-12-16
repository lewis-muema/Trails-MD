import React, { useState } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Image, Alert,
} from 'react-native';
import { Text, Input, Button } from 'react-native-elements';
import {
  MaterialCommunityIcons, FontAwesome5, AntDesign, Entypo,
} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Spacer from '../components/Spacer';

const baseColor = '#316429';

const SignupScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [securePass, setSecurePass] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const [emailErr, setEmailErr] = useState('');
  const [passErr, setPassErr] = useState('');

  const emailValidator = () => {
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailErr('Invalid email');
      return true;
    }
    setEmailErr('');
    return false;
  };

  const passwordValidator = () => {
    if (password !== confirm) {
      setPassErr('This password doesnt match the one above');
      return true;
    }
    setPassErr('');
    return false;
  };

  const signup = () => {
    if (emailValidator() || passwordValidator()) {
      Alert.alert('Validation Error', 'Please make sure the email and password are correct', [
        { text: 'OK', onPress: () => {} },
      ]);
    } else {
      // sign up
    }
  };

  return <View style={styles.container}>
    <Spacer />
      <Image style={styles.trailsLogo} source={require('../../assets/hiking.png')} />
      <View style={styles.inputContainer}>
        <Input
        label='Email'
        value={email}
        onChangeText={val => setEmail(val.toLowerCase())}
        onBlur={emailValidator}
        errorMessage={emailErr}
        labelStyle={styles.label}
        inputStyle={styles.inputTextSytle}
        leftIcon={
          <FontAwesome5 name="user" size={18} color={baseColor} />
        } />
      </View>
      <View style={styles.inputContainer}>
        <Input
        label='Password'
        value={password}
        onChangeText={val => setPassword(val)}
        labelStyle={styles.label}
        inputStyle={styles.inputTextSytle}
        secureTextEntry={securePass}
        leftIcon={
          <MaterialCommunityIcons name="form-textbox-password" size={18} color={baseColor} />
        }
        rightIcon={
          securePass
            ? <TouchableOpacity onPress={() => setSecurePass(!securePass)}>
            <Entypo name="eye-with-line" size={18} color={baseColor} />
            </TouchableOpacity>
            : <TouchableOpacity onPress={() => setSecurePass(!securePass)}>
            <AntDesign name="eye" size={18} color={baseColor} />
            </TouchableOpacity>
        }
      />
      </View>
      <View style={styles.inputContainer}>
        <Input
        label='Confirm password'
        value={confirm}
        onChangeText={val => setConfirm(val)}
        onBlur={passwordValidator}
        errorMessage={passErr}
        labelStyle={styles.label}
        inputStyle={styles.inputTextSytle}
        secureTextEntry={secureConfirm}
        leftIcon={
          <MaterialCommunityIcons name="form-textbox-password" size={18} color={baseColor} />
        }
        rightIcon={
          secureConfirm
            ? <TouchableOpacity onPress={() => setSecureConfirm(!secureConfirm)}>
              <Entypo name="eye-with-line" size={18} color={baseColor} />
              </TouchableOpacity>
            : <TouchableOpacity onPress={() => setSecureConfirm(!secureConfirm)}>
              <AntDesign name="eye" size={18} color={baseColor} />
              </TouchableOpacity>
        }
      />
      </View>
      <Spacer />
      <Spacer>
        <Button
        title='Sign Up'
        buttonStyle={styles.signupButton}
        titleStyle={styles.signupButtonText}
        loading={false}
        onPress={() => signup()}
      />
      </Spacer>
      <Spacer>
        <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
          <Text style={styles.signin}>Sign in instead?</Text>
        </TouchableOpacity>
      </Spacer>
    </View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#a9d58780',
  },
  title: {
    textAlign: 'center',
    fontWeight: '600',
  },
  trailsLogo: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 50,
  },
  label: {
    color: baseColor,
    fontSize: 14,
  },
  inputContainer: {
    width: '90%',
    alignSelf: 'center',
  },
  inputTextSytle: {
    marginLeft: 10,
  },
  signin: {
    textAlign: 'center',
    color: baseColor,
    fontSize: 16,
    fontWeight: '600',
  },
  signupButton: {
    backgroundColor: baseColor,
    borderRadius: 10,
    width: '60%',
    alignSelf: 'center',
    fontSize: 14,
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SignupScreen;
