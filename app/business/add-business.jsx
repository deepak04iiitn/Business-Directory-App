import { View, Text, Image, TouchableOpacity, TextInput, ToastAndroid, ActivityIndicator, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from 'expo-router'
import { Colors } from '../../constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import RNPickerSelect from 'react-native-picker-select';
import { collection, doc, getDocs, query, setDoc } from 'firebase/firestore';
import { db, storage } from '../../configs/FirebaseConfig';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useUser } from '@clerk/clerk-expo';


export default function AddBusiness() {

    const navigation = useNavigation();
    const [image , setImage] = useState(null);
    const [categoryList , setCategoryList] = useState([]);

    const [name , setName] = useState();
    const [address , setAddress] = useState();
    const [contact , setContact] = useState();
    const [website , setWebsite] = useState();
    const [about , setAbout] = useState();
    const [category , setCategory] = useState();
    const [loading , setLoading] = useState(false);

    const {user} = useUser();


    useEffect(() => {

        navigation.setOptions({
            headerTitle:'Add New Business',
            headerShown:true,
        })

        GetCategoryList()

    } , [])


    const onImagePick = async() => {
        
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        setImage(result?.assets[0].uri);

    }


    const GetCategoryList = async() => {

        setCategoryList([]);

        const q = query(collection(db , 'Category'));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            setCategoryList(prev => [...prev , {
                label : (doc.data()).name,
                value : (doc.data()).name
            }])
        })

    }


    const onAddNewBusiness = async() => {

        setLoading(true);

        const fileName = Date.now().toString() + ".jpg";
        const resp = await fetch(image);
        const blob = await resp.blob();                // we will upload this blob file on firebase storage

        const imageRef = ref(storage , 'business-app/' + fileName);

        uploadBytes(imageRef , blob).then((snapshot) => {
            console.log("File uploaded")
        }).then(resp => {
            getDownloadURL(imageRef).then(async(downloadUrl) => {
                console.log(downloadUrl);
                saveBusinessDetail(downloadUrl);
            })
        })

        setLoading(false);
    }


    const saveBusinessDetail = async(imageUrl) => {
        await setDoc(doc(db , 'BusinessList' , Date.now().toString()) , {
            name : name,
            address : address,
            contact : contact,
            about : about,
            website : website,
            category : category,
            username : user?.fullName,
            userEmail : user?.primaryEmailAddress?.emailAddress,
            userImage : user?.imageUrl,
            imageUrl : imageUrl
        })

        setLoading(false);

        ToastAndroid.show('New business added...' , ToastAndroid.LONG);
    }


  return (

    <KeyboardAvoidingView style={{
        padding:20
    }}>

        <Text style={{
            fontFamily:'outfit-bold',
            fontSize:25
        }}>Add New Business</Text>

        <Text style={{
            fontFamily:'outfit',
            color:Colors.GRAY
        }}>Fill all details in order to add new business</Text>


        <TouchableOpacity 
            style={{
                marginTop:20
            }}
            onPress={() => onImagePick()}
        >

            {!image ? (
                <Image 
                    source={require('./../../assets/images/imagepicker.jpg')}
                    style={{
                        width: 100,
                        height: 100
                    }} 
                />
            ) : (
                <Image 
                    source={{ uri: image }}
                    style={{
                        width: 100,
                        height: 100,
                        borderRadius:15
                    }} 
                />
            )}


        </TouchableOpacity>

        <View>

            <TextInput placeholder='Your name'
                onChangeText={(v) => setName(v)}
                style={{
                    padding:10,
                    borderWidth:1,
                    borderRadius:5,
                    fontSize:17,
                    backgroundColor:'#fff',
                    marginTop:10,
                    borderColor:Colors.PRIMARY,
                    fontFamily:'outfit'
                }} 
            />

            <TextInput placeholder='Address'
                onChangeText={(v) => setAddress(v)}
                style={{
                    padding:10,
                    borderWidth:1,
                    borderRadius:5,
                    fontSize:17,
                    backgroundColor:'#fff',
                    marginTop:10,
                    borderColor:Colors.PRIMARY,
                    fontFamily:'outfit'
                }} 
            />

            <TextInput placeholder='Contact'
                onChangeText={(v) => setContact(v)}
                style={{
                    padding:10,
                    borderWidth:1,
                    borderRadius:5,
                    fontSize:17,
                    backgroundColor:'#fff',
                    marginTop:10,
                    borderColor:Colors.PRIMARY,
                    fontFamily:'outfit'
                }} 
            />

            <TextInput placeholder='Website'
                onChangeText={(v) => setWebsite(v)}
                style={{
                    padding:10,
                    borderWidth:1,
                    borderRadius:5,
                    fontSize:17,
                    backgroundColor:'#fff',
                    marginTop:10,
                    borderColor:Colors.PRIMARY,
                    fontFamily:'outfit'
                }} 
            />

            <TextInput placeholder='About'
                multiline
                numberOfLines={5}
                onChangeText={(v) => setAbout(v)}
                style={{
                    padding:10,
                    borderWidth:1,
                    borderRadius:5,
                    fontSize:17,
                    backgroundColor:'#fff',
                    marginTop:10,
                    borderColor:Colors.PRIMARY,
                    fontFamily:'outfit',
                    height:100,
                    textAlignVertical:'top'
                }} 
            />

            <View style={{
                borderWidth:1,
                borderRadius:5,
                backgroundColor:'#fff',
                marginTop:10,
                borderColor:Colors.PRIMARY,
            }}>

                <RNPickerSelect
                    onValueChange={(value) => setCategory(value)}
                    items={categoryList}
                />

            </View>

        </View>

        <TouchableOpacity 
            onPress={() => onAddNewBusiness()}
            disabled={loading}
            style={{
                padding:15,
                backgroundColor:Colors.PRIMARY,
                borderRadius:5,
                marginTop:20
            }}
        >

            {loading ?
                <ActivityIndicator size="large" color="#fff" /> 
                : 
                <Text style={{
                    textAlign:'center',
                    fontFamily:'outfit-medium',
                    color:'#fff'
                }}>Add New Business</Text>
            }

        </TouchableOpacity>

    </KeyboardAvoidingView>
  )
}