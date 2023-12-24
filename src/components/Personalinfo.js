import React, {useState} from 'react';
import { View, Text, Image } from 'react-native';

const PersonalComponent = ({ name, email, imageUrl }) => {
    name='ibrahem dhaher'
    email='ibrahemdh7@gmail.com'
    imageUrl='../../assets/images/1.png'
    
  return (
    <View className='p-4 rounded-lg '>
      {/* Profile Image */}
   
      {/* Name and Email */}
      <Text className='mt-2 text-lg '>{name}</Text>
      <Text className='text-sm text-gray-600'>{email}</Text>
    </View>
  );
};

export default PersonalComponent;
