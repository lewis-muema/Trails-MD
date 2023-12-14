import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AccountScreen from './src/screens/AccountScreen';
import SigninScreen from './src/screens/SigninScreen';
import SignupScreen from './src/screens/SignupScreen';
import TrackCreateScreen from './src/screens/TrackCreateScreen';
import TrackDetailScreen from './src/screens/TrackDetailScreen';
import TrackListScreen from './src/screens/TrackListScreen';

const Stack = createNativeStackNavigator();
const Bottom = createBottomTabNavigator();

function Tracks() {
  return (
    <Stack.Navigator initialRouteName="Signin">
      <Stack.Screen name="TrackList" component={TrackListScreen} options={{ title: 'Tracks' }} />
      <Stack.Screen name="TrackDetail" component={TrackDetailScreen} options={{ title: 'Track detail' }} />
    </Stack.Navigator>
  );
}

function Home() {
  return (
    <Bottom.Navigator initialRouteName="Index">
      <Bottom.Screen name="Tracks" component={Tracks} options={{ title: 'Tracks', headerShown: false }} />
      <Bottom.Screen name="TrackCreate" component={TrackCreateScreen} options={{ title: 'Create track' }} />
      <Bottom.Screen name="Account" component={AccountScreen} options={{ title: 'Account' }} />
    </Bottom.Navigator>
  );
}

function Auth() {
  return (
    <Stack.Navigator initialRouteName="Signin">
      <Stack.Screen name="Signin" component={SigninScreen} options={{ title: 'Sign in' }} />
      <Stack.Screen name="Signup" component={SignupScreen} options={{ title: 'Sign up' }} />
    </Stack.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth" screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen name="Auth" component={Auth} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default () => {
  return <App />;
};
