import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AccountScreen from './src/screens/AccountScreen';
import SigninScreen from './src/screens/SigninScreen';
import SignupScreen from './src/screens/SignupScreen';
import TrackCreateScreen from './src/screens/TrackCreateScreen';
import TrackDetailScreen from './src/screens/TrackDetailScreen';
import TrackListScreen from './src/screens/TrackListScreen';
import { Provider as AuthProvider } from './src/context/AuthContext';
import { Provider as LocationProvider } from './src/context/locationContext';
import { Provider as TrackProvider } from './src/context/trackContext';
import { navigationRef } from './src/RootNavigation';

const Stack = createNativeStackNavigator();
const Bottom = createBottomTabNavigator();

function Tracks() {
  return (
    <Stack.Navigator initialRouteName="TrackList" screenOptions={{
      headerShown: false,
    }}>
      <Stack.Screen name="TrackList" component={TrackListScreen} options={{ title: 'Tracks' }} />
      <Stack.Screen name="TrackDetail" component={TrackDetailScreen} options={{ title: 'Track details' }} />
    </Stack.Navigator>
  );
}

function Home() {
  return (
    <Bottom.Navigator initialRouteName="Tracks" screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#faeed9',
      tabBarInactiveTintColor: '#cf7033',
      tabBarStyle: { backgroundColor: '#113231', borderTopWidth: 0, justifyContent: 'center' },
    }}>
      <Bottom.Screen name="Tracks" component={Tracks} options={{
        title: 'Trails',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="trail-sign-outline" color={color} size={size} />
        ),
      }} />
      <Bottom.Screen name="TrackCreate" component={TrackCreateScreen} options={{
        title: 'Create track',
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="my-location" color={color} size={size} />
        ),
      }} />
      <Bottom.Screen name="Account" component={AccountScreen} options={{
        title: 'Account',
        tabBarIcon: ({ color, size }) => (
          <FontAwesome5 name="user" color={color} size={size} />
        ),
      }} />
    </Bottom.Navigator>
  );
}

function Auth() {
  return (
    <Stack.Navigator initialRouteName="Signin" screenOptions={{
      headerShown: false,
    }}>
      <Stack.Screen name="Signin" component={SigninScreen} options={{ title: 'Sign in' }} />
      <Stack.Screen name="Signup" component={SignupScreen} options={{ title: 'Sign up' }} />
    </Stack.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Home" screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen name="Auth" component={Auth} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default () => {
  return <TrackProvider>
    <LocationProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </LocationProvider>
  </TrackProvider>;
};
