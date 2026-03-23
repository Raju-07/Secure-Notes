import react from "react";
import { StyleSheet,View,Text,ScrollView } from "react-native";


export default function HomeScreen (){
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
});

