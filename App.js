import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import StackScreens from './src/StackScreen';

const App = () => {
  return (
    <NavigationContainer onReady={() => SplashScreen.hide()}>
      <StackScreens />
    </NavigationContainer>
  );

}

export default App