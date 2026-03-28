import React,{ useContext, useState } from "react";
import { View,Text,StyleSheet,Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../../context/ThemeContext";

export default function AppTheme(){
    const {theme,updateTheme,colors} = useContext(ThemeContext);

    const IsSystem = theme === 'system'
    const IsLight = theme === 'light'
    const IsDark = theme === 'dark'


    const toggleSystem = () => updateTheme('system')
    const toggleLight = () => updateTheme('light')
    const toggleDark = () => updateTheme('dark')

    return(
        <View style={[styles.container,{backgroundColor:"#000"}]}>
            <Text style={[styles.title,{color:colors.text}]}>
                Current Theme
            </Text>

            <View style={styles.header}>
                <View style={styles.together}>      
                    <Ionicons
                     name={IsSystem ? 'cog-outline': IsLight ? 'sunny-outline' : 'moon-outline'}
                     size={30} 
                     color={colors.text}
                    />
                    <Text style={[styles.option,{color:colors.text}]}>
                        {IsSystem ? 'System' : IsLight ? 'Light Theme' : 'Dark Theme'}
                    </Text>
                </View>
                <Switch 
                thumbColor={ 'pink'} 
                trackColor={{false:'#d7c6c6',true:'#d6aad6'}}
                value={true} 
                disabled
                />
            </View>


            <Text style={[styles.title,{color:colors.text}]}>
                Select Theme
            </Text>

            <View style={styles.header}>
                <View style={styles.together}>
                <Ionicons name="cog-outline" size={30} />
                <Text style={[styles.option,{color:colors.text}]}>System</Text>
                </View>
                
               <Switch 
                thumbColor={ IsSystem ?'pink':'white'} 
                trackColor={{false:'#d7c6c6',true:'#d6aad6'}}
               value={IsSystem} 
               onValueChange={toggleSystem}
               disabled={IsSystem}/>

            </View>

            <View style={styles.header}>
                <View style={styles.together}>
                    <Ionicons name="sunny-outline" size={30} />
                    <Text style={[styles.option,{color:colors.text}]}>
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
                    <Text style={[styles.option,{color:colors.text}]}>Dark Theme</Text>
                </View>

                <Switch 
                    thumbColor={ IsDark ?'pink':'white'} 
                    trackColor={{false:'#d7c6c6',true:'#d6aad6'}} 
                    value={IsDark} 
                    onValueChange={toggleDark}
                    disabled={IsDark}
                    />
            </View>
        </View>
);
}

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