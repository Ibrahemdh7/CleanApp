import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  TextInput,
  ActivityIndicator 
} from "react-native";
import React, { useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import {
  ClockIcon,
  HeartIcon,
  MapPinIcon,
  SunIcon,
} from "react-native-heroicons/solid";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../theme";
import {
  doc,
  setDoc,
  getDocs,
  updateDoc,
  arrayUnion,
  getFirestore,
  addDoc,
  collection,
  query,
  where,
  getDoc

} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useEffect, } from "react";

const ios = Platform.OS == "ios";
const topMargin = ios ? "" : "mt-10";

export default function DestinationScreen(props) {
  const item = props.route.params;
  const navigation = useNavigation();
  const [isFavourite, toggleFavourite] = useState(false);
  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user.uid;
  const [imageUrl, setImageUrl] = useState(null);
  const [hasRealEstate, setHasRealEstate] = useState(false);
  const [checkingRealEstate, setCheckingRealEstate] = useState(true);
  const [realEstateName, setRealEstateName] = useState('');
  const [realEstateUrl, setRealEstateUrl] = useState('');
  

  useEffect(() => {

    const isFormValid = realEstateName.trim() !== '' && realEstateUrl.trim() !== '';

    const checkUserRealEstate = async () => {
      if (user) {
        const q = query(collection(db, 'RealEstate'), where('UID', '==', user.uid));
        const querySnapshot = await getDocs(q);
        setHasRealEstate(!querySnapshot.empty);
      }
      setCheckingRealEstate(false);
    };

    checkUserRealEstate();
  }, [user]);

  const isFormValid = realEstateName.trim() !== '' && realEstateUrl.trim() !== '';


  useEffect(() => {

    
    // Immediately after mounting, convert the gs:// URL to an HTTP URL
    if (item.imageUrl) {
      const storage = getStorage();
      const storageRef = ref(storage, item.imageUrl);

      getDownloadURL(storageRef)
        .then((url) => {
          // Successful download
          setImageUrl(url);
        })
        .catch((error) => {
          // Handle any errors
          console.error("Error fetching image URL:", error);
        });
    }
  }, [item.imageUrl]);

  const addToCart = async (product) => {
    const user = auth.currentUser; // Moved inside the function to get the most recent auth state
    if (!user) {
      Alert.alert("Error", "You must be logged in to add items to the cart.");
      return;
    }

    if (checkingRealEstate) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    }
  

    // Use unitPrice as per your Firestore document
    const { id, title, unitPrice } = product; // Now using `unitPrice`

    // Check if unitPrice is not undefined
    if (!id || !title || typeof unitPrice === "undefined") {
      Alert.alert("Error", "Product details are incomplete.");
      return;
    }

    const userCartDocRef = doc(db, "users", user.uid, "cart", "currentCart");

    try {
      const cartSnapshot = await getDoc(userCartDocRef);

      if (cartSnapshot.exists()) {
        await updateDoc(userCartDocRef, {
          items: arrayUnion({
            productID: id,
            quantity: 1,
            name: title,
            unitPrice: unitPrice, // Now using `unitPrice`
            totalPrice: unitPrice, // Initial total price is just the unit price
          }),
        });
        navigation.push("Order");
      } else {
        await setDoc(userCartDocRef, {
          items: [
            {
              productID: id,
              quantity: 1,
              name: title,
              unitPrice: unitPrice, // Now using `unitPrice`
              totalPrice: unitPrice, // Initial total price is just the unit price
            },
          ],
        });
      }
    } catch (error) {
      console.error("Error adding item to cart: ", error);
      Alert.alert("Error", "Could not add item to cart.");
    }
  };

  //  handleCreateRealEstate

  const handleCreateRealEstate = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to create a real estate entry.');
      return;
    }

    if (!isFormValid) {
      Alert.alert('Validation', 'Please fill in all fields.');
      return;
    }

    if (checkingRealEstate) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (!realEstateName.trim() || !realEstateUrl.trim()) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
  

    // Create a new document in the RealEstate collection
    try {
      await addDoc(collection(db, 'RealEstate'), {
        UID: user.uid,
        Name: realEstateName,
        RealEstateUrl: realEstateUrl,
        UserName: user.name || user.email, // Use displayName or fallback to email
      });
      Alert.alert('Success', 'Real estate entry created successfully.');
      // Clear the form fields
      setRealEstateName('');
      setRealEstateUrl('');
    } catch (error) {
      console.error('Error creating real estate entry:', error);
      Alert.alert('Error', 'There was an issue creating the real estate entry.');
    }
  };

  if (checkingRealEstate) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View className="bg-white flex-1">
      {/* destination image */}
      <Image
        source={{ uri: imageUrl }}
        style={{ width: wp(100), height: hp(55) }}
      />
      <StatusBar style={"light"} />

      {/* back button */}
      <SafeAreaView
        className={
          "flex-row justify-between items-center w-full absolute " + topMargin
        }
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2 rounded-full ml-4"
          style={{ backgroundColor: "rgba(255,255,255,0.5)" }}
        >
          <ChevronLeftIcon size={wp(7)} strokeWidth={4} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => toggleFavourite(!isFavourite)}
          className="p-2 rounded-full mr-4"
          style={{ backgroundColor: "rgba(255,255,255,0.5)" }}
        >
          <HeartIcon
            size={wp(7)}
            strokeWidth={4}
            color={isFavourite ? "red" : "white"}
          />
        </TouchableOpacity>
      </SafeAreaView>

      {/* title & descritpion & booking button */}
      <View
        style={{ borderTopLeftRadius: 40, borderTopRightRadius: 40 }}
        className="px-5 flex flex-1 justify-between bg-white pt-8 -mt-14"
      >
        <ScrollView showsVerticalScrollIndicator={false} className="space-y-5">
          <View className="flex-row justify-between items-start">
            <Text
              style={{ fontSize: wp(7) }}
              className="font-bold flex-1 text-neutral-700"
            >
              {item?.title}
            </Text>
            <Text
              style={{ fontSize: wp(7), color: theme.text }}
              className="font-semibold"
            >
              $ {item?.unitPrice}
            </Text>
          </View>
          <Text
            style={{ fontSize: wp(3.7) }}
            className="text-neutral-700 tracking-wide mb-2"
          >
            {item?.longDescription}
          </Text>
          <View className="flex-row justify-between mx-1">
            <View className="flex-row space-x-2 items-start">
              <ClockIcon size={wp(7)} color="skyblue" />
              <View className="flex space-y-2">
                <Text
                  style={{ fontSize: wp(4.5) }}
                  className="font-bold text-neutral-700"
                >
                  {item.duration}
                </Text>
                <Text className="text-neutral-600 tracking-wide">
                  مدة التنظيف
                </Text>
              </View>
            </View>
            
          </View>
       
          {!hasRealEstate && (
        <View className="p-4">
          <TextInput
            value={realEstateName}
            onChangeText={setRealEstateName}
            placeholder="Name of Estate"
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
          />
          <TextInput
            value={realEstateUrl}
            onChangeText={setRealEstateUrl}
            placeholder="Real Estate URL Location"
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
          />
          <TouchableOpacity
            onPress={handleCreateRealEstate}
            disabled={!isFormValid}
            className={`bg-blue-600 p-3 m-4 rounded-lg ${!isFormValid ? 'bg-blue-300' : ''}`}
          >
            <Text className="text-white text-center text-lg">Create Real Estate</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={{ flex: 1, backgroundColor: "white" }}>
            <TouchableOpacity
              className="bg-blue-600 p-3 m-4 rounded-lg"
              onPress={() => addToCart(item)}
            >
              <Text style={{ color: "white", fontSize: 18 }}>الدفع الان </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
   
      </View>
    </View>
  );
}

