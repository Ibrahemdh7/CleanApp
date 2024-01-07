import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getFirestore, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment'; 

export default function LastOrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser; // Get the logged-in user from Firebase Auth
  const navigation = useNavigation();

  const formatDate = (date) => {
    return moment(date).format('hh:mm A, DD MMMM, YYYY');
  };
  useEffect(() => {
    const fetchLastOrders = async () => {
      if (!user) {
        console.log('User not logged in');
        setLoading(false);
        return;
      }
  
      const q = query(
        collection(db, 'orders'),
        where('UserID', '==', user.uid),
        orderBy('Date', 'desc'),
        limit(10)
      );
  
      try {
        const querySnapshot = await getDocs(q);
        const fetchedOrders = [];
  
        for (const doc of querySnapshot.docs) {
          const orderData = doc.data();
          let estateName = '';
  
          // Assuming each order has an EstateID field linking to the RealEstate collection
          if (orderData.EstateID) {
            const estateRef = doc(db, 'RealEstate', orderData.Name);
            const estateSnap = await getDoc(estateRef);
  
            if (estateSnap.exists()) {
              estateName = estateSnap.data().Name; // Assuming EstateName is the field you want
            }
          }
  
          fetchedOrders.push({
            id: doc.id,
            EstateName: estateName,
            ...orderData,
          });
        }
  
        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Error fetching last orders:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchLastOrders();
  }, [user]);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (orders.length === 0) {
    return <Text>No orders found for this user.</Text>;
  }

  const Header = ({ title, onBackPress, onRightPress, rightIcon }) => {
    return (
      <View className="flex-row items-center px-4 py-3 bg-blue-600 shadow-md">
        <TouchableOpacity onPress={onBackPress} className="p-2 rounded-full bg-blue-700 mr-2">
          <ChevronLeftIcon size={24} color="white" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-white text-xl font-semibold">{title}</Text>
        {rightIcon && (
          <TouchableOpacity onPress={onRightPress} className="p-2 rounded-full bg-blue-700 ml-2">
            {/* Right icon component should be passed in via props */}
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View  className={`flex-1 bg-white ${Platform.OS === 'ios' ? 'mt-0' : 'mt-5'}`}>

      <Header title="الطلبات السابقة" onBackPress={() => navigation.push('Home')} />
      
 <FlatList
  data={orders}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <View className="p-4 border-b border-gray-300">
    <Text className="text-lg font-bold">Order Number: {item.OrderNumber}</Text>
      <Text className="text-black">User: {item.UserName}</Text>
      <Text className="text-black">Phone: {item.UserPhone}</Text>
      <Text className="text-black">Total: ${item.TotalAmount}</Text>
      <Text className="text-black">Status: {item.Status}</Text>
      <Text className="text-black">Estate: {item.Name}</Text>
      <Text className="text-black">{`Date: ${formatDate(item.Date.toDate())}`}</Text> 

    </View>
  )}
/>

    </View>
  );
}
