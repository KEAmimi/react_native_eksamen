import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { app, database, auth } from "../firebase.js";
import { styles } from "../styles.js";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback, useState } from "react";
import CustomHeader from "../components/customHeader.js";
import CustomFooter from "../components/customFooter.js";

export function HomeScreen({ navigation, route }) {
  function displayUID() {
    alert(auth.currentUser.uid);
  }

  function viewUser() {
    navigation.navigate("Profile");
  }

  function viewCollection(){
    navigation.navigate("Collection")
  }

    function viewCamera(){
    navigation.navigate("Camera")
  }


  return (
    <SafeAreaView style={styles.background}>
      <CustomHeader
      onLeftPress={()=>{}}
      leftLabel={""}
      title={"Home"}
      onRightPress={()=>navigation.navigate("Profile")}
      rightLabel={"profile"}
      />
      <View style={styles.content}>
        <Pressable onPress={() => viewCollection()} style={styles.box}>
          <Text style={styles.buttonText}>Go to Collection</Text>
        </Pressable>
        <Pressable onPress={() => viewCamera()}>
          <Text style={styles.buttonText}>Go to Camera</Text>
        </Pressable>
      </View>
      <CustomFooter
        navigation={navigation}
      />
    </SafeAreaView>
  );
}

export function ProfileScreen({navigation, route}) {

  async function logout() {
    Alert.alert("logout?", "Are you sure you want to log out?", [
      { text: "cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => auth.signOut() },
    ]);
  }

  return (
    <SafeAreaView>
      <CustomHeader
      onLeftPress={()=>navigation.goBack()}
      leftLabel={"back"}
      title={"Profile"}
      onRightPress={()=>{}}
      rightLabel={""}
      />
      <View>
        <Text>ProfileScreen</Text>
        <Text>{auth.currentUser.uid}</Text>
        <Text>{auth.currentUser.email}</Text>
        <Pressable onPress={() => logout()}>
          <Text style={styles.buttonText}>logout</Text>
        </Pressable>
        
      </View>
    </SafeAreaView>
  );
}
