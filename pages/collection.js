import {
  View,
  Text,
  Pressable,
  TextInput,
  Modal,
  FlatList,
  Image,
  Alert,
  Dimensions,
  Vibration,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../styles";
import { useRef, useState } from "react";
import { database, auth } from "../firebase";
import { setDoc, doc, collection, deleteDoc } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { useFonts } from "expo-font";
import SortPressable from "../components/sortPressable";

import CustomModal from "../components/customModal";
import { RadioButton, Switch } from "react-native-paper";

const windowWidth = Dimensions.get("window").width;

export function CollectionScreen({ navigation, route }) {
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [cardModalVisible, setCardModalVisible] = useState(false);

  const [cardInFront, setCardInFront] = useState(false);

  const [loaded] = useFonts({
    Beleren: require("../assets/fonts/Beleren2016-Bold.ttf"),
    Mana: require("../assets/fonts/mana.ttf"),
  });

  const [modalCard, setModalCard] = useState();

  //Search Param object to use for filtering
  const [searchParam, setSearchParams] = useState({
    name: "",
    type_line: "",
    colors: [],
    color_identity: false,
    onlyMultiColor: false,
    onlyColorless: false,
    set_name: "",
    oracle_text: "",
  });

  //Search param holders
  const [searchName, setSearchName] = useState("");
  const [typeLineInput, setTypeLineInput] = useState("");
  const [setNameInput, setSetNameInput] = useState("");
  const [oracleInput, setOracleInput] = useState("");

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
  const [ascending, setAscending] = useState(true);
  const sortActive = "#5b5b5bff";
  const sortInActive = "#474747ff";

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

        case "mana":
          comparison = a.manavalue - b.manavalue;
          break;

        case "coolness":
          comparison = a.coolness - b.coolness;
          break;

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
      name: searchName.toLowerCase(),
      type_line: typeLineInput.toLowerCase(),
      colors: colArr,
      color_identity: false,
      onlyMultiColor: multiColorOnly,
      onlyColorless: colorLessOnly,
      set_name: setNameInput.toLowerCase(),
      oracle_text: oracleInput.toLowerCase(),
    });
  }

  function matchesSearch(card) {
    const search_colors = searchParam.color_identity
      ? card.color
      : card.color_identity;

    if (!card.name.toLowerCase().includes(searchParam.name)) {
      return false;
    }
    if (!card.type_line.toLowerCase().includes(searchParam.type_line)) {
      return false;
    }
    if (!card.set_name.toLowerCase().includes(searchParam.set_name)) {
      return false;
    }
    if (!card.oracle_text.toLowerCase().includes(searchParam.oracle_text)) {
      return false;
    }
    if (searchParam.colors.length > 0) {
      if (
        card.type_line.includes("Land") &&
        !searchParam.type_line?.includes("Land")
      )
        return false;
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

  function displayCardModal(card) {
    setModalCard(card);

    setCardModalVisible(!cardModalVisible);
  }

  async function updateCardAmount(amount) {
    try {
      if ((amount < 0 && modalCard.amount > 1) || amount > 0) {
        var id = modalCard.sfID;
        if (modalCard.foil) {
          id = id + "-foil";
        }

        const cardDocRef = doc(
          database,
          "Users",
          auth.currentUser.uid,
          "collection",
          id,
        );

        modalCard.amount += amount;

        const docRef = await setDoc(cardDocRef, modalCard, { merge: true });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function tryDeleteCard() {
    try {
      var id = modalCard.sfID;
      if (modalCard.foil) {
        id = id + "-foil";
      }

      const cardDocRef = doc(
        database,
        "Users",
        auth.currentUser.uid,
        "collection",
        id,
      );

      deleteDoc(cardDocRef);
    } catch (error) {
      console.log(error);
    }
    setCardModalVisible(!cardModalVisible);
  }

  async function deleteModalCard() {
    Alert.alert(
      "Delete?",
      "Are you sure you want to Delete " + modalCard?.name + "?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          style: "destructive",
          onPress: () => tryDeleteCard(),
        },
      ],
    );
  }

  function renderListItem(item) {
    const margin = 5;
    const borderWidth = 2;
    const boxWidth = (windowWidth - 20 - margin * 2) / 3;
    const imageWidth = boxWidth - borderWidth * 2;
    const imageHeight = imageWidth * 1.4;

    return (
      <Pressable
        style={{
          height: "auto",
          width: boxWidth,
          padding: 0,
          marginRight: margin,
          marginBottom: margin,
          borderWidth: borderWidth,
          borderColor: "#333333",
          borderRadius: 5,
          backgroundColor: "#333333",
        }}
        onPress={() => displayCardModal(item)}
      >
        {item.foil ? (
          <Image
            source={require("../assets/images/rainbow_coloured_hologram_background_2409.jpg")}
            style={{
              position: "absolute",
              zIndex: 5,
              width: imageWidth,
              height: imageHeight,
              borderRadius: 5,
              resizeMode: "cover",
              mixBlendMode: "overlay",
            }}
          />
        ) : null}
        {item.faces ? (
          <View
            style={{
              width: imageWidth,
              height: imageHeight,
            }}
          >
            <Image
              source={{ uri: item.faces[0].images.small }}
              style={{
                backgroundColor: "black",
                width: imageWidth - 10,
                height: imageHeight - 14,
                borderRadius: 4,
                zIndex: 2,
              }}
            />
            <Image
              source={{ uri: item.faces[1].images.small }}
              style={{
                backgroundColor: "black",
                width: imageWidth - 10,
                height: imageHeight - 14,
                borderRadius: 4,
                position: "absolute",
                right: 0,
                bottom: 0,
              }}
            />
          </View>
        ) : (
          <Image
            source={{ uri: item.images.small }}
            style={{
              backgroundColor: "black",
              width: imageWidth,
              height: imageHeight,
              borderRadius: 5,
            }}
          />
        )}

        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>{item.name}</Text>
          <Text style={styles.textLight}>
            {item.foil
              ? item.prices.foil
                ? item.prices.foil
                : "N/A"
              : item.prices.non_foil
                ? item.prices.non_foil
                : "N/A"}{" "}
            €
          </Text>
          <Text style={styles.textLight}>amount: {item.amount}</Text>
        </View>
      </Pressable>
    );
  }

  return (
    <SafeAreaView style={[styles.background]}>
      <View style={styles.content}>
        <View style={[styles.rowView, styles.collectionControls]}>
          <Pressable
            style={[
              styles.button.base,
              styles.button.shadow,
              styles.button.large,
            ]}
            onPress={() => setFilterModalVisible(!filterModalVisible)}
          >
            <Text style={styles.buttonText}>Search</Text>
          </Pressable>
          <Pressable
            style={[
              styles.button.base,
              styles.button.shadow,
              styles.button.large,
            ]}
            onPress={() => setSortModalVisible(!sortModalVisible)}
          >
            <Text style={styles.buttonText}>Sort</Text>
          </Pressable>
        </View>
        <FlatList
          data={sortedData}
          style={{
            flex: 1,
            minHeight: 720,
          }}
          keyExtractor={(item) => item.sfID}
          numColumns={3}
          renderItem={(item) => renderListItem(item.item)}
          contentContainerStyle={{ paddingBottom: 90 }}
        />
        <CustomModal
          visible={sortModalVisible}
          onClose={() => setSortModalVisible(false)}
        >
          <View style={{ gap: 10 }}>
            <SortPressable
              onPress={() => {
                setAscending(true);
                setSortChoice("name");
              }}
              sortChoice={sortChoice}
              ascendingStatus={ascending}
              title="Name A-Z"
              desiredSort="name"
              desiredAsc={true}
            />
            <SortPressable
              onPress={() => {
                setAscending(false);
                setSortChoice("name");
              }}
              sortChoice={sortChoice}
              ascendingStatus={ascending}
              title="Name Z-A"
              desiredSort="name"
              desiredAsc={false}
            />
            <SortPressable
              onPress={() => {
                setAscending(true);
                setSortChoice("mana");
              }}
              sortChoice={sortChoice}
              ascendingStatus={ascending}
              title="Mana low-high"
              desiredSort="mana"
              desiredAsc={true}
            />
            <SortPressable
              onPress={() => {
                setAscending(false);
                setSortChoice("mana");
              }}
              sortChoice={sortChoice}
              ascendingStatus={ascending}
              title="Mana high-low"
              desiredSort="mana"
              desiredAsc={false}
            />
            <SortPressable
              onPress={() => {
                setAscending(false);
                setSortChoice("coolness");
              }}
              sortChoice={sortChoice}
              ascendingStatus={ascending}
              title="Coolness high to low"
              desiredSort="coolness"
              desiredAsc={false}
            />
            <SortPressable
              onPress={() => {
                setAscending(true);
                setSortChoice("coolness");
              }}
              sortChoice={sortChoice}
              ascendingStatus={ascending}
              title="Coolness low to high"
              desiredSort="coolness"
              desiredAsc={true}
            />
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
          <TextInput
            value={oracleInput}
            onChangeText={setOracleInput}
            placeholder="Oracle text"
            style={styles.textInput}
          />

          <Text style={styles.cardName}>Select colors:</Text>
          <View style={styles.rowView}>
            <Pressable onPress={() => setWhiteSelected(!whiteSelected)}>
              <View
                style={{
                  backgroundColor: whiteSelected
                    ? "rgb(248, 231, 185)"
                    : "#494949ff",
                  borderRadius: 100,
                  shadowColor: "black",
                  shadowOpacity: 1,
                  shadowOffset: { width: -2, height: 2 },
                  shadowRadius: 0.8,
                  padding: 1,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Mana",
                    color: whiteSelected ? "rgb(249,250,244)" : "gray",
                    fontSize: 40,
                    padding: 5,
                    shadowColor: "black",
                    shadowOpacity: 0.5,
                    shadowOffset: { width: -0.5, height: 0.5 },
                    shadowRadius: 1,
                  }}
                >
                  
                </Text>
              </View>
            </Pressable>
            <Pressable onPress={() => setBlueSelected(!blueSelected)}>
              <View
                style={{
                  backgroundColor: blueSelected
                    ? "rgb(179, 206, 234)"
                    : "#494949ff",
                  borderRadius: 100,
                  shadowColor: "black",
                  shadowOpacity: 1,
                  shadowOffset: { width: -2, height: 2 },
                  shadowRadius: 0.8,
                  padding: 1,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Mana",
                    color: blueSelected ? "rgb(14, 104, 171)" : "gray",
                    fontSize: 40,
                    padding: 5,
                    shadowColor: "black",
                    shadowOpacity: 0.5,
                    shadowOffset: { width: -0.5, height: 0.5 },
                    shadowRadius: 1,
                  }}
                >
                  
                </Text>
              </View>
            </Pressable>
            <Pressable onPress={() => setBlackSelected(!blackSelected)}>
              <View
                style={{
                  backgroundColor: blackSelected
                    ? "rgb(166, 159, 157)"
                    : "#494949ff",
                  borderRadius: 100,
                  shadowColor: "black",
                  shadowOpacity: 1,
                  shadowOffset: { width: -2, height: 2 },
                  shadowRadius: 0.8,
                  padding: 1,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Mana",
                    color: blackSelected ? "rgb(21,11,0)" : "gray",
                    fontSize: 40,
                    padding: 5,
                    shadowColor: "black",
                    shadowOpacity: 0.5,
                    shadowOffset: { width: -0.5, height: 0.5 },
                    shadowRadius: 1,
                  }}
                >
                  
                </Text>
              </View>
            </Pressable>
            <Pressable onPress={() => setRedSelected(!redSelected)}>
              <View
                style={{
                  backgroundColor: redSelected
                    ? "rgb(235, 159, 130)"
                    : "#494949ff",
                  borderRadius: 100,
                  shadowColor: "black",
                  shadowOpacity: 1,
                  shadowOffset: { width: -2, height: 2 },
                  shadowRadius: 0.8,
                  padding: 1,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Mana",
                    color: redSelected ? "rgb(211,32,42)" : "gray",
                    fontSize: 40,
                    padding: 5,
                    shadowColor: "black",
                    shadowOpacity: 0.5,
                    shadowOffset: { width: -0.5, height: 0.5 },
                    shadowRadius: 1,
                  }}
                >
                  
                </Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => {
                setGreenSelected(!greenSelected);
              }}
            >
              <View
                style={{
                  backgroundColor: greenSelected
                    ? "rgb(196, 211, 202)"
                    : "#494949ff",
                  borderRadius: 100,
                  shadowColor: "black",
                  shadowOpacity: 1,
                  shadowOffset: { width: -2, height: 2 },
                  shadowRadius: 0.8,
                  padding: 1,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Mana",
                    color: greenSelected ? "rgb(0,115,62)" : "gray",
                    fontSize: 40,
                    padding: 5,
                    shadowColor: "black",
                    shadowOpacity: 0.5,
                    shadowOffset: { width: 0, height: 0.7 },
                    shadowRadius: 0.3,
                  }}
                >
                  
                </Text>
              </View>
            </Pressable>
          </View>
          <View style={styles.rowView}>
            <View style={styles.colorFilterSwitchBox}>
              <Switch
                value={colorIdentity}
                onValueChange={() => setColorIdentity(!colorIdentity)}
                style={styles.colorSwitch}
                borderWidth={1}
                borderColor="white"
                borderRadius={100}
              />
              <Text style={[styles.cardName, { textAlign: "center" }]}>
                Color or Color identity?
              </Text>
            </View>
            <View style={styles.colorFilterSwitchBox}>
              <Switch
                value={colorLessOnly}
                onValueChange={() => setColorLessOnly(!colorLessOnly)}
                style={styles.colorSwitch}
                borderWidth={1}
                borderColor="white"
                borderRadius={100}
              />
              <Text style={[styles.cardName, { textAlign: "center" }]}>
                Colorless only?
              </Text>
            </View>

            <View style={styles.colorFilterSwitchBox}>
              <Switch
                value={multiColorOnly}
                onValueChange={() => setMultiColorOnly(!multiColorOnly)}
                style={styles.colorSwitch}
                borderWidth={1}
                borderColor="white"
                borderRadius={100}
              />
              <Text style={[styles.cardName, { textAlign: "center" }]}>
                Multicolor only?
              </Text>
            </View>
          </View>

          <View style={[styles.rowView, { marginTop: 10 }]}>
            <Pressable
              style={styles.button.base}
              onPress={() => setSearchParam()}
            >
              <Text style={styles.buttonText}>Set search criteria</Text>
            </Pressable>
          </View>
        </CustomModal>

        <CustomModal
          visible={cardModalVisible}
          onClose={() => setCardModalVisible(!cardModalVisible)}
        >
          {modalCard?.foil ? (
            <Image
              pointerEvents="none"
              source={require("../assets/images/rainbow_coloured_hologram_background_2409.jpg")}
              style={{
                left: 10,
                top: 10,
                zIndex: 2,
                mixBlendMode: "overlay",
                position: "absolute",
                height: 418,
                width: "90%",
                margin: "5%",
                marginTop: "3.2%",
                borderRadius: 11,
              }}
            />
          ) : null}
          {modalCard?.faces ? (
            <Pressable
              style={{
                height: 418,
                width: "90%",
                margin: "5%",
              }}
              onPress={() => {
                setCardInFront(!cardInFront);
              }}
            >
              <Image
                source={{ uri: modalCard?.faces[0].images.normal }}
                style={{
                  height: 375,
                  width: "90%",
                  borderRadius: 12,
                  boxShadow: "3px 3px 10px #00000076",
                  zIndex: cardInFront ? -1 : 2,
                }}
              />
              <Image
                source={{ uri: modalCard?.faces[1].images.normal }}
                style={{
                  height: 375,
                  width: "90%",
                  borderRadius: 12,
                  boxShadow: "3px 3px 10px #00000076",
                  position: "absolute",
                  right: 0,
                  bottom: 0,
                }}
              />
            </Pressable>
          ) : (
            <Image
              source={{ uri: modalCard?.images.normal }}
              style={{
                height: 418,
                width: "90%",
                margin: "5%",
                borderRadius: 12,
                boxShadow: "3px 3px 10px #00000076",
              }}
            />
          )}
          <View style={styles.rowView}>
            <Text style={[styles.cardName]}>{modalCard?.name}</Text>
          </View>
          <View style={styles.rowView}>
            <View style={styles.amountControl.container}>
              <Pressable
                style={styles.amountControl.button}
                onPress={() => updateCardAmount(-1)}
              >
                <Text>-</Text>
              </Pressable>
              <Text style={styles.amountControl.amount}>
                {modalCard?.amount}
              </Text>
              <Pressable
                style={styles.amountControl.button}
                onPress={() => updateCardAmount(+1)}
              >
                <Text>+</Text>
              </Pressable>
            </View>
            <Pressable
              style={[styles.button.base, styles.button.danger]}
              onPress={() => deleteModalCard()}
            >
              <Text>Delete</Text>
            </Pressable>
          </View>
        </CustomModal>
      </View>
    </SafeAreaView>
  );
}
