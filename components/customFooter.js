import { View, Text, Pressable } from "react-native";
import { styles } from "../styles";

const CustomFooter = ({
  navigation
}) => {
    function navigateToCollection(){
        navigation.navigate("Collection")
    }

    function navigateToHome(){
        navigation.navigate("Home")
    }

  return (
    <View style={styles.footer.whole}>
      <View style={styles.footer.top}>
        <Pressable style={styles.footer.button} onPress={()=>navigateToHome()}>
            
            <Text>
                Home
            </Text>
        </Pressable>
        <Pressable style={styles.footer.button} onPress={()=>navigateToCollection()}>
            <Text>
                Collection
            </Text>
        </Pressable>
      </View>
      <View style={styles.footer.bottom}></View>
    </View>
  );
};

export default CustomFooter;
