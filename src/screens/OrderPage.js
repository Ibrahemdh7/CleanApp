import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity,SafeAreaView,Image } from 'react-native';
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  doc,
  getDoc,
  updateDoc,
  writeBatch,
  runTransaction,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { ChevronLeftIcon,MinusIcon,PlusIcon,TrashIcon  } from 'react-native-heroicons/outline'; // Make sure you have this package or replace with an alternative icon
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

export default function CartScreen() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;
  const navigation = useNavigation();
  const [total, setTotal] = useState(0);
  const [tax, setTax] = useState(0);
  useEffect(() => {
    let newTotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    let newTax = newTotal * 0.15; // 15% tax
    setTotal(newTotal);
    setTax(newTax);
  }, [cartItems]);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (user) {
        const cartRef = doc(db, 'users', user.uid, 'cart', 'currentCart');
        try {
          const cartSnap = await getDoc(cartRef);
          if (cartSnap.exists()) {
            const itemsWithTotalPrice = cartSnap.data().items.map((item) => ({
              ...item,
              // Assume `unitPrice` is a field in your Firestore document for each item
              totalPrice: item.unitPrice * item.quantity,
            }));
            setCartItems(itemsWithTotalPrice);
          } else {
            console.log('No cart items found');
            setCartItems([]);
          }
        } catch (error) {
          console.error('Error fetching cart items:', error);
        }
      } else {
        console.log('User not logged in');
        // Handle user not logged in
      }
      setLoading(false);
    };
    
    

    fetchCartItems();
  }, [user]);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }
// Update Quantity
  const updateQuantity = async (productId, delta) => {
  if (!user) {
    console.log('No user logged in');
    return;
  }

  const cartRef = doc(db, 'users', user.uid, 'cart', 'currentCart');

  try {
    await runTransaction(db, async (transaction) => {
      const cartDoc = await transaction.get(cartRef);
      if (!cartDoc.exists()) {
        throw new Error("Document does not exist!");
      }

      const newItems = cartDoc.data().items.map((item) => {
        if (item.productID === productId) {
          // Update the quantity making sure it is not less than 1
          const updatedQuantity = Math.max(1, item.quantity + delta);
          // Recalculate the total price based on the new quantity
          const updatedTotalPrice = updatedQuantity * item.unitPrice;
          return { ...item, quantity: updatedQuantity, totalPrice: updatedTotalPrice };
        }
        return item;
      });

      transaction.update(cartRef, { items: newItems });
      // Update local state after Firestore update
      setCartItems(newItems);
    });

    console.log("Cart updated!");
  } catch (e) {
    console.error("Transaction failed: ", e);
  }
};

  // Delete quantity
  const deleteItem = async (productId) => {
    if (!user) {
      console.log('No user logged in');
      return;
    }
  
    const cartRef = doc(db, 'users', user.uid, 'cart', 'currentCart');
  
    try {
      await runTransaction(db, async (transaction) => {
        const cartDoc = await transaction.get(cartRef);
        if (!cartDoc.exists()) {
          throw new Error("Document does not exist!");
        }
  
        const newItems = cartDoc.data().items.filter(item => item.productID !== productId);
        transaction.update(cartRef, { items: newItems });
        setCartItems(newItems); // Update local state
      });
  
      console.log("Item deleted from cart!");
    } catch (e) {
      console.error("Transaction failed: ", e);
    }
  };

  const handleProceedToCheckout = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to place an order.');
      return;
    }
  
    setLoading(true);
  
    try {
      // Fetch user details from Firestore
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        throw new Error("User data not found!");
      }
      const userData = userSnap.data();
      const userName = userData.name; // Assuming 'name' field in user document
      const userPhone = userData.phone; // Assuming 'phone' field in user document
      // Generate a unique order number
      const dateString = new Date().toISOString().slice(0, 10).replace(/-/g, '');

      // Generate a random four-digit number for some level of uniqueness
      const randomNumber = Math.floor(1000 + Math.random() * 9000);
      
      // Combine the two with a shorter user identifier if possible
      const shortUserId = user.uid.slice(0, 5); // Take only the first 5 characters of the user's UID for brevity
      
      const uniqueOrderNumber = `order_${shortUserId}_${dateString}_${randomNumber}`;
      // Reference to the new order document
      const newOrderRef = doc(collection(db, 'orders'));
  
      // Reference to the user's current cart
      const cartRef = doc(db, 'users', user.uid, 'cart', 'currentCart');
      const cartSnapshot = await getDoc(cartRef);
  
      if (cartSnapshot.exists()) {
        const cartItems = cartSnapshot.data().items;
        const totalAmount = cartItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  
        // Create the order
        await setDoc(newOrderRef, {
          Date: new Date(),
          UserID: user.uid,
          UserName: userName,
          UserPhone: userPhone,
          TotalAmount: totalAmount,
          Status: 'Pending',
          OrderNumber: uniqueOrderNumber,
        });
  
        // Create order details for each cart item
        const orderDetailsRef = collection(db, 'orderDetails'); // Top-level collection for order details
  for (const item of cartItems) {
    const newOrderDetailRef = doc(orderDetailsRef); // Create a new document reference in the orderDetails collection
    await setDoc(newOrderDetailRef, {
      OrderID: newOrderRef.id, // Store the ID of the order this detail belongs to
      ProductID: item.productID,
      ProductName: item.name, // Assuming 'name' field in cart item
      Quantity: item.quantity,
      Price: item.unitPrice,
      UserName: userName,
      UserPhone: userPhone,
      // OrderNumber is not needed here anymore since it's in the Order document
    });
  }

        // Clear the cart
        await updateDoc(cartRef, { items: [] });
  
        // Navigate to the confirmation screen
        navigation.navigate('Confirm', { orderID: newOrderRef.id });
      } else {
        Alert.alert('Error', 'Your cart is empty.');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      Alert.alert('Error', 'Could not complete the checkout process.');
    } finally {
      setLoading(false);
    }
  };
  

  // Header code
const Header = ({ title, onBackPress, onRightPress, rightIcon }) => {
    return (
      <View className="flex-row items-center px-4 py-3  bg-blue-600 shadow-md">
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

    <SafeAreaView className={`flex-1 bg-white ${Platform.OS === 'ios' ? 'mt-0' : 'mt-10'}`}>
    <StatusBar style="light" />
    <Header title="الصفحة الشخصية" onBackPress={() => navigation.goBack()} />
    <FlatList
      data={cartItems}
      keyExtractor={(item) => item.productID.toString()} // Make sure productID is a string
      renderItem={({ item }) => (
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
          <Image
            source={{ uri: item.imageURL }} // Replace with your image field
            style={{ width: 50, height: 50 }}
          />
          <Text className="text-lg font-semibold text-gray-800">{item.name}</Text>
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => updateQuantity(item.productID, -1)} className="p-2 bg-gray-100 mr-2 rounded hover:bg-gray-300">
              <MinusIcon size={20} color="black" />
            </TouchableOpacity>
          
            <Text className="mx-2 text-lg">{item.quantity}</Text>
          
            <TouchableOpacity onPress={() => updateQuantity(item.productID, 1)} className="p-2 bg-gray-100 ml-2 rounded hover:bg-gray-300">
              <PlusIcon size={20} color="black" />
            </TouchableOpacity>
          
            <TouchableOpacity onPress={() => deleteItem(item.productID)} className="ml-2">
              <TrashIcon size={24} color="red" />  
            </TouchableOpacity>
          </View>
          
          <Text className="text-lg font-semibold text-green-600">{`$${item.totalPrice.toFixed(2)}`}</Text>
        </View>
      )}
    />
    <View className="p-4 border-t border-gray-200">
        <Text className="text-lg">Subtotal: ${total.toFixed(2)}</Text>
        <Text className="text-lg">Tax: ${tax.toFixed(2)}</Text>
        <Text className="text-xl font-bold">Total: ${(total + tax).toFixed(2)}</Text>
      </View>
    <TouchableOpacity onPress={()=> handleProceedToCheckout()} className="bg-blue-600 hover:bg-blue-700 p-3 m-4 rounded-lg">
      <Text className="text-white text-center text-lg">تأكيد العملية</Text>
    </TouchableOpacity>
  </SafeAreaView>
  );
}
