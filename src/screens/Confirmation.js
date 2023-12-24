import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CheckCircleIcon,ChevronLeftIcon } from 'react-native-heroicons/outline'; // or any other check icon you have

const OrderConfirmationScreen = () => {
  const navigation = useNavigation();

  const handleReturnHome = () => {
    navigation.navigate('Home'); 
  };


  
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
    
    <View className='flex-1 items-center justify-center p-4 bg-white'>


      <CheckCircleIcon size={60} color="green" className='mb-4' />
      <Text className='text-xl font-bold text-gray-800 mb-3'>تم وصول الطلب</Text>
      <Text className='text-center text-gray-600 mb-8'>
تم وصول طلبك إلينا وسيتم اشعارك بالحالة قريبا في صفحة حالة الطلب
      </Text>

      <TouchableOpacity
        className='bg-blue-500 w-full py-3 rounded-full mb-5'
        onPress={handleReturnHome}
      >
        <Text className='text-white text-center text-lg font-bold '>العودة للقائمة الرئيسية</Text>

      </TouchableOpacity>

      <TouchableOpacity
        className='bg-blue-500 w-full py-3 rounded-full '
        onPress={() => navigation.push("LastOrder")}      >
        <Text className='text-white text-center text-lg font-bold'>حالة الطلب</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderConfirmationScreen;
