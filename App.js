import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import AccountScreen from './src/screens/AccountScreen';
import SigninScreen from './src/screens/SigninScreen';
import SignupScreen from './src/screens/SignupScreen';
import PasswordResetScreen from './src/screens/PasswordReset';
import TrackCreateScreen from './src/screens/TrackCreateScreen';
import TrackDetailScreen from './src/screens/TrackDetailScreen';
import TrackListScreen from './src/screens/TrackListScreen';
import { Provider as AuthProvider, Context as AuthContext } from './src/context/AuthContext';
import { Provider as LocationProvider } from './src/context/locationContext';
import { Provider as TrackProvider, Context as trackContext } from './src/context/trackContext';
import { Provider as PaletteProvider, Context as PaletteContext } from './src/context/paletteContext';
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
  const { state: { palette } } = useContext(PaletteContext);
  return (
    <Bottom.Navigator initialRouteName="Tracks" screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: palette.background,
      tabBarInactiveTintColor: palette.buttonsInactive,
      tabBarStyle: {
        backgroundColor: palette.text,
        borderTopWidth: 0,
        justifyContent: 'center',
        height: 60,
        paddingBottom: 10,
      },
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
      <Stack.Screen name="Passwordreset" component={PasswordResetScreen} options={{ title: 'Password reset' }} />
    </Stack.Navigator>
  );
}

function App() {
  const { offlineMode } = useContext(AuthContext);
  const { changeBG, changeTheme, fontsLoadedStatus } = useContext(PaletteContext);
  const loadTheme = async () => {
    SplashScreen.preventAutoHideAsync().catch(() => {});
    try {
      const offline = await AsyncStorage.getItem('offline');
      const theme = await AsyncStorage.getItem('theme');
      const bg = await AsyncStorage.getItem('bg');
      if (theme !== null) {
        changeTheme(JSON.parse(theme));
      }
      if (bg !== null) {
        changeBG(JSON.parse(bg));
      }
      if (offline) {
        offlineMode('offline', () => {});
      }
      await Font.loadAsync({
        'manuscript-font': require('./assets/fonts/Manuscript.ttf'),
      });
      fontsLoadedStatus(true);
    } catch (e) {
      // error reading value
    } finally {
      await SplashScreen.hideAsync();
    }
  };

  useEffect(() => {
    loadTheme();
  }, []);

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
  return <PaletteProvider>
    <TrackProvider>
      <LocationProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </LocationProvider>
  </TrackProvider>
  </PaletteProvider>;
};
