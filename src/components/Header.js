import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { LinearGradient } from 'expo-linear-gradient';
import { HeartIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';

export default class Header extends Component {
     Header = ({ title, onBackPress, onRightPress, rightIcon }) => {
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
}
