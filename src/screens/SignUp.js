import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { signInWithEmailAndPassword,createUserWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_DB, FIREBASE_AUTH,firebase } from '../../firebase';
import { collection, doc, setDoc } from 'firebase/firestore';

export default function SignupScreen() {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const auth = FIREBASE_AUTH

   const SignUp = async () => {
    try {
        // Create a new user using Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
        console.log('Firebase Auth User Created:', userCredential.user);

        const userDocRef = doc(FIREBASE_DB, 'users', userCredential.user.uid);
        await setDoc(userDocRef, {
            name: name,
            email: email,
            phone:phone,
            uid: userCredential.user.uid
        });

        console.log('User document created in Firestore');
    } catch (error) {
        console.error("SignUp failed:", error);
        Alert.alert("SignUp failed", error.message);
    }
};

  return (
    <View className="bg-white h-full w-full">
      <StatusBar style="light" />
      <Image className=" w-full absolute h-[700]" source={require('../../assets/images/background.png')} />

      {/* lights */}
      <View className="flex-row justify-around w-full absolute">
        <Animated.Image 
            entering={FadeInUp.delay(200).duration(1000).springify()} 
            source={require('../../assets/images/light.png')} 
            className="h-[225] w-[90]"
        />
        <Animated.Image 
            entering={FadeInUp.delay(400).duration(1000).springify()} 
            source={require('../../assets/images/light.png')} 
            className="h-[160] w-[65] opacity-75" 
        />
      </View>

      {/* title and form */}
      <View  className="h-full w-full flex justify-around pt-48">
        
        {/* title */}
        <View className="flex items-center">
            <Animated.Text 
                entering={FadeInUp.duration(1000).springify()} 
                className="text-white font-bold tracking-wider text-5xl">
                التسجيل
            </Animated.Text>
        </View>

        {/* form */}
        <View className="flex items-center mx-5 space-y-4">
            <Animated.View 
                entering={FadeInDown.duration(1000).springify()} 
                className="bg-black/5 p-5 rounded-2xl w-full">
                <TextInput
                    placeholder="إسم المستخدم"
                    placeholderTextColor={'gray'}
                    onChangeText={setName}

                />
            </Animated.View>

            <Animated.View 
                entering={FadeInDown.delay(200).duration(1000).springify()} 
                className="bg-black/5 p-5 rounded-2xl w-full">
                <TextInput
                    placeholder="البريد الإلكتروني"
                    placeholderTextColor={'gray'}
                    onChangeText={setEmail}
                    keyboardType="email-address"

                />
            </Animated.View>
            <Animated.View 
                entering={FadeInDown.delay(200).duration(1000).springify()} 
                className="bg-black/5 p-5 rounded-2xl w-full">
                <TextInput
                    placeholder="رقم الهاتف"
                    placeholderTextColor={'gray'}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    />
            </Animated.View>

            <Animated.View 
                entering={FadeInDown.delay(400).duration(1000).springify()} 
                className="bg-black/5 p-5 rounded-2xl w-full mb-3">
                <TextInput
                    placeholder="كلمة المرور"
                    placeholderTextColor={'gray'}
                    secureTextEntry
                    onChangeText={setPassword}

                />
            </Animated.View>

     

            <Animated.View className="w-full" entering={FadeInDown.delay(600).duration(1000).springify()}>
                <TouchableOpacity onPress={SignUp} className="w-full bg-sky-400 p-3 rounded-2xl mb-2">
                    <Text className="text-xl font-bold text-white text-center">تسجيل الحساب</Text>
                </TouchableOpacity>
            </Animated.View>

            <Animated.View 
                entering={FadeInDown.delay(800).duration(1000).springify()} 
                className="flex-row justify-center">

                <Text>لديك حساب مسبقا؟ </Text>
                <TouchableOpacity onPress={()=> navigation.push('Login')}>
                    <Text className="text-sky-600">الدخول</Text>
                </TouchableOpacity>

            </Animated.View>
        </View>
      </View>
    </View>
  )
}