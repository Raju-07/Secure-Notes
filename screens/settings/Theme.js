import { useState } from "react";
import { View,Text,StyleSheet,Pressable,Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AppTheme(){
    const [isLocked,setIsLocked] = useState(false);
    const [isLightLock,setIsLightLock]= useState(false);
    const [isDarkLock,setIsDarkLock]= useState(false);


    const toggleLock = ()=>{
        setIsLocked(!isLocked);
    };

    const toggleLight =()=>{
        setIsLightLock(!isLightLock);
    };

    const toogleDark= () =>{
          setIsDarkLock(!isDarkLock);
    };
    

    return(
        <View style={styles.container}>
            <Text style={styles.title}>
                Current Theme
            </Text>

            <View style={styles.header}>
                <View style={styles.together}>
                    <Ionicons name="cog-outline" size={30} />
                    <Text style={styles.option}>
                        System
                    </Text>
                </View>
                <Switch value={isLocked} onValueChange={toggleLock}/>
            </View>


            <Text style={styles.title}>
                Select Theme
            </Text>

            <View style={styles.header}>
                <View style={styles.together}>
                <Ionicons name="cog-outline" size={30} />
                <Text style={styles.option}>
                    System
                </Text>
                </View>
                
               <Switch value={isLocked} onValueChange={toggleLock}/>
            </View>

            <View style={styles.header}>
                <View style={styles.together}>
                    <Ionicons name="sunny-outline" size={30} />
                    <Text style={styles.option}>
                        Light Theme
                    </Text>
                </View>

               <Switch value={isLightLock} onValueChange={toggleLight}/>
            </View>
            
            <View style={styles.header}>
                <View style={styles.together}>
                <Ionicons name="moon-outline" size={30} />
                <Text style={styles.option}>
                    Dark Theme
                </Text>

                 </View>
               <Switch value={isDarkLock} onValueChange={toogleDark}/>
            </View>


        </View>
)}

const styles = StyleSheet.create({
    container:{flex:1},
    title:{
        fontSize:25,
        fontWeight:600,
        margin:20,},
    header:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginLeft:20,
        marginTop:8,
        marginRight:20,
        padding:10,
        alignItems:"center",
        backgroundColor:'#6cc2ad18',
        borderRadius:15,
    },

    option:{
        fontSize:20,
        margin:20,
        fontWeight:400, 
    },

    together:{
        flexDirection:'row',
        alignItems:'center',
    },
    
    btnStyle:{
        backgroundColor:"black",
        paddingRight:8,
        margin:20,
    }
    

})