import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
  Alert,
  Image,
} from "react-native";
import { app, database, auth, storage } from "../firebase.js";
import { styles } from "../styles.js";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import CustomModal from "../components/customModal.js";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export function HomeScreen({ navigation, route }) {
  //Loading collecion of cards
  const [values, loading, error] = useCollection(
    collection(database, "Users", auth.currentUser.uid, "collection"),
  );
  const data =
    values?.docs.map((doc) => ({ ...doc.data(), key: doc.id })) ?? [];

  //Total value calculation
  const totalValue = data
    .reduce((sum, card) => {
      const price = card.foil ? card.prices?.foil : card.prices?.non_foil;
      return sum + (Number(price) * Number(card.amount) ?? 0);
    }, 0)
    .toFixed(2);

  //Featured card stuff
  //Using a memo here to avoid doing the work every time the screen rerenders
  const filteredData2 = useMemo(() => {
    return data.filter((item) => item.coolness >= 3);
  }, [values]);

  const totalCoolness2 = useMemo(() => {
    return filteredData2.reduce((sum, card) => {
      return sum + (Number(card.coolness) ?? 0);
    }, 0);
  }, [filteredData2]);

  const [featuredCard, setFeaturedCard] = useState();

  useFocusEffect(
    useCallback(() => {
      if (filteredData2.length === 0) return; //Check if array is empty

      var randomValue = getRandomInt(totalCoolness2); //Get a random value within the bounds of coolness
      var selectedCard = null;

      for (const card of filteredData2) {
        if (card.coolness < randomValue) {
          randomValue -= card.coolness;
        } else {
          selectedCard = card;
          break;
        }
      }
      if (selectedCard) {
        setFeaturedCard((currentFeatured) => {
          if (selectedCard.key !== currentFeatured?.key) {
            // Log safely here using the new card data
            console.log(selectedCard.images?.normal);
            return selectedCard;
          }
          return currentFeatured; // No change, no re-render loop
        });
      }
    }, [filteredData2, totalCoolness2]),
  );

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function displayUID() {
    alert(auth.currentUser.uid);
  }

  function viewUser() {
    navigation.navigate("Profile");
  }

  function viewCollection() {
    navigation.navigate("Collection");
  }

  function viewCamera() {
    navigation.navigate("Scan");
  }

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.content}>
        <View style={[styles.box, { paddingTop: 20 }]}>
          <View style={styles.rowView}>
            <Text style={styles.boxTitle}>Estimated Collection Value:</Text>
          </View>
          <View style={styles.rowView}>
            <Text style={styles.totalPrice}>{totalValue} €</Text>
          </View>
        </View>
        <View style={[styles.box, { alignItems: "center" }]}>
          <View style={styles.rowView}>
            <Text style={styles.boxTitle}>
              Featured card from your collection
            </Text>
          </View>
          <View>
            {featuredCard?.foil ? (
              <Image
                source={require("../assets/images/rainbow_coloured_hologram_background_2409.jpg")}
                style={{
                  width: 200,
                  height: 280,
                  resizeMode: "cover",
                  borderRadius: 8,
                  position: "absolute",
                  zIndex: 2,
                  mixBlendMode: "overlay",
                }}
              />
            ) : null}
            <Image
              source={{ uri: featuredCard?.images.normal }}
              style={{
                width: 200,
                height: 280,
                resizeMode: "cover",
                borderRadius: 8,
              }}
            />
          </View>
          <View style={{ padding: 10, gap: 5 }}>
            <Text style={[styles.cardName, { textAlign: "center" }]}>
              {featuredCard?.name}
            </Text>
            <Text style={[styles.textLight, { textAlign: "center" }]}>
              {featuredCard?.type_line}
            </Text>
            {featuredCard?.foil ? (
              <Text style={[styles.textLight, { textAlign: "center" }]}>
                {featuredCard?.prices.foil} €
              </Text>
            ) : (
              <Text style={[styles.textLight, { textAlign: "center" }]}>
                {featuredCard?.prices.non_foil} €
              </Text>
            )}
          </View>
        </View>

        <Pressable onPress={() => viewCollection()} style={styles.box}>
          <Text style={styles.buttonText}>Go to Collection</Text>
        </Pressable>
        <Pressable onPress={() => viewCamera()} style={styles.box}>
          <Text style={styles.buttonText}>Go to Camera</Text>
        </Pressable>
        <Pressable onPress={() => viewUser()} style={styles.box}>
          <Text style={styles.buttonText}>Go to Profile</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export function ProfileScreen({ navigation, route }) {
  const [currentUserInfo, setCurrentUserInfo] = useState();
  const [profileImageModalVisible, setProfileImageModalVisible] =
    useState(false);
  const image = currentUserInfo?.profilePhotoUri;
  const [reloadTrigger, setReloadTrigger] = useState(false)

  useFocusEffect(
    useCallback(() => {
      if (!auth.currentUser) {
        return;
      }

      const getUserData = async () => {
        try {
          const docRef = doc(database, "Users", auth.currentUser.uid);
          const userDoc = await getDoc(docRef);

          if (userDoc.exists()) {
            setCurrentUserInfo(userDoc.data());
          } else {
            alert("Error when finding user");
          }
        } catch (error) {
          console.log(error);
        }
      };

      getUserData();

      return () => {
        //Cleanup optional
      };
    }, [auth.currentUser, reloadTrigger]),
  );

  async function logout() {
    Alert.alert("logout?", "Are you sure you want to log out?", [
      { text: "cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => auth.signOut() },
    ]);
  }

  async function getNewProfileImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
    });
    if (!result.canceled) {
      console.log("An image was selected")
      const uri = result.assets[0].uri;
      const nameFromUri = uri.split("/").pop();
      const filename = "images/" + nameFromUri;

      await uploadImage(uri, filename)
      const firebaseUrl = await getDownloadURL(ref(storage, filename))
      const userRef = doc(database, "Users", auth.currentUser.uid)

      const updatedUser = {
        profilePhotoUri: firebaseUrl
      }

      await setDoc(userRef, updatedUser, {merge:true})
      setReloadTrigger(!reloadTrigger)
    }
    try {
    } catch (error) {
      console.log(error);
    }
  }

  async function uploadImage(uri, filename){
    const res = await fetch(uri)
    const blob = await res.blob()
    const storageRef = ref(storage, filename)
    console.log(blob.type)

    try{
      await uploadBytes(storageRef, blob, {contentType:'image/jpeg'}).then((snap)=>{
        console.log("billede uploadet")
      })
    }catch(error){
      console.log(error)
    }
  }

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.content}>
        <View style={styles.box}>
          <View style={styles.centerContent}>
            <Text style={styles.boxTitle}>Your Profile</Text>
          </View>

          <View style={[styles.profilePicBox]}>
            <Image
              source={{
                uri:
                  currentUserInfo?.profilePhotoUri ||
                  "https://firebasestorage.googleapis.com/v0/b/reactnative-a55ad.firebasestorage.app/o/profilePics%2FScreenshot%202026-05-22%20at%2016.30.56.png?alt=media&token=28e1acec-99a9-441d-ab19-f6a257336d5f",
              }}
              style={{
                width: 100,
                height: 100,
                backgroundColor: "black",
                borderRadius: 50,
              }}
            />
            <Pressable
              style={[styles.button.base, { alignSelf: "center" }]}
              onPress={() =>
                setProfileImageModalVisible(!profileImageModalVisible)
              }
            >
              <Text style={styles.textLight}>
                Upload/change Profile picture
              </Text>
            </Pressable>
          </View>
          <View style={{ gap: 10, marginTop: 10 }}>
            <Text style={styles.text}>
              Username: {currentUserInfo?.display_name}
            </Text>
            <Text style={styles.text}>Email: {auth.currentUser.email}</Text>
          </View>
        </View>
        <Pressable
          onPress={() => logout()}
          style={[styles.box, styles.button.danger]}
        >
          <Text style={styles.buttonText}>logout</Text>
        </Pressable>
        <CustomModal
          visible={profileImageModalVisible}
          onClose={() => setProfileImageModalVisible(!profileImageModalVisible)}
        >
          <View style={{gap: 20}}>
              <Image
            source={{
              uri:
                currentUserInfo?.profilePhotoUri ||
                "https://firebasestorage.googleapis.com/v0/b/reactnative-a55ad.firebasestorage.app/o/profilePics%2FScreenshot%202026-05-22%20at%2016.30.56.png?alt=media&token=28e1acec-99a9-441d-ab19-f6a257336d5f",
            }}
            style={{ width: 300, height: 300, borderRadius: 200, alignSelf: 'center' }}
          />
          <Pressable style={[styles.button.base, {alignSelf: 'center'}]} onPress={() => getNewProfileImage()}>
            <Text style={styles.cardName}>Select new profile image</Text>
          </Pressable>
          </View>
          
        </CustomModal>
      </View>
    </SafeAreaView>
  );
}
