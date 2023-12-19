import React, { useState, useContext, useEffect } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Image,
} from 'react-native';
import { Text, Input, Button } from 'react-native-elements';
import {
  MaterialCommunityIcons, FontAwesome5, AntDesign, Entypo,
} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Spacer from '../components/Spacer';
import Banner from '../components/banner';
import { Context as AuthContext } from '../context/AuthContext';

const baseColor = '#316429';
const emailRef = React.createRef();
const passRef = React.createRef();

const SigninScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securePass, setSecurePass] = useState(true);
  const [emailErr, setEmailErr] = useState('');
  const [loading, setLoading] = useState(false);
  const {
    state, signin, clearErrors, validateAuth,
  } = useContext(AuthContext);

  const emailValidator = () => {
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailErr('Invalid email');
      emailRef.current.shake();
      return true;
    }
    setEmailErr('');
    return false;
  };

  const signinCTA = () => {
    if (emailValidator()) {
      emailValidator();
    } else {
      setLoading(true);
      signin({ email, password }, val => setLoading(val));
    }
  };

  useEffect(() => {
    validateAuth();
    navigation.addListener('focus', () => {
      clearErrors();
      setEmail('');
      setPassword('');
    });
  }, []);

  return <View style={styles.container}>
    <Spacer />
      <Image style={styles.trailsLogo} source={require('../../assets/hiking.png')} />
      <View style={styles.inputContainer}>
        <Input
        ref={emailRef}
        label='Email'
        value={email}
        onChangeText={val => setEmail(val)}
        onBlur={emailValidator}
        errorMessage={emailErr}
        labelStyle={styles.label}
        inputStyle={styles.inputTextSytle}
        autoCapitalize='none'
        autoCorrect={false}
        leftIcon={
          <FontAwesome5 name="user" size={18} color={baseColor} />
        } />
      </View>
      <View style={styles.inputContainer}>
        <Input
        ref={passRef}
        label='Password'
        value={password}
        onChangeText={val => setPassword(val)}
        labelStyle={styles.label}
        inputStyle={styles.inputTextSytle}
        secureTextEntry={securePass}
        autoCapitalize='none'
        autoCorrect={false}
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
      { state.errorMessage ? <Spacer>
        <Banner message={state.errorMessage} type='error'></Banner>
        </Spacer> : <Spacer />
      }
      <Spacer>
        <View style={styles.signupButtonContainer}>
          <Button
            title='Sign In'
            buttonStyle={styles.signupButton}
            titleStyle={styles.signupButtonText}
            loading={loading}
            onPress={() => signinCTA()}
          />
        </View>
      </Spacer>
      <Spacer>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.signin}>Don't have an account? Sign up here</Text>
        </TouchableOpacity>
      </Spacer>
      <Spacer />
      <Spacer />
    </View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d2e3c0',
    justifyContent: 'center',
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
    marginBottom: 20,
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
    width: '100%',
    fontSize: 14,
  },
  signupButtonContainer: {
    width: '60%',
    alignSelf: 'center',
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SigninScreen;
