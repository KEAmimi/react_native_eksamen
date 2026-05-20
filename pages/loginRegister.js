import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
} from "react-native";
import { app, database, auth } from "../firebase.js";
import { styles } from "../styles.js";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback, useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  setDoc,
  updateDoc, 
} from "firebase/firestore";

export function RegisterScreen() {
    const [emailInput, setEmailInput] = useState()
    const [passWordInput, setPasswordInput] = useState()

async function register() {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, emailInput, passWordInput);
    const user = userCredential.user;

    const newUser = {
      email: user.email,
      createdAt: new Date().toISOString(),
      role: 'user' 
    };

    await setDoc(doc(database, "Users", user.uid), newUser);

    console.log("User doc created successfully!");
  } catch (error) {
    alert("Error: " + error.message);
  }
}

  return (
    <SafeAreaView style={styles.background}>
      <View>
        <Text>RegisterPage</Text>
        <TextInput value={emailInput} onChangeText={setEmailInput} />
        <TextInput value={passWordInput} onChangeText={setPasswordInput} />
        <Pressable onPress={() => register()}>
          <Text style={styles.buttonText}>Submit</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export function LoginScreen({navigation, route}) {
  const [emailInput, setEmailInput] = useState("mikkel@mikkel.mikkel");
  const [passWordInput, setPasswordInput] = useState("Mikkel");

  async function login() {
    console.log(
      "Attempting login with email: " +
        emailInput +
        " and password: " +
        passWordInput,
    );

    signInWithEmailAndPassword(auth, emailInput, passWordInput)
      .then((userCredential) => {

      })
      .catch((error) => {
        alert(error);
      });
  }

  function navigateToRegister(){
    navigation.navigate("Register")
  }

  return (
    <SafeAreaView style={styles.background}>
      <View>
        <Text>LoginPage</Text>
        <TextInput value={emailInput} onChangeText={setEmailInput} />
        <TextInput value={passWordInput} onChangeText={setPasswordInput} />
        <Pressable onPress={() => login()}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
        <Text></Text>
        <Text>
            Don't have a profile with us?
        </Text>
        <Pressable onPress={() => navigateToRegister()}>
            <Text style={styles.buttonText}>
                Register
            </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
