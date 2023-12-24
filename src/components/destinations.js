import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { LinearGradient } from 'expo-linear-gradient';
import { HeartIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

export default function Destinations() {
    const navigation = useNavigation();
    const [destinations, setDestinations] = useState([]);
    const db = getFirestore();

    
    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "products"));
                const fetchedDestinations = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setDestinations(fetchedDestinations);
            } catch (error) {
                console.error("Error fetching destinations: ", error);
            }
        };

        fetchDestinations();
    }, []);

    return (
        <View className="mx-4 flex-row justify-between flex-wrap">
            {destinations.map((item, index) => (
                <DestinationCard navigation={navigation} item={item} key={item.id} />
            ))}
        </View>
    );
}
const DestinationCard = ({ item, navigation }) => {
    const [isFavourite, toggleFavourite] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        // Check if the imageUrl field is a gs:// URL and convert to HTTP URL
        if (item.imageUrl && item.imageUrl.startsWith('gs://')) {
            const storage = getStorage();
            const imageRef = ref(storage, item.imageUrl); // Use the gs:// URL directly here

            getDownloadURL(imageRef)
                .then((url) => {
                    setImageUrl(url); // This will be the HTTP URL
                })
                .catch((error) => {
                    console.error("Error fetching image URL: ", error);
                });
        } else {
            // If imageUrl is already an HTTP URL, use it directly
            setImageUrl(item.imageUrl);
        }
    }, [item.imageUrl]);
    
    return (
        <TouchableOpacity
            onPress={() => navigation.navigate('Destination', { ...item })}
            style={{ width: wp(44), height: wp(65) }}
            className="flex justify-end relative p-4 py-6 space-y-2 mb-5"
        >
            {imageUrl ? (
                <Image
                    source={{ uri: imageUrl }}
                    style={{ width: wp(44), height: wp(65), borderRadius: 35 }}
                    className="absolute"
                />
            ) : (
                <Text>Loading image...</Text>
            )}

            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={{width: wp(44), height: hp(15), borderBottomLeftRadius: 35, borderBottomRightRadius: 35}}
                start={{x: 0.5, y: 0}}
                end={{x: 0.5, y: 1}}
                className="absolute bottom-0"
            />

            <TouchableOpacity onPress={()=> toggleFavourite(!isFavourite)} style={{backgroundColor: 'rgba(255,255,255,0.4)'}} className="absolute top-1 right-3 rounded-full p-3">
                <HeartIcon size={wp(5)} color={isFavourite? "red": "white"} />
            </TouchableOpacity>

            <Text style={{fontSize: wp(4)}} className="text-white font-semibold">{item.title}</Text>
            <Text style={{fontSize: wp(2.2)}} className="text-white">{item.shortDescription}</Text>

        </TouchableOpacity>
    )
}