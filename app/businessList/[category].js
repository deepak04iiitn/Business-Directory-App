// its a dynamic route , which means that category name can change anytime => businessList/category

import { View, Text, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { collection, query , where, getDocs } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import BusinessListCard from '../../components/BusinessList/BusinessListCard';
import { Colors } from '../../constants/Colors';

export default function BusinessListByCategory() {

    const [businessList , setBusinessList] = useState([]);
    const [loading , setLoading] = useState(false);

    const navigation = useNavigation();
    const {category} = useLocalSearchParams();             // the {} should be same as the category name in the file []

    useEffect(() => {
        navigation.setOptions({
            headerShown:true,
            headerTitle:category
        })
        getBusinessList();
    } , []);


    /**
     * used to get business list by category
     */

    const getBusinessList = async() => {

        setLoading(true);

        const q = query(collection(db , 'BusinessList') , where("category" , '==' , category));

        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            setBusinessList(prev => [...prev , doc.data()]);
        })

        setLoading(false);

    }


  return (
    <View>

      {businessList?.length > 0 && loading === false ? 
        <FlatList
            data={businessList}
            onRefresh={getBusinessList}                   // pull to refresh
            refreshing={loading}
            renderItem={({item , index}) => (
                <BusinessListCard business={item} key={index} />
            )} 
        /> :
            loading ? <ActivityIndicator size={'large'} color={Colors.PRIMARY} style={{
                marginTop:'60%'
            }} /> :
            <Text style={{
              fontSize:20,
              fontFamily:'outfit-bold',
              color:Colors.GRAY,
              textAlign:'center',
              marginTop:'50%'
            }}>No Business Found</Text>
        }
    </View>
  )
}