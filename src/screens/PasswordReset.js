import React, { useState, useContext, useEffect } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Image,
} from 'react-native';
import { Text, Input, Button } from 'react-native-elements';
import {
  MaterialCommunityIcons, FontAwesome5, AntDesign, Entypo,
} from '@expo/vector-icons';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { useNavigation } from '@react-navigation/native';
import Spacer from '../components/Spacer';
import Banner from '../components/banner';
import Loader from '../components/loader';
import { Context as AuthContext } from '../context/AuthContext';

const baseColor = '#113231';
const emailRef = React.createRef();
const passRef = React.createRef();

const PasswordResetScreen = () => {
  const navigation = useNavigation();
  const [value, setValue] = useState('');
  const [stage, setStage] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securePass, setSecurePass] = useState(true);
  const [confirm, setConfirm] = useState('');
  const [secureConfirm, setSecureConfirm] = useState(true);
  const [passErr, setPassErr] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [loading, setLoading] = useState(false);
  const {
    state, clearErrors, setError, validateToken, sendResetEmail,
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

  const passwordValidator = () => {
    if (password !== confirm) {
      setPassErr('This password doesnt match the one above');
      passRef.current.shake();
      return true;
    }
    setPassErr('');
    return false;
  };

  const sendEmail = () => {
    if (emailValidator()) {
      emailValidator();
    } else {
      setLoading(true);
      sendResetEmail({ email }, val => setLoading(val), val => setStage(val));
    }
  };

  const resetPassword = () => {
    if (passwordValidator()) {
      passwordValidator();
    } else {
      setStage(3);
    }
  };

  const validate = () => {
    if (value && value.length === 6) {
      setLoading(true);
      validateToken(
        { id: state.userId, token: value, password },
        val => setLoading(val),
        val => setStage(val),
      );
    } else {
      setError('Please enter the correct token');
    }
  };

  const ref = useBlurOnFulfill({ value, cellCount: 6 });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    navigation.addListener('focus', () => {
      clearErrors();
      setEmail('');
      setPassword('');
      setStage(1);
    });
  }, []);

  return <View style={styles.container}>
    <Spacer />
      <View>
        <Loader loading={true} screen={false} message='' centre={false} />
        <Image style={styles.trailsLogo} source={require('../../assets/logo.png')} />
      </View>
      { stage === 1 ? <View>
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
        { state.errorMessage ? <Spacer>
          <Banner message={state.errorMessage} type='error'></Banner>
          </Spacer> : null
        }
        <Spacer>
          <View style={styles.signupButtonContainer}>
            <Button
              title='Reset Password'
              buttonStyle={styles.signupButton}
              titleStyle={styles.signupButtonText}
              loading={loading}
              onPress={() => sendEmail()}
            />
          </View>
        </Spacer>
      </View> : null }
      { stage === 2 ? <View>
        <View style={styles.inputContainer}>
          <Input
          ref={passRef}
          label='New password'
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
        <View style={styles.inputContainer}>
        <Input
          ref={passRef}
          label='Confirm new password'
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
        { state.errorMessage ? <Spacer>
          <Banner message={state.errorMessage} type='error'></Banner>
          </Spacer> : null
        }
        { state.successMessage ? <Spacer>
          <Banner message={state.successMessage} type='success'></Banner>
          </Spacer> : null
        }
        <Spacer>
          <View style={styles.signupButtonContainer}>
            <Button
              title='Reset Password'
              buttonStyle={styles.signupButton}
              titleStyle={styles.signupButtonText}
              loading={loading}
              onPress={() => resetPassword()}
            />
          </View>
        </Spacer>
      </View> : null }
      { stage === 3 ? <View>
        <View style={styles.inputContainer}>
        <Text style={styles.tokenTitle}>Token</Text>
        <CodeField
          ref={ref}
          {...props}
          value={value}
          onChangeText={setValue}
          cellCount={6}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({ index, symbol, isFocused }) => (
            <Text
              key={index}
              style={[styles.cell, isFocused && styles.focusCell]}
              onLayout={getCellOnLayoutHandler(index)}>
              {symbol || (isFocused ? <Cursor/> : null)}
            </Text>
          )}
        />
        </View>
        { state.errorMessage ? <Spacer>
          <Banner message={state.errorMessage} type='error'></Banner>
          </Spacer> : null
        }
        { state.successMessage ? <Spacer>
          <Banner message={state.successMessage} type='success'></Banner>
          </Spacer> : null
        }
        <Spacer>
          <View style={styles.signupButtonContainer}>
            <Button
              title='Reset Password'
              buttonStyle={styles.signupButton}
              titleStyle={styles.signupButtonText}
              loading={loading}
              onPress={() => validate()}
            />
          </View>
        </Spacer>
      </View> : null }
      <Spacer>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.signin}>Go back to sign in</Text>
        </TouchableOpacity>
      </Spacer>
      <Spacer />
      <Spacer />
    </View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faeed9',
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
  codeFieldRoot: {
    marginTop: 20,
    marginBottom: 20,
    width: '90%',
    alignSelf: 'center',
  },
  cell: {
    width: 50,
    height: 50,
    lineHeight: 45,
    fontSize: 24,
    borderWidth: 2,
    borderColor: baseColor,
    borderRadius: 5,
    textAlign: 'center',
  },
  focusCell: {
    borderColor: '#000',
  },
  tokenTitle: {
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default PasswordResetScreen;
