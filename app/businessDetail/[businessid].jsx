import { View, Text, ActivityIndicator, ScrollView, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import { Colors } from '../../constants/Colors';
import Intro from '../../components/BusinessDetail/Intro';
import ActionButton from '../../components/BusinessDetail/ActionButton';
import About from '../../components/BusinessDetail/About';
import Reviews from '../../components/BusinessDetail/Reviews';


export default function BusinessDetail() {
    const [business, setBusiness] = useState();
    const [loading, setLoading] = useState(false);
    const { businessid } = useLocalSearchParams();

    useEffect(() => {
        GetBusinessDetailById();
    }, []);

    const GetBusinessDetailById = async () => {
        setLoading(true);
        const docRef = doc(db, 'BusinessList', businessid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setBusiness({ id: docSnap.id, ...docSnap.data() });
        } else {
            console.log("No such document!");
        }
        setLoading(false);
    };

    if (loading) {
        return <ActivityIndicator size="large" color={Colors.PRIMARY} style={{ marginTop: '70%' }} />;
    }

    return (
        <ScrollView>
        
        {loading ? 
            <ActivityIndicator size={'large'} color={Colors.PRIMARY} style={{marginTop:'70%'}} /> :
            <View>
                {/* Intro */}
                <Intro business={business} />

                {/* Action Buttons */}
                <ActionButton business={business} />

                {/* About Section */}
                <About business={business} />

                {/* Review Section */}
                <Reviews business={business} />

            </View>
        }
      
    </ScrollView>
    );
}
