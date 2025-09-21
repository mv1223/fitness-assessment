import React, { useEffect, useState } from 'react';
import { StatusBar, Platform, PermissionsAndroid, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SplashScreen from 'react-native-splash-screen';
import Orientation from 'react-native-orientation-locker';

// Import screens
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import TestSelectionScreen from './src/screens/TestSelectionScreen';
import VideoRecordingScreen from './src/screens/VideoRecordingScreen';
import TestAnalysisScreen from './src/screens/TestAnalysisScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';

// Import theme
import { theme } from './src/utils/theme';

const Stack = createStackNavigator();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Request permissions
      await requestPermissions();
      
      // Lock orientation to portrait
      Orientation.lockToPortrait();
      
      // Hide splash screen
      setTimeout(() => {
        SplashScreen.hide();
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error('App initialization error:', error);
      SplashScreen.hide();
      setIsLoading(false);
    }
  };

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]);

        const allPermissionsGranted = Object.values(granted).every(
          permission => permission === PermissionsAndroid.RESULTS.GRANTED
        );

        if (!allPermissionsGranted) {
          Alert.alert(
            'Permissions Required',
            'This app needs camera, microphone, and storage permissions to function properly.',
            [{ text: 'OK' }]
          );
        }
      } catch (err) {
        console.warn('Permission request error:', err);
      }
    }
  };

  if (isLoading) {
    return null; // Splash screen is shown
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Welcome"
            screenOptions={{
              headerStyle: {
                backgroundColor: theme.colors.primary,
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 18,
              },
              headerBackTitleVisible: false,
            }}
          >
            <Stack.Screen 
              name="Welcome" 
              component={WelcomeScreen} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ title: 'Login' }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen} 
              options={{ title: 'Register' }}
            />
            <Stack.Screen 
              name="Dashboard" 
              component={DashboardScreen} 
              options={{ title: 'Dashboard', headerLeft: null }}
            />
            <Stack.Screen 
              name="TestSelection" 
              component={TestSelectionScreen} 
              options={{ title: 'Select Test' }}
            />
            <Stack.Screen 
              name="VideoRecording" 
              component={VideoRecordingScreen} 
              options={{ title: 'Record Test' }}
            />
            <Stack.Screen 
              name="TestAnalysis" 
              component={TestAnalysisScreen} 
              options={{ title: 'Analyzing...' }}
            />
            <Stack.Screen 
              name="Results" 
              component={ResultsScreen} 
              options={{ title: 'Test Results' }}
            />
            <Stack.Screen 
              name="Profile" 
              component={ProfileScreen} 
              options={{ title: 'Profile' }}
            />
            <Stack.Screen 
              name="Leaderboard" 
              component={LeaderboardScreen} 
              options={{ title: 'Leaderboard' }}
            />
            <Stack.Screen 
              name="AdminDashboard" 
              component={AdminDashboardScreen} 
              options={{ title: 'Admin Dashboard' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </GestureHandlerRootView>
  );
};

export default App;
