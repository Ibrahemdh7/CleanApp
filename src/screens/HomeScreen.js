import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  TextInput,
} from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Categories from "../components/categories";
import SortCategories from "../components/sortCategories";
import Destinations from "../components/destinations";
import { useNavigation } from "@react-navigation/native";
import {
  ChevronLeftIcon,
  ShoppingCartIcon,
  UserIcon,
  ShoppingBagIcon,
} from "react-native-heroicons/outline"; // Make sure you have this package or replace with an alternative icon

const ios = Platform.OS == "ios";
const topMargin = ios ? "mt-3" : "mt-10";
export default function HomeScreen() {
  const navigation = useNavigation();

  const Header = ({ title, onBackPress, onRightPress, rightIcon }) => {
    return (
      <View className="flex-row items-center px-4 py-3  bg-blue-600 shadow-md">
        <TouchableOpacity
          onPress={onBackPress}
          className="p-2 rounded-full bg-blue-700 mr-2"
        >
          <ChevronLeftIcon size={24} color="white" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-white text-xl font-semibold">
          {title}
        </Text>
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightPress}
            className="p-2 rounded-full bg-blue-700 ml-2"
          >
            {/* Right icon component should be passed in via props */}
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
    );
  };
  return (
    <SafeAreaView className=" ">
      <ScrollView showsVerticalScrollIndicator={false} className="space-y-6">
        <Image
          className="h-full w-full absolute"
          source={require("../../assets/images/background.png")}
        />

        {/* avatar */}

        <View className="flex-row justify-between items-center mx-6 ">
          <View className="flex-3">
            <Text style={{ fontSize: wp(7) }} className="font-bold text-white">
              خدماتنا!
            </Text>
          </View>

         

          <View className="flex-row justify-items-center">
    <TouchableOpacity onPress={() => navigation.push("LastOrder")}>
        <ShoppingBagIcon size={26} color="white" />
    </TouchableOpacity>

    <TouchableOpacity
      className="mx-2"
      onPress={() => navigation.navigate("Order")}
    >
        <ShoppingCartIcon size={26} color="white" />
    </TouchableOpacity>

    {/* Keep the same for the last item if you want it to align with the edges */}
    <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
        <UserIcon size={26} color="white" />
    </TouchableOpacity>
</View>

        </View>

        {/* search bar */}

        {/* categories */}
        <View className="mb-4">
          <Categories />
        </View>

        {/* sort categories */}
        <View className="mb-4">
          <SortCategories />
        </View>

        {/* destinations */}
        <View>
          <Destinations />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
