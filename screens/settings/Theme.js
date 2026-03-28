import { useState } from "react";
import { View,Text,StyleSheet,Pressable,Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AppTheme(){
    const [IsSystem,setIsSystem] = useState(false);
    const [IsLight,setIsLight]= useState(false);
    const [IsDark,setIsDark]= useState(false);


    const toggleLock = ()=>{
        setIsSystem(!IsSystem);
        setIsLight(false);
        setIsDark(false);
    };

    const toggleLight =()=>{
        setIsLight(!IsLight);
        setIsDark(false);
        setIsSystem(false);
    };

    const toogleDark= () =>{
          setIsDark(!IsDark);
          setIsLight(false);
          setIsSystem(false);
    };
    

    return(
        <View style={styles.container}>
            <Text style={styles.title}>
                Current Theme
            </Text>

            <View style={styles.header}>
                <View style={styles.together}>      
                    <Ionicons name={IsSystem ? 'cog-outline': IsLight ? 'sunny-outline' : 'moon-outline'} size={30} />
                    <Text style={styles.option}>
                        {IsSystem ? 'System' : IsLight ? 'Light Theme' : 'Dark Theme'}
                    </Text>
                </View>
                <Switch 
                thumbColor={ true ? 'pink':'white'} 
                trackColor={{false:'#d7c6c6',true:'#d6aad6'}}
                value={true} 
                onValueChange={toggleLock}
                disabled
                />
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
                
               <Switch 
                thumbColor={ IsSystem ?'pink':'white'} 
                trackColor={{false:'#d7c6c6',true:'#d6aad6'}}
               value={IsSystem} 
               onValueChange={toggleLock}
               disabled={IsSystem}/>

            </View>

            <View style={styles.header}>
                <View style={styles.together}>
                    <Ionicons name="sunny-outline" size={30} />
                    <Text style={styles.option}>
                        Light Theme
                    </Text>
                </View>

               <Switch 
                thumbColor={ IsLight ?'pink':'white'} 
               trackColor={{false:'#d7c6c6',true:'#d6aad6'}}
               value={IsLight} 
               onValueChange={toggleLight}
               disabled={IsLight}   
               />
            </View>
            
            <View style={styles.header}>
                <View style={styles.together}>
                    <Ionicons name="moon-outline" size={30} />
                    <Text style={styles.option}>
                        Dark Theme
                    </Text>
                </View>

                <Switch 
                    thumbColor={ IsDark ?'pink':'white'} 
                    trackColor={{false:'#d7c6c6',true:'#d6aad6'}} 
                    value={IsDark} 
                    onValueChange={toogleDark}
                    disabled={IsDark}
                    />

            </View>

        </View>
)}

const styles = StyleSheet.create({
    container:{flex:1},
    title:{
        fontSize:20,
        fontWeight:600,
        margin:20,},

    header:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginLeft:20,
        marginTop:8,
        marginRight:20,
        padding:5,
        alignItems:"center",
        backgroundColor:'#6cc2ad18',
        borderRadius:15,
    },

    option:{
        fontSize:16,
        margin:20,
        fontWeight:500, 
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