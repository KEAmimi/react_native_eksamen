import {
  View,
  Text,
  Pressable,
  TextInput,
  Modal,
  FlatList,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../styles";
import { useRef, useState } from "react";
import { database, auth } from "../firebase";
import { setDoc, doc, collection, addDoc, increment } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { useFonts } from "expo-font";

import CameraModal from "../components/cameraModal";
import CustomModal from "../components/customModal";
import CustomHeader from "../components/customHeader";
import { RadioButton, Switch } from "react-native-paper";

export function CollectionScreen({ navigation, route }) {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [cameraModalVisible, setCameraModalVisible] = useState(false);

  const cameraRef = useRef(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const [loaded] = useFonts({
    Beleren: require("../assets/fonts/Beleren2016-Bold.ttf"),
    Mana: require("../assets/fonts/mana.ttf"),
  });

  const [cardID, setCardID] = useState("cc5eacd7-aaa7-4720-9794-52e7b098c82c");

  //Search Param object to use for filtering
  const [searchParam, setSearchParams] = useState({
    name: "",
    type_line: "",
    colors: [],
    color_identity: false,
    onlyMultiColor: false,
    onlyColorless: false,
    set_name: "",
  });

  //Search param holders
  const [searchName, setSearchName] = useState("");
  const [typeLineInput, setTypeLineInput] = useState("");
  const [setNameInput, setSetNameInput] = useState("");

  const [colorIdentity, setColorIdentity] = useState(false);

  const [whiteSelected, setWhiteSelected] = useState(false);
  const [blueSelected, setBlueSelected] = useState(false);
  const [blackSelected, setBlackSelected] = useState(false);
  const [redSelected, setRedSelected] = useState(false);
  const [greenSelected, setGreenSelected] = useState(false);

  const [colorLessOnly, setColorLessOnly] = useState(false);
  const [multiColorOnly, setMultiColorOnly] = useState(false);

  //Sorting hooks
  const [sortChoice, setSortChoice] = useState("name");
  const [ascending, setAscending] = useState(false);

  const [values, loading, error] = useCollection(
    collection(database, "Users", auth.currentUser.uid, "collection"),
  );
  const data =
    values?.docs.map((doc) => ({ ...doc.data(), key: doc.id })) ?? [];

  const filteredData = data.filter((item) => matchesSearch(item));

  const sortedData = [...filteredData].sort(getSorting());

  function getSorting() {
    return (a, b) => {
      let comparison = 0;

      switch (sortChoice) {
        case "name":
          comparison = (a.name || "").localeCompare(b.name || "");
          break;
        
        case "manavalue":
          comparison = (a.manavalue - b.manavalue)

        default:
          comparison = 0;
      }

      return ascending ? comparison : comparison * -1;
    };
  }

  function setSearchParam() {
    var colArr = [];
    if (whiteSelected) colArr.push("W");
    if (blueSelected) colArr.push("U");
    if (blackSelected) colArr.push("B");
    if (redSelected) colArr.push("R");
    if (greenSelected) colArr.push("G");

    setSearchParams({
      name: searchName,
      type_line: typeLineInput,
      colors: colArr,
      color_identity: false,
      onlyMultiColor: multiColorOnly,
      onlyColorless: colorLessOnly,
      set_name: "",
    });
  }

  function matchesSearch(card) {
    if (!card.name.includes(searchParam.name)) {
      return false;
    }
    if (!card.type_line.includes(searchParam.type_line)) {
      return false;
    }
    if (searchParam.colors.length > 0) {
      //Color filtering
      if (searchParam.onlyColorless && card.colors.length > 0) return false;

      if (searchParam.onlyMultiColor && card.colors.length < 2) return false;

      if (!card.colors.every((color) => searchParam.colors.includes(color))) {
        return false;
      }
    }
    if (searchParam.onlyColorless && card.colors.length > 0) {
      return false;
    }
    if (searchParam.onlyMultiColor && card.colors.length < 2) {
      return false;
    }
    return true;
  }

  function getCoolNess(prices, full_art, foil, rarity) {
    var coolness = 0;
    if (foil) {
      coolness += 1;
      if (prices.eur_foil > 1) {
        coolness += 1;
      }
      if (prices.eur_foil > 5) {
        coolness += 1;
      }
      if (prices.eur_foil > 10) {
        coolness += 1;
      }
      if (prices.eur_foil > 20) {
        coolness += 1;
      }
      if (prices.eur_foil > 50) {
        coolness += 1;
      }
    } else {
      if (prices.eur > 1) {
        coolness += 1;
      }
      if (prices.eur > 5) {
        coolness += 1;
      }
      if (prices.eur > 10) {
        coolness += 1;
      }
      if (prices.eur > 20) {
        coolness += 1;
      }
      if (prices.eur > 50) {
        coolness += 1;
      }
    }
    if (full_art) {
      coolness += 2;
    }
    if (rarity == "uncommon") coolness += 1;
    if (rarity == "rare") coolness += 3;
    if (rarity == "mythic") coolness += 5;

    return coolness;
  }

  async function findAndAddCard() {
    console.log(cardID);

    try {
      //Fetch the card data from scryfall
      const resp = await fetch("https://api.scryfall.com/cards/" + cardID);
      //If there was an error in the fetch, abort
      if (!resp.ok) {
        throw new Error(`There was an error + ${resp.status}`);
      }

      const data = await resp.json();

      //Create a card entry with relevant information
      const cardEntry = {
        sfID: data.id,
        name: data.name,
        type_line: data.type_line,
        colors: data.colors,
        color_identity: data.color_identity,
        set: data.set,
        set_name: data.set_name,
        manavalue: data.cmc,
        images: {
          normal: data.image_uris.normal,
          art_crop: data.image_uris.art_crop,
        },
        rarity: data.rarity,
        full_art: data.full_art,
        prices: {
          non_foil: data.prices.eur,
          foil: data.prices.eur_foil,
        },
        amount: increment(1),
        foil: false,
        coolness: getCoolNess(data.prices, data.full_art, false, data.rarity),
      };

      const cardDocRef = doc(
        database,
        "Users",
        auth.currentUser.uid,
        "collection",
        cardID,
      );

      const docRef = await setDoc(cardDocRef, cardEntry, { merge: true });

      console.log(docRef);
    } catch (error) {
      console.log(error);
    }
  }

  function testAlert(){
    
  }

  const handleCapture = async()=>{
    console.log("Clicked the capture button")
    if(cameraRef.current && !isProcessingImage){
      console.log("something")
      try{
        setIsProcessingImage(true)
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          skipProcessing: true
        });

        const formdata = new FormData()
        formdata.append('file', {
          uri: photo.uri,
          name: 'card.jpg',
          type: 'image/jpeg'
        })

        const resp = await fetch("http://192.168.0.169:8000/getId/",{
          method:'POST',
          body: formdata,
          headers: {'Content-Type':'multipart/form-data'}
        })

        const data = await resp.json()

        setCardID(data.ScryfallID.points[0].payload.scryfall_id)
        findAndAddCard()
      }catch(error){
        alert(error)
      }
      setIsProcessingImage(false)
    }
  }

  return (
    <SafeAreaView>
      <CustomHeader
        onLeftPress={() => navigation.goBack()}
        leftLabel={"back"}
        title={"Collection"}
        onRightPress={() => navigation.navigate("Profile")}
        rightLabel={"profile"}
      />

      <View>
        <View style={styles.rowView}>
          <Pressable onPress={() => setFilterModalVisible(!filterModalVisible)}>
            <Text style={{ fontFamily: "Beleren" }}>Search</Text>
          </Pressable>
          <Pressable onPress={() => setSortModalVisible(!sortModalVisible)}>
            <Text style={{ fontFamily: "Beleren" }}>Sort</Text>
          </Pressable>
        </View>
        <Pressable onPress={() => setCameraModalVisible(!cameraModalVisible)}>
          <Text>Add</Text>
        </Pressable>
      </View>
      <FlatList
        data={sortedData}
        style={{
          flex: 1,
          minHeight: 720,
          padding: 3,
        }}
        keyExtractor={(item) => item.sfID}
        renderItem={({ item }) => {
          console.log(item);
          return (
            <View style={{ height: 520, width: "100%", marginBottom: 10 }}>
              <Image
                source={{ uri: item.images.normal }}
                style={{
                  flex: 1,
                  width: "100%",
                  resizeMode: "contain",
                  marginBottom: 3,
                }}
              />
            </View>
          );
        }}
      />
      <CustomModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
      >
        <TextInput
          value={cardID}
          onChangeText={setCardID}
          style={styles.textInput}
        />
        <Pressable onPress={() => findAndAddCard()}>
          <Text>add Card by Scryfall ID</Text>
        </Pressable>
      </CustomModal>
      <CustomModal
        visible={sortModalVisible}
        onClose={() => setSortModalVisible(false)}
      >
        <Switch
          value={ascending}
          onValueChange={() => setAscending(!ascending)}
        />
        <Text>Ascending?</Text>
        <View>
          <View style={styles.rowView}>
            <RadioButton
              value="name"
              status={sortChoice === "name" ? "checked" : "unchecked"}
              onPress={() => setSortChoice("name")}
            />
            <Text>Name</Text>
          </View>
          <View style={styles.rowView}>
            <RadioButton
              value="manavalue"
              status={sortChoice === "manavalue" ? "checked" : "unchecked"}
              onPress={() => setSortChoice("manavalue")}
            />
            <Text>mana cost</Text>
          </View>
        </View>
      </CustomModal>

      <CustomModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
      >
        <TextInput
          value={searchName}
          onChangeText={setSearchName}
          placeholder="Card name"
          style={styles.textInput}
        />
        <TextInput
          value={typeLineInput}
          onChangeText={setTypeLineInput}
          placeholder="Type line"
          style={styles.textInput}
        />
        <TextInput
          value={setNameInput}
          onChangeText={setSetNameInput}
          placeholder="Set name"
          style={styles.textInput}
        />
        <Text>Color or Color identity?</Text>
        <Switch
          value={colorIdentity}
          onValueChange={() => setColorIdentity(!colorIdentity)}
        />
        <Text>Select colors:</Text>
        <View style={styles.rowView}>
          <Pressable onPress={() => setWhiteSelected(!whiteSelected)}>
            <Text
              style={{
                fontFamily: "Mana",
                color: whiteSelected ? "yellow" : "gray",
                fontSize: 30,
                padding: 5,
              }}
            >
              
            </Text>
          </Pressable>
          <Pressable onPress={() => setBlueSelected(!blueSelected)}>
            <Text
              style={{
                fontFamily: "Mana",
                color: blueSelected ? "blue" : "gray",
                fontSize: 30,
                padding: 5,
              }}
            >
              
            </Text>
          </Pressable>
          <Pressable onPress={() => setBlackSelected(!blackSelected)}>
            <Text
              style={{
                fontFamily: "Mana",
                color: blackSelected ? "black" : "gray",
                fontSize: 30,
                padding: 5,
              }}
            >
              
            </Text>
          </Pressable>
          <Pressable onPress={() => setRedSelected(!redSelected)}>
            <Text
              style={{
                fontFamily: "Mana",
                color: redSelected ? "red" : "gray",
                fontSize: 30,
                padding: 5,
              }}
            >
              
            </Text>
          </Pressable>
          <Pressable onPress={() => setGreenSelected(!greenSelected)}>
            <Text
              style={{
                fontFamily: "Mana",
                color: greenSelected ? "green" : "gray",
                fontSize: 30,
                padding: 5,
              }}
            >
              
            </Text>
          </Pressable>
        </View>
        <Text>Colorless only?</Text>
        <Switch
          value={colorLessOnly}
          onValueChange={() => setColorLessOnly(!colorLessOnly)}
        />
        <Text>Multicolor only?</Text>
        <Switch
          value={multiColorOnly}
          onValueChange={() => setMultiColorOnly(!multiColorOnly)}
        />
        <Pressable onPress={() => setSearchParam()}>
          <Text>Set search criteria</Text>
        </Pressable>
      </CustomModal>
      <CameraModal 
      visible={cameraModalVisible} 
      onClose={()=>setCameraModalVisible(!cameraModalVisible)}
      captureFunction={handleCapture}
      camRef={cameraRef}>
          
      </CameraModal>
    </SafeAreaView>
  );
}
