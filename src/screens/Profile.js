import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ActivityIndicator, TextInput, FlatList, Alert, Platform,input } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { doc, getDoc, getFirestore, updateDoc, query, where, getDocs, addDoc, collection, deleteDoc } from 'firebase/firestore';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { Input,Button  } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

const ProfileScreen = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;
  const [realEstates, setRealEstates] = useState([]);
  const [newEstateName, setNewEstateName] = useState('');
  const [newEstateUrl, setNewEstateUrl] = useState('');
  // const [editEmail, setEditEmail] = useState('');
const [editPhone, setEditPhone] = useState('');
  const [isEditing, setIsEditing] = useState(false);



  useEffect(() => {
    const fetchUserDetailsAndRealEstates = async () => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        try {
          const userDocSnapshot = await getDoc(userDocRef);
          if (userDocSnapshot.exists()) {
            setUserDetails(userDocSnapshot.data());
          } else {
            console.log('No such document with UID:', user.uid);
          }
          
          const q = query(collection(db, 'RealEstate'), where('UID', '==', user.uid));
          const querySnapshot = await getDocs(q);
          const estates = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setRealEstates(estates);
          
        } catch (error) {
          console.error("Error fetching user details or real estates:", error);
        }
      } else {
        navigation.navigate('Welcome');
      }
      setLoading(false);
    };

    fetchUserDetailsAndRealEstates();
  }, [user, db, navigation]);


 

  if (loading) {
    // While loading the user data, display an ActivityIndicator
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  // Ensure that userDetails is not null before trying to access its properties
  if (!userDetails) {
    return (
      <View>
        <Text>No user details available.</Text>
      </View>
    );
  }



  const handleSave = async () => {
    const userRef = doc(getFirestore(), 'users', getAuth().currentUser.uid);
    try {
      await updateDoc(userRef, {
        phone: editPhone,
      });
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        phone: editPhone,
      }));
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };


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


  // CRUD  wstate

  const handleAddEstate = async () => {
    if (!newEstateName || !newEstateUrl) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    try {
      const docRef = await addDoc(collection(db, 'RealEstate'), {
        UID: user.uid,
        Name: newEstateName,
        RealEstateUrl: newEstateUrl,
        UserName: user.displayName || user.email,
      });
      setRealEstates([...realEstates, { id: docRef.id, Name: newEstateName, RealEstateUrl: newEstateUrl }]);
      setNewEstateName('');
      setNewEstateUrl('');
    } catch (error) {
      console.error('Error adding estate:', error);
      Alert.alert('Error', 'There was an issue adding the estate.');
    }
  };



  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const handleDeleteEstate = async (estateId) => {
    try {
      await deleteDoc(doc(db, 'RealEstate', estateId));
      setRealEstates(prevEstates => prevEstates.filter(estate => estate.id !== estateId));
    } catch (error) {
      console.error('Error deleting estate:', error);
      Alert.alert('Error', 'There was an issue deleting the estate.');
    }
  };


  return (
     <SafeAreaView  className={`flex-1 bg-white ${Platform.OS === 'ios' ? 'mt-0' : 'mt-10'}`}>
      <StatusBar style="light" />
      <Header title="الصفحة الشخصية" onBackPress={() => navigation.goBack()} />

      <View className="p-5">
        
        <Text className="text-xl font-bold mb-4">Your Account</Text>
        {isEditing ? (
          <View>
            {/* <Input
              value={editEmail}
              onChangeText={setEditEmail}
              placeholder="Email"
              leftIcon={{ type: 'font-awesome', name: 'envelope' }}
              className="mb-4"
            /> */}
            <Input
              value={editPhone}
              onChangeText={setEditPhone}
              placeholder="Phone"
              leftIcon={{ type: 'font-awesome', name: 'phone' }}
              className="mb-4"
            />
            <TouchableOpacity
              onPress={handleSave}
              className="bg-blue-600 p-3 rounded-lg mb-4"
            >
              <Text className="text-white text-center">Save Changes</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text className="text-lg">Name: {userDetails.name}</Text>
            <Text className="text-lg">Email: {userDetails.email}</Text>
            <Text className="text-lg">Phone: {userDetails.phone}</Text>
            <TouchableOpacity
              onPress={() => setIsEditing(true)}
              className="bg-blue-600 p-3 rounded-lg mt-4"
            >
              <Text className="text-white text-center">Edit</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View className="p-5">
        <Text className="text-xl font-bold mb-4">Add New Estate</Text>
        <Input
          value={newEstateName}
          onChangeText={setNewEstateName}
          placeholder="Estate Name"
          leftIcon={<Icon name="home" size={24} color="black" />}
          className="mb-2"
        />
        <Input
          value={newEstateUrl}
          onChangeText={setNewEstateUrl}
          placeholder="Estate URL"
          leftIcon={<Icon name="link" size={24} color="black" />}
          className="mb-4"
        />
        <Button
          title="Add Estate"
          onPress={handleAddEstate}
          buttonStyle="bg-blue-600"
          className="rounded-lg"
        />
      </View>
      <View className="flex-1 bg-white p-5">
      <Text className="text-xl font-bold mb-4">My Estates</Text>
      <FlatList
        data={realEstates}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View className="p-4 border-b border-gray-200">
            <Text className="text-lg font-semibold">{item.Name}</Text>
            <Text className="text-sm text-gray-600">{item.RealEstateUrl}</Text>
            <TouchableOpacity onPress={() => handleDeleteEstate(item.id)} className="bg-red-500 p-2 rounded-lg mt-2">
              <Text className="text-white text-center">Delete Estate</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      {realEstates.length === 0 && <Text className="text-center text-gray-500">No estates found.</Text>}
    </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
