import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Camera from './Screens/Camera';
import Gallery from './Screens/Gallery';
import Player from './Screens/Player';

const Stack = createNativeStackNavigator();

const StackScreens = () => {
  return (
    <Stack.Navigator
      initialRouteName="CAMERA"
    >
      <Stack.Screen
        name="CAMERA"
        options={{ headerShown: false }}
        component={Camera}
      />
      <Stack.Screen
        name="GALLERY"
        options={{
          headerShown: true,
          title: "Gallery",
          headerTitleStyle: { fontSize: 18 }
        }}
        component={Gallery}
      />
      <Stack.Screen
        name="PLAYER"
        options={{
          headerShown: true,
          title: "",
          headerTransparent: true,
          headerBackTitleVisible: false,
          headerTintColor: '#ffff'
        }}
        component={Player}
      />
    </Stack.Navigator>
  )
}

export default StackScreens;