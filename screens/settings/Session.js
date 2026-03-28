import { View,Platform,Text, StyleSheet } from "react-native";


export default function SessionScreen(){
    return(
        <View style={Styles.container}>
            <Text style={Styles.text}>
                "This is a Session Page"
            </Text>
        </View>
    )
}

const Styles = StyleSheet.create({
    container:{flex:1,alignItems:'center',justifyContent:'center'},
    text:{fontSize:18,color:'green'}
})