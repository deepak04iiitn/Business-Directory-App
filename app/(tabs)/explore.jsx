import { View, Text, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../../constants/Colors';
import Category from '../../components/Home/Category';
import { collection, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import ExploreBusinessList from '../../components/Explore/ExploreBusinessList';

export default function explore() {

    const [businessList , setBusinessList] = useState([]);
    const [searchData , setSearchData] = useState('');

    
    const GetBusinessByCategory = async(category) => {

        setBusinessList([]);
        const q = query(collection(db , 'BusinessList') , where('category' , '==' , category))
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            setBusinessList(prev => [...prev , {id:doc.id , ...doc.data()}])
        })
    }

    const handleSearch = async () => {

      setBusinessList([]);  // Clear the previous results

      const q = query(collection(db, 'BusinessList'), where('name', '>=', searchData), where('name', '<=', searchData + '\uf8ff'));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
          setBusinessList(prev => [...prev, { id: doc.id, ...doc.data() }]);
      });
  }


  return (

    <View style={{
        padding:30
    }}>
      
        <Text style={{
            fontFamily:'outfit-bold',
            fontSize:30
        }}>Explore More</Text>

        {/* Search Bar */}
        <View style={{
            display:'flex',
            flexDirection:'row',
            gap:10,
            alignItems:'center',
            backgroundColor:'#fff',
            padding:10,
            marginVertical:10,
            marginTop:15,
            borderRadius:8,
            borderWidth:1,
            borderColor:Colors.PRIMARY
        }}>

            <Ionicons name="search" size={24} color={Colors.PRIMARY} />

            <TextInput 
                placeholder='Search...' 
                style={{
                    fontFamily:'outfit',
                    fontSize:16
                }} 
                value={searchData}
                onChangeText={setSearchData}
                onSubmitEditing={handleSearch} // Call handleSearch when Enter is pressed
            />

        </View>

        {/* Category */}
        <Category 
          explore={true}
          onCategorySelect={(category) => GetBusinessByCategory(category)}
        />

        {/* Business List */}
        <ExploreBusinessList businessList={businessList} />

    </View>
  )
}