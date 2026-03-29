import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from "@expo/vector-icons/";
import { ThemeContext } from '../../context/ThemeContext';
import { useContext } from 'react';

export default function AboutScreen() {
  const {colors} = useContext(ThemeContext);
  
  return (
          
    <ScrollView contentContainerStyle={[styles.container,{backgroundColor:colors.background}]}>

    {/* Header Cards*/ }
      <View style={[styles.card,{backgroundColor:colors.card}]}>
      <Text style={[styles.title,{color:colors.text}]}>App Name : Secure Notes</Text>
      <Text style={[styles.tag,{color:colors.textMuted}]}>Tagline : "Your Privacy ,Your Control"</Text>

      </View>
     
     {/* App Description*/}
      <View style={[styles.card,{backgroundColor:colors.card}]}>
        <Text style={[styles.heading,{color:colors.text}]}>About App </Text>
        <Text style={[styles.detail,{color:colors.textMuted}]}>
          Secure notes is a private note-taking app where your data stays safe and protected with password and security.</Text>
      </View>


    {/* Add Features */}
      <View style={[styles. card,{backgroundColor:colors.card}]}>
      <Text style={[styles.heading,{color:colors.text}]}> Features</Text>
  
        <Text style={[styles. feature,{color:colors.text}]}><Ionicons name="lock-closed" size={18} color={colors.icon}/> Password & Protected Notes</Text>
        <Text style={[styles. feature,{color:colors.text}]}><Ionicons name="brush" size={15} color={colors.icon}/> Simple & Clean UI</Text>
        <Text style={[styles. feature,{color:colors.text}]}><Ionicons name="flash-sharp" size={15} color={colors.icon}/> Fast and LightWeight</Text> 
      </View>

     {/* Developer Info */}
    <View style={[styles.card,{backgroundColor:colors.card}]}>
      <Text style={[styles.heading,{color:colors.text}]}>Developers</Text>

      <Text style={[styles.name,{color:colors.text}]}>Name : Raju Yadav</Text> 
      <Text style={[styles.role,{color:colors.textMuted}]}>Role : App Developer</Text>

      <Text style={[styles.name,{color:colors.text}]}>Name : Raja Singh Rajput </Text>
      <Text style={[styles.role,{color:colors.textMuted}]}>Role : UX Desginer </Text>  
 
      <Text style={[styles.name,{color:colors.text}]}>Name : Prachi Jaswal</Text>
      <Text style={[styles.role,{color:colors.textMuted}]}>Role : UI/UX Designer</Text>
    </View>

    {/* App info */}
    <View style={[styles.app,{backgroundColor:colors.card}]}>
      <Text style={[styles.heading,{color:colors.text}]}>App Info</Text>
      <Text style={[styles.detail,{color:colors.textMuted}]}>Version : 1.0.0</Text>
    </View>

    {/* Footer */}
      <Text style={[styles.footer,{color:colors.text}]}>Thank you for using Secure Notes ❤️</Text>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
   
  container: {
     padding: 15,
     backgroundColor:'#f5f7fa',
  },

  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    elevation:10,
    shadowColor:'blue',
  }, 


  title: { 
    fontSize: 20, 
    fontWeight:'bold',
    textAlign:'center',
    color:'#333',
  },

  tag:{
    fontSize:15,
    color:'#150e0e',
    paddingTop:5,
    textAlign:'center',
    fontStyle:'italic'
  },

  heading:{
    fontWeight:'bold',
    fontSize:20,
    color:"#6b6767",
    marginBottom:5,
  },

  detail:{
    fontSize:14,
    color:'#000',
    lineHeight:20,
    fontWeight:'500',
  },

  feature:{
    fontSize:15,
    marginVertical:5,
    color:'#666363',
    fontWeight:'600',
  },

  name:{
    fontSize:16,
    fontWeight:'bold',
    marginTop:7,
  },

  role:{
    fontSize:14,
    color:"#777",
    fontWeight:"bold",
    fontStyle:"italic",
    marginVertical:5,
  },

  footer:{
    textAlign: 'center',
    marginTop: 10,
    marginBottom:20,
    color: '#787575',
    fontWeight:"bold",
    fontSize:15,
  },

  app:{
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    elevation:20,
    marginTop:10,
    shadowColor:'#d9f507',
  },

});