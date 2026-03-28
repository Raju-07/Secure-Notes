import { useContext, useRef, useState } from "react";
import { StyleSheet,View,Text,ScrollView,Button,Modal,Animated,Easing, TouchableWithoutFeedback,Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from '../context/ThemeContext';  // imported Theme Provider


export default function HomeScreen (){
    const [isModalVisible,setIsModalVisible] = useState(false);
    const slideAni = useRef(new Animated.Value(0)).current;
    const { colors } = useContext(ThemeContext);
    // Modal Options

    const options = [
    {id:'1',name:"Password",icon:'lock-closed-outline'},
    {id:'2',name:'Notes',icon:'document-text-outline'},
    {id:'3',name:'Events',icon:'calendar-outline'},
    {id:'4',name:'PassKey',icon:'key-outline'},
    {id:'5',name:'Remind',icon:'alarm-outline'},
    {id:'6',name:'Photo',icon:'image'},
    ]


    // OPEN Modal
    const openModal = () => {
        setIsModalVisible(true);
        Animated.timing(slideAni,{
            toValue:1,
            duration:300,
            easing:Easing.out(Easing.poly(4)),
            useNativeDriver:true
        }).start()
    }

    //CLOSE Modal
    const closeModal = () => {
        Animated.timing(slideAni,{
            toValue:0,
            duration:250,
            easing:Easing.in(Easing.poly(4)),
            useNativeDriver:true
        }).start(()=> setIsModalVisible(false));
    }

    const translateY = slideAni.interpolate({
        inputRange:[0,1],
        outputRange:[300,0]
    })

    return(
      <View style={[styles.container,{backgroundColor:colors.background}]}>
      {/* Branding */}
        <Text style={[styles.headerText,{color:colors.text}]}>Secure Notes</Text>

      {/* Screen Content i.e. cards */}
      {/* Full Home Screen */}
        <ScrollView style={styles.container}>
          <Text style={[styles.title,{color:colors.text}]}>Hello world</Text>
        </ScrollView>

     {/* Add Button */}
        <Pressable  style={[styles.fab,{backgroundColor:colors.button}]}
          onPress={() => openModal()}
          accessibilityLabel="Add item">  
          <Ionicons name="add" size={28} color={colors.icon} />
          </Pressable>

      {/* Modal for Add option */}
        <Modal
          visible={isModalVisible}
          transparent
          onRequestClose={closeModal} >
          <View style={styles.backdrop}>
            <TouchableWithoutFeedback onPress={closeModal}>
              <View style={styles.backdropTouchable} />
            </TouchableWithoutFeedback>

            <Animated.View style={[
              styles.bottomSheet,{backgroundColor:colors.bottomSheet},
              {transform:[{translateY}]},
              ]}>
                <View style={styles.grid} >
                  {
                    options.map(option => (
                      <Pressable 
                        key={option.id}
                        style={styles.cell}
                        onPress={()=> console.log("pressed",option.name)}>
                          <Ionicons name={option.icon} size={36} color={colors.icon}/>
                          <Text style={[styles.label,{color:colors.text}]}> {option.name} </Text>
                      </Pressable>
                        ))
                      }
                </View>
            </Animated.View>
                    
          </View>
        </Modal>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 20,
    color: '#1E293B',
  },
  section: {
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  title: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '500',
    paddingTop:30,
    paddingLeft:50,
  },
  backdrop: {
  flex: 1,
  justifyContent: 'flex-end', // align bottom sheet to bottom
  backgroundColor: 'rgba(0, 0, 0, 0.17)', // dim background
},
backdropTouchable: {
  flex: 1, // fills the area above the sheet so taps close it
},
bottomSheet: {
  padding: 20,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  minHeight: 220, // set desired height
  alignItems: 'center',
  justifyContent: 'center',
},
fab: {
  position: 'absolute',
  right: 20,
  bottom: 28,
  width: 65,
  height: 52,
  borderRadius: 10,
  backgroundColor: '#072e58', // or your accent color
  alignItems: 'center',
  justifyContent: 'center',
  elevation: 6,              // Android shadow
  shadowColor: '#000',       // iOS shadow
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
},
grid:{
  flexDirection:'row',
  flexWrap:'wrap',
  marginHorizontal:12
},

cell:{
  width:'33.3333%',
  alignItems:'center',
  padding:12
},

label:{
  marginTop:8,
  fontSize:12,
}


});

