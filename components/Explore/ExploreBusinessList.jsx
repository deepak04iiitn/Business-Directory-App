import { View, ScrollView , Text, FlatList } from 'react-native'
import React from 'react'
import BusinessListCard from './BusinessListCard'


export default function ExploreBusinessList({businessList}) {
  return (

    <ScrollView>
        
        <FlatList 
            data={businessList}
            scrollEnabled
            renderItem={({item , index}) => (
                <BusinessListCard 
                    business={item}
                    key={index} 
                />
            )} 
        />

        <View style={{
            height:400
        }}>

        </View>

    </ScrollView>
  )
}