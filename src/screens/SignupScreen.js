import React, { useState, useContext, useEffect } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Image,
} from 'react-native';
import { Text, Input, Button } from 'react-native-elements';
import {
  MaterialCommunityIcons, FontAwesome5, AntDesign, Entypo,
} from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import Spacer from '../components/Spacer';
import Banner from '../components/banner';
import Loader from '../components/loader';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as PaletteContext } from '../context/paletteContext';

const emailRef = React.createRef();
const passRef = React.createRef();

const SignupScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [securePass, setSecurePass] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const [emailErr, setEmailErr] = useState('');
  const [passErr, setPassErr] = useState('');
  const [loading, setLoading] = useState(false);
  const {
    state, signup, clearErrors, validateAuth,
  } = useContext(AuthContext);
  const { state: { palette, fontsLoaded } } = useContext(PaletteContext);

  const emailValidator = () => {
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailErr('Invalid email');
      emailRef.current.shake();
      return true;
    }
    setEmailErr('');
    return false;
  };

  const passwordValidator = () => {
    if (password !== confirm) {
      setPassErr('This password doesnt match the one above');
      passRef.current.shake();
      return true;
    }
    setPassErr('');
    return false;
  };

  const signupCTA = () => {
    if (emailValidator() || passwordValidator()) {
      emailValidator();
      passwordValidator();
    } else {
      setLoading(true);
      signup({ email, password }, val => setLoading(val));
    }
  };

  useEffect(() => {
    navigation.addListener('focus', () => {
      clearErrors();
      setEmail('');
      setPassword('');
      setConfirm('');
    });
  }, []);

  const styles = paletteStyles(palette, fontsLoaded);

  return <View style={styles.container}>
    <Spacer />
      <View>
        <Loader loading={true} screen={false} message='' centre={false} />
        <View style={styles.trailsLogoCont}>
          <Svg
            style={styles.trailsLogoBG}
            xmlns="http://www.w3.org/2000/svg"
            width={275}
            height={160}
            viewBox="0 0 300 120"
            fill={palette.background}
          >
            <Path d="M256 31.9c-1.4 2.7-1.3 14.4.2 15.9.8.8 4.7 1.2 11 1.2 8.6 0 10-.2 11.9-2.1 1.8-1.8 2.1-3 1.7-7.5-.7-8.4-2.1-9.4-13.9-9.4-8.7 0-9.9.2-10.9 1.9zM223.4 34.4c-2.7 1.4-6.3 4-8 5.7-2.6 2.7-3 3.9-3.5 11.7-.7 10.1.4 13.3 6.3 18 4.1 3.2 4 4.2-.3 4.2-3.1 0-5.2 2.4-6.3 7.3-.5 2.2-1.1 2.7-2.4 2.2-.9-.4-2.7-1-3.9-1.2-2.1-.5-2.2-1-1.8-7.7.2-3.9.3-7.8.3-8.6-.1-.8-.2-7.7-.3-15.3-.1-16.2-.1-16.2-11.1-17.2-8.1-.8-12.1.4-12.6 3.6-.4 3.2-2.3 3.4-3.6.4-1.2-2.5-1.3-2.5-9.4-2-12.2.9-12.6 1-13.3 4.8-.4 1.8-.8 14.3-.9 27.7-.2 13.5-.5 24.7-.6 25-.3.8-4.9-28-5.6-35.8-.4-3.9-1-7.2-1.4-7.2-.5 0-1.1-2.8-1.5-6.3-1.1-9.9-.9-9.7-13.3-9.7-13.7 0-17.5 1.6-18 7.6-.1 2.2-.7 6.4-1.3 9.4-.6 3-1.5 10.2-1.9 16-.5 5.8-1.5 13.4-2.3 17-1.4 6.3-1.5 6.4-1.6 2.2 0-2.4-.6-7.4-1.2-11.3-.7-4.8-.7-7.9 0-10.2 1.3-4 1.6-13 .6-18.2-.9-4.6-4.6-9.2-9.2-11.1-3.9-1.7-24.8-1.9-29-.4-1.5.6-3.4 1.8-4 2.7-1.2 1.5-1.4 1.5-3.1 0-1.6-1.4-4.7-1.7-19.2-2-13.5-.2-17.6 0-18.7 1.1-1.9 2-1.8 18.5.2 20.2.8.7 2.2.9 3.1.6 3.5-1.3 4.3 2.1 3.7 15.9-.3 7.2-.2 16.6.1 20.8.9 9.3 1.5 9.7 12.6 10.2 6.1.3 8.1.1 9.1-1.1.9-1.1 1.3-7.4 1.3-23.7l.1-22.2 3-.3c3.9-.5 5.3-1.7 5.8-5 .2-1.5.5 1.4.6 6.5 0 5.2-.3 9.4-.9 9.8-1.3.8-1.3 5.2 0 6 .6.4 1 6 1 13.4 0 9.7.3 13.1 1.4 14 1.6 1.3 13.8 3 17.2 2.3 1.4-.2 2.7-.8 3-1.3.3-.5 1.9-.2 3.5.7 3.5 1.8 12.9 1.1 16.5-1.1 1.2-.8 2.5-1 3-.5s4.8 1.2 9.6 1.6c8.5.6 8.7.6 11.1-2 2-2.1 2.6-2.4 3.6-1.2.6.7 4.4 1.8 8.4 2.4 6.2 1 8.6 1.1 13 .3.4 0 .7-.9.7-1.8 0-1.4.5-1.2 2.5 1 2.4 2.5 3.1 2.7 11.3 2.7 5.5 0 9.2-.4 10-1.2.7-.7 1.2-4.6 1.3-10.3 0-4.9.5-9.9 1-11 .6-1.4.8.1.4 4.9-.6 8.5 1.6 16.4 4.9 17.1 3.9 1 25.6-.1 26.8-1.3.6-.6 1.1-3.9 1.1-7.4 0-3.5.2-5.2.4-3.8.8 4.9 2.5 8 4.4 8 1.1 0 3.8 1.2 6.2 2.7 5.3 3.4 17.4 4.6 19.6 1.9.7-.9 1.9-1.6 2.7-1.6 2.2 0 8.2-8.3 9.4-13 .7-2.5 1.5-7 1.9-10 .7-4.9.5-6-1.7-9.5-2.7-4.2-5.5-6.8-10.6-9.8l-3.1-1.9 2.9.5c5.2.9 8.3-.9 8.9-5.1 1.3-8.2-2.4-16.7-8.6-19.8-1.7-.9-5.8-1.9-9.2-2.1-5-.4-6.8 0-11.1 2.1zM62 43.1c0 1.1-.4 1.8-1 1.4-.5-.3-.7-1.2-.3-2 .7-2.1 1.3-1.9 1.3.6zm116.7 18.6c-.2 2.7-.3.5-.3-4.7s.1-7.4.3-4.8c.2 2.7.2 6.9 0 9.5zm0 12c-.4.3-.7 0-.7-.7s.3-1 .7-.7c.3.4.3 1 0 1.4zM242.5 93c.3.5.4 1 .1 1-.3 0-.8-.5-1.1-1-.3-.6-.4-1-.1-1 .3 0 .8.4 1.1 1z" />
          </Svg>
          <Text style={styles.trailsLogoText}>TRAILS</Text>
          <Text style={styles.trailsLogoMD}>MD</Text>
        </View>
      </View>
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
          <FontAwesome5 name="user" size={18} color={palette.text} />
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
          <MaterialCommunityIcons name="form-textbox-password" size={18} color={palette.text} />
        }
        rightIcon={
          securePass
            ? <TouchableOpacity onPress={() => setSecurePass(!securePass)}>
            <Entypo name="eye-with-line" size={18} color={palette.text} />
            </TouchableOpacity>
            : <TouchableOpacity onPress={() => setSecurePass(!securePass)}>
            <AntDesign name="eye" size={18} color={palette.text} />
            </TouchableOpacity>
        }
      />
      </View>
      <View style={styles.inputContainer}>
        <Input
        ref={passRef}
        label='Confirm password'
        value={confirm}
        onChangeText={val => setConfirm(val)}
        onBlur={passwordValidator}
        errorMessage={passErr}
        labelStyle={styles.label}
        inputStyle={styles.inputTextSytle}
        secureTextEntry={secureConfirm}
        autoCapitalize='none'
        autoCorrect={false}
        leftIcon={
          <MaterialCommunityIcons name="form-textbox-password" size={18} color={palette.text} />
        }
        rightIcon={
          secureConfirm
            ? <TouchableOpacity onPress={() => setSecureConfirm(!secureConfirm)}>
              <Entypo name="eye-with-line" size={18} color={palette.text} />
              </TouchableOpacity>
            : <TouchableOpacity onPress={() => setSecureConfirm(!secureConfirm)}>
              <AntDesign name="eye" size={18} color={palette.text} />
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
            title='Sign Up'
            buttonStyle={styles.signupButton}
            titleStyle={styles.signupButtonText}
            loading={loading}
            onPress={() => signupCTA()}
          />
        </View>
      </Spacer>
      <Spacer>
        <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
          <Text style={styles.signin}>Sign in instead?</Text>
        </TouchableOpacity>
      </Spacer>
    </View>;
};

const paletteStyles = (palette, fontsLoaded) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    fontWeight: '600',
  },
  trailsLogo: {
    width: 250,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: -50,
  },
  label: {
    color: palette.text,
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
    color: palette.text,
    fontSize: 16,
    fontWeight: '600',
  },
  signupButton: {
    backgroundColor: palette.text,
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
  trailsLogoCont: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    display: fontsLoaded ? 'grid' : 'none',
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: -20,
  },
  trailsLogoText: {
    fontFamily: fontsLoaded ? 'manuscript-font' : '',
    fontSize: 80,
    color: palette.text,
  },
  trailsLogoMD: {
    fontFamily: fontsLoaded ? 'manuscript-font' : '',
    fontSize: 18,
    marginTop: 6,
    marginLeft: 2,
    letterSpacing: 1,
    color: palette.text,
  },
  trailsLogoBG: {
    position: 'absolute',
    top: -46,
    left: -19,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
});

export default SignupScreen;
