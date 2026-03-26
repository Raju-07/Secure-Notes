import { use, useRef, useState } from "react";
import { StyleSheet,View,Text,ScrollView,Button,Modal,Animated,Easing, TouchableWithoutFeedback } from "react-native";


export default function HomeScreen (){
    const [isModalVisible,setIsModalVisible] = useState(false);
    const slideAni = useRef(new Animated.Value(0)).current;


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
        <View style={styles.container}>
            <Text style={styles.headerText}>
                Secure Notes
            </Text>
            <ScrollView style={styles.container}>
                <Text style={styles.title}>
                    Scrollable Items like Cards, and Notes
                </Text>
                <Text style={styles.title}>
                    Scrollable Items like Cards, and Notes
                </Text>
                <Text style={styles.title}>
                    Scrollable Items like Cards, and Notes
                </Text>
                <Text style={styles.title}>
                    Scrollable Items like Cards, and Notes
                </Text>
                <Text style={styles.title}>
                    Scrollable Items like Cards, and Notes
                </Text>
                <Text style={styles.title}>
                    Scrollable Items like Cards, and Notes
                </Text>
                <Text style={styles.title}>
                    Scrollable Items like Cards, and Notes
                </Text>
                <Text style={styles.title}>
                    Scrollable Items like Cards, and Notes
                </Text>
                <Text style={styles.title}>
                    Scrollable Items like Cards, and Notes
                </Text>
                <Text style={styles.title}>
                    Scrollable Items like Cards, and Notes
                </Text>
                <Text style={styles.title}>
                    Scrollable Items like Cards, and Notes
                </Text>
                <Text style={styles.title}>
                    Scrollable Items like Cards, and Notes
                </Text>
                <Text style={styles.title}>
                    Scrollable Items like Cards, and Notes
                </Text>
                <Text style={styles.title}>
                    Scrollable Items like Cards, and Notes
                </Text>
                <Text style={styles.title}>
                    Hello world
                </Text>
                <Text style={styles.title}>
                    Hello world
                </Text>
                <Text style={styles.title}>
                    Hello world
                </Text>
            </ScrollView>


            <View style={{margin:'12',alignItems:'center',}}>
                <Button title='Add item' style={{width:"50%"}} onPress={openModal}/>
            </View>

            <Modal visible={isModalVisible} transparent animationType="none" onRequestClose={closeModal} >

                <View style={styles.backdrop}>
                    <TouchableWithoutFeedback onPress={closeModal}>
                        <View style={styles.backdropTouchable} />
                    </TouchableWithoutFeedback>

                    <Animated.View style={[
                        styles.bottomSheet,
                        {transform:[{translateY}]},
                    ]}>
                        <Text>
                            Hii I'm inside Modal
                        </Text>
                        <Button title="Close Modal" onPress={closeModal}/>
                    </Animated.View>
                  
                  </View>
            </Modal>

        </View>

    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: 60,
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
  backgroundColor: 'rgba(0,0,0,0.4)', // dim background
},
backdropTouchable: {
  flex: 1, // fills the area above the sheet so taps close it
},
bottomSheet: {
  backgroundColor: '#F1F5F9',
  padding: 20,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  minHeight: 180, // set desired height
  alignItems: 'center',
  justifyContent: 'center',
},

});

