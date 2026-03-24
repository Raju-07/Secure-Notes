import react from "react";
import { View,Platform,Text, StyleSheet } from "react-native";


export default function ShareScreen(){
    return(
        <View style={Styles.container}>
            <Text style={Styles.text}>
                "This is a Share Page"
            </Text>
        </View>
    )
}

const Styles = StyleSheet.create({
    container:{flex:1,alignItems:'center',justifyContent:'center'},
    text:{fontSize:18,color:'green'}
})