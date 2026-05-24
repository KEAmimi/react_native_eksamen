import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import { app, database, auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { HomeScreen, ProfileScreen } from "./pages/userPages.js";
import { LoginScreen, RegisterScreen } from "./pages/loginRegister.js";
import { CollectionScreen } from "./pages/collection.js";
import cameraPageTest from "./pages/cameraTestPage.js";
import ScanPage from "./pages/scanpage.js";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useFonts } from "expo-font";
import { Camera, House, User, Boxes } from "lucide-react-native/icons";


const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();


function AppTabs(){
  return(
    <Tab.Navigator screenOptions={({route})=>({
      headerShown:false, 
      tabBarActiveTintColor: '#008b89ff', 
      tabBarIcon:({focused, color, size})=>{
        const strokeWidth = focused ? 2 : 1.5

        switch(route.name){
          case 'Home':
            return <House color={color} size={size} strokeWidth={strokeWidth}/>

          case 'Collection':
            return <Boxes color={color} size={size} strokeWidth={strokeWidth}/>

          case 'Scan':
            return <Camera color={color} size={size} strokeWidth={strokeWidth}/>

          case 'Profile':
            return <User color={color} size={size} strokeWidth={strokeWidth}/>
        }
      },
      tabBarStyle:{
        backgroundColor: '#131417ff',
        borderColor: 'black',
        borderWidth: 0,
    }})}>
      <Tab.Screen name="Home" component={HomeScreen}/>
      <Tab.Screen name="Collection" component={CollectionScreen}/>
      <Tab.Screen name="Scan" component={ScanPage}/>
      <Tab.Screen name="Profile" component={ProfileScreen}/>
    </Tab.Navigator>
  )
}

export default function App() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

    const [loaded] = useFonts({
      Beleren: require("./assets/fonts/Beleren2016-Bold.ttf"),
      Mana: require("./assets/fonts/mana.ttf"),
    });

  useEffect(() => {
    const subscriber = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });
    return subscriber;
  }, []);

  if (initializing) return null;

  return (
    <SafeAreaProvider>
      <NavigationContainer >
        <Stack.Navigator screenOptions={{ headerShown: false }} style={styles.background}>
          {user ? (
            // --- App Stack (User is logged in) ---
            <>
              <Stack.Screen name="MainTabs" component={AppTabs}/>
              <Stack.Screen name="Camera" component={cameraPageTest} />
            </>
          ) : (
            // --- Auth Stack (User is NOT logged in) ---
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
