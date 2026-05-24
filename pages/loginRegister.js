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
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export function RegisterScreen({navigation, route}) {
  const [emailInput, setEmailInput] = useState();
  const [passWordInput, setPasswordInput] = useState();
  const [userNameInput, setUserNameInput] = useState();

  function toLogin(){
    navigation.goBack()
  }

  async function register() {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        emailInput,
        passWordInput,
      );
      const user = userCredential.user;

      const newUser = {
        display_name: userNameInput,
        email: user.email,
        createdAt: new Date().toISOString(),
        role: "user",
        profilePhotoUri: null
      };

      await setDoc(doc(database, "Users", user.uid), newUser);

      console.log("User doc created successfully!");
    } catch (error) {
      alert("Error: " + error.message);
    }
  }

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.centerContent}>
        <View style={styles.loginBox}>
          <Text style={styles.boxTitle}>Sign Up</Text>
          <TextInput style={styles.textInput} value={userNameInput} onChangeText={setUserNameInput} placeholder="Display name"/>
          <TextInput style={styles.textInput} value={emailInput} onChangeText={setEmailInput} placeholder="Email"/>
          <TextInput style={styles.textInput} value={passWordInput} onChangeText={setPasswordInput} placeholder="Password"/>

          <Pressable style={styles.button.base} onPress={() => register()}>
            <Text style={styles.buttonText}>Submit</Text>
          </Pressable>
          <Pressable style={[styles.button.base, styles.button.gray]} onPress={() => toLogin()}>
            <Text style={styles.buttonText}>Back</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

export function LoginScreen({ navigation, route }) {
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
      .then((userCredential) => {})
      .catch((error) => {
        alert(error);
      });
  }

  function navigateToRegister() {
    navigation.navigate("Register");
  }

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.centerContent}>
        <View style={styles.loginBox}>
          <Text style={styles.boxTitle}>Welcome to Urza's Helper!</Text>
          <TextInput
            style={styles.textInput}
            value={emailInput}
            onChangeText={setEmailInput}
          />
          <TextInput
            style={styles.textInput}
            value={passWordInput}
            onChangeText={setPasswordInput}
          />
          <Pressable onPress={() => login()} style={styles.button.base}>
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>
          <Text></Text>
          <Text style={styles.text}>Don't have a profile with us?</Text>
          <Pressable onPress={() => navigateToRegister()} style={[styles.button.base, styles.button.gray]}>
            <Text style={styles.buttonText}>Register</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
