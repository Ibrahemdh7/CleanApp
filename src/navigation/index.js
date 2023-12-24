import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import DestinationScreen from '../screens/DestinationScreen';
import Login from '../screens/login';
import Order from '../screens/OrderPage';
import SignUp from '../screens/SignUp';
import Profile from '../screens/Profile';
import Confirm from '../screens/Confirmation'
import LastOrder from '../screens/LastOrder'
const Stack = createNativeStackNavigator();

function AppNavigation() {
  const [user, setUser] = useState(null); // This should be inside the component
  const [loading, setLoading] = useState(true); // Track the loading state

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);



  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? 'Home' : 'Welcome'} screenOptions={{ headerShown: false }}>
        {user ? (
          // Screens that require authentication
          <>

            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Destination" component={DestinationScreen} />
            <Stack.Screen name="Order" component={Order} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name='Confirm' component={Confirm}/>
            <Stack.Screen name='LastOrder' component={LastOrder}/>

          </>
        ) : (
          // Screens for unauthenticated users
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="SignUp" component={SignUp} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigation;
