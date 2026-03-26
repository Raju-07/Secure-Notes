import react from "react";
import { View,Text,StyleSheet, } from "react-native";

export default function AppTheme(){
    return(
        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
            <Text style={{fontSize:15,color:'doggerblue'}}>
                This screen is for AppTheme
            </Text>
        </View>
    )
}