import { View, Text, Image, SafeAreaView, TextInput, TouchableOpacity,ImageBackground, KeyboardAvoidingView } from 'react-native'
import React, {useState} from 'react'
import { StatusBar } from 'expo-status-bar'
import { useNavigation } from '@react-navigation/native'
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { FIREBASE_AUTH } from '../../firebase';
import { async } from '@firebase/util';
import { signInWithEmailAndPassword,createUserWithEmailAndPassword } from 'firebase/auth';


export default function LoginScreen() {

    const navigation = useNavigation();
    const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const auth = FIREBASE_AUTH

const handelLogin = async ()=>{
    try{
        const response = await signInWithEmailAndPassword(auth,email,password)
        console.log(response)
        
    }
    catch(error){
alert(`Error${error.message}`)
    }
}
  return (
    <View className="bg-white h-full w-full">
        <StatusBar style="light" />
        <KeyboardAvoidingView behavior='padding'>

        <Image className="h-full w-full absolute" source={require('../../assets/images/background.png')} />

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
        <View className="h-full w-full flex justify-around pt-40 pb-10">
            
            {/* title */}
            <View className="flex items-center">

                <Animated.Text 
                    entering={FadeInUp.duration(1000).springify()} 
                    className="text-white font-bold tracking-wider text-5xl">
                        الدخول
                </Animated.Text>
            </View>

            {/* form */}
            <View className="flex items-center mx-5 space-y-4">
                <Animated.View 
                    entering={FadeInDown.duration(1000).springify()} 
                    className="bg-black/5 p-5 rounded-2xl w-full">
<TextInput
                    placeholder="إيميلك"
                    placeholderTextColor={'gray'}
                    value={email}
                    onChangeText={(text)=> setEmail(text)}
                />
                </Animated.View>
                <Animated.View 
                    entering={FadeInDown.delay(200).duration(1000).springify()} 
                    className="bg-black/5 p-5 rounded-2xl w-full mb-3">

                    <TextInput
                        placeholder="كلمة المرور"
                        placeholderTextColor={'gray'}
                        secureTextEntry
                        value={password}
                        onChangeText={(text)=> setPassword(text)}

                    />
                </Animated.View>

                <Animated.View 
                    className="w-full" 
                    entering={FadeInDown.delay(400).duration(1000).springify()}>

                    <TouchableOpacity onPress={handelLogin} className="w-full bg-sky-400 p-3 rounded-2xl mb-3" 
                    >
                        
                        <Text className="text-xl font-bold text-white text-center">دخول</Text>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View 
                    entering={FadeInDown.delay(600).duration(1000).springify()} 
                    className="flex-row justify-center">

                    <Text>لا تملك حساب؟ </Text>
                    <TouchableOpacity onPress={()=> navigation.push('SignUp')}>
                        <Text className="text-sky-600">التسجيل</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </View>
        </KeyboardAvoidingView>

    </View>

  )
}