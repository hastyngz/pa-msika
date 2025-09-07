import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import PostItemScreen from '../screens/PostItemScreen';
import ItemDetailsScreen from '../screens/ItemDetailsScreen';
import OrdersScreen from '../screens/OrdersScreen';
import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user } = useAuth();

  return (
    <Stack.Navigator>
      {user ? (
        // logged in
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="PostItem" component={PostItemScreen} options={{ title: 'Post Item' }} />
          <Stack.Screen name="ItemDetails" component={ItemDetailsScreen} options={{ title: 'Details' }} />
          <Stack.Screen name="Orders" component={OrdersScreen} />
        </>
      ) : (
        // auth
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
