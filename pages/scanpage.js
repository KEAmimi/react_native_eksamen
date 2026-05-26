import { View, Pressable, FlatList, Image } from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import { styles } from "../styles";
import { CameraView, useCameraPermissions } from "expo-camera";
import { SafeAreaView } from "react-native-safe-area-context";
import { doc, setDoc, collection, increment } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { database, auth } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import CustomModal from "../components/customModal";

export default function ScanPage() {
  const [permissions, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [foundCards, setFoundCards] = useState([]);
  const [scryfallCards, setScryfallCards] = useState([]);

  const [showAddCardsModal, setShowAddCardsModal] = useState(false);

  useEffect(() => {
    console.log("There was a change in found cards!");
    if (foundCards.length > 0) {
      console.log(foundCards);
      var identifiers = [];
      for (const card of foundCards) {
        const rawId = card.payload.scryfall_id;
        const cleanId = rawId.replace(/_(front|rear)$/, "");

        identifiers.push({ id: cleanId });
      }
      const jsonArray = {
        identifiers: identifiers,
      };
      console.log(jsonArray);
      getScryfallCollection(jsonArray);
    }
  }, [foundCards]);

  useEffect(() => {
    console.log("There was a change in the scryfall cards!");
    if (scryfallCards.length > 0) {
      console.log("There is something inside it too!");
      for (const card of scryfallCards) {
        console.log(card.name);
      }
      setShowAddCardsModal(!showAddCardsModal);
    }
  }, [scryfallCards]);

  async function getScryfallCollection(jsonArray) {
    try {
      const formdata = jsonArray;

      const resp = await fetch("https://api.scryfall.com/cards/collection", {
        method: "POST",
        body: JSON.stringify(formdata),
        headers: { "Content-Type": "application/json" },
      });

      const data = await resp.json();

      setScryfallCards(data.data);
    } catch (error) {
      console.log("Error in getScryFallCollection");
      alert(error);
        setIsProcessingImage(false);
    }
  }

  async function findAndAddCard(data, foil) {
    try {

        const isDoubleSided = data.layout == "transform" || data.layout == "modal_dfc"

      var cardEntry = {};
      isDoubleSided
        ? (cardEntry = {
            double_faced: true,
            sfID: data.id,
            name: data.name,
            type_line: data.type_line,
            colors: data.color_identity,
            color_identity: data.color_identity,
            set: data.set,
            set_name: data.set_name,
            manavalue: data.cmc,
            oracle_text: data.faces[0].oracle_text + " // " + data.faces[1].oracle_text,
            rarity: data.rarity,
            full_art: data.full_art,
            prices: {
              non_foil: data.prices.eur,
              foil: data.prices.eur_foil,
            },
            amount: increment(1),
            foil: foil,
            coolness: getCoolNess(
              data.prices,
              data.full_art,
              false,
              data.rarity,
            ),
            faces: [
              {
                images: {
                  normal: data.card_faces[0].image_uris.normal,
                  art_crop: data.card_faces[0].image_uris.art_crop,
                  small: data.card_faces[0].image_uris.small,
                },
              },
              {
                images: {
                  normal: data.card_faces[1].image_uris.normal,
                  art_crop: data.card_faces[1].image_uris.art_crop,
                  small: data.card_faces[1].image_uris.small,
                },
              },
            ],
          })
        : (cardEntry = {
            double_faced: false,
            sfID: data.id,
            name: data.name,
            type_line: data.type_line,
            colors: data.colors,
            color_identity: data.color_identity,
            set: data.set,
            set_name: data.set_name,
            manavalue: data.cmc,
            oracle_text: data.oracle_text,
            images: {
              normal: data.image_uris.normal,
              art_crop: data.image_uris.art_crop,
              small: data.image_uris.small,
            },
            rarity: data.rarity,
            full_art: data.full_art,
            prices: {
              non_foil: data.prices.eur,
              foil: data.prices.eur_foil,
            },
            amount: increment(1),
            foil: foil,
            coolness: getCoolNess(
              data.prices,
              data.full_art,
              false,
              data.rarity,
            ),
          });
          var id = data.id;
          if(foil){
            id = id + "-foil"
          }

      const cardDocRef = doc(
        database,
        "Users",
        auth.currentUser.uid,
        "collection",
        id,
      );

      const docRef = await setDoc(cardDocRef, cardEntry, { merge: true });
        setIsProcessingImage(false);
      setShowAddCardsModal(!showAddCardsModal)
    } catch (error) {
      alert("We encountered an error, please try again.");
      console.log(error);
        setIsProcessingImage(false);
    }
  }

  function renderListItem(item) {
    return (
      <View style={[styles.box, styles.rowView]}>
        {item.layout == "transform" || item.layout == "modal_dfc" ? (
          <View style={{ height: 168, width: 120 }}>
            <Image
              source={{
                uri: item.card_faces[0].image_uris.small,
              }}
              style={{ height: 140, width: 100, zIndex: 2, borderRadius: 5 }}
            />
            <Image
              source={{
                uri: item.card_faces[1].image_uris.small,
              }}
              style={{
                height: 140,
                width: 100,
                position: "absolute",
                right: 0,
                bottom: 0,
                borderRadius: 5,
              }}
            />
          </View>
        ) : (
          <Image
            source={{
              uri: item.image_uris.small,
            }}
            style={{ height: 168, width: 120, borderRadius: 6 }}
          />
        )}
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={styles.cardName}>{item.name}</Text>
          <Text style={styles.textLight}>{item.type_line}</Text>
          <Text style={styles.text}>{item.set_name}</Text>
          <View style={{flex:1}}></View>
          {item.nonfoil ? (
            <Pressable
              style={styles.button.base}
              onPress={() => findAndAddCard(item, false)}
            >
              <Text style={styles.buttonText}>
                Add copy: {item.prices.eur} €
              </Text>
            </Pressable>
          ) : null}
          {item.foil ? (
            <Pressable
              style={styles.button.base}
              onPress={() => findAndAddCard(item, true)}
            >
              <Text style={styles.buttonText}>
                Add foil copy: {item.prices.eur_foil} €
              </Text>
            </Pressable>
          ) : null}
          {item.foil == false && item.nonfoil == false ? <Pressable
              style={styles.button.base}
              onPress={() => findAndAddCard(item, true)}
            >
              <Text style={styles.buttonText}>
                Add special copy: N/A €
              </Text>
            </Pressable>:null}
        </View>
      </View>
    );
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

  const handleCapture = async () => {
    console.log("Clicked the capture button");
    if (cameraRef.current && !isProcessingImage) {
      console.log("something");
      try {
        setIsProcessingImage(true);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          skipProcessing: true,
        });

        const formdata = new FormData();
        formdata.append("file", {
          uri: photo.uri,
          name: "card.jpg",
          type: "image/jpeg",
        });

        const resp = await fetch("http://188.166.7.17:8000/getId/", {
          method: "POST",
          body: formdata,
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("We get the resp");
        const data = await resp.json();

        setFoundCards(data.ScryfallID.points);
      } catch (error) {
        console.log("Error in handleCapture");
        alert(error);
        setIsProcessingImage(false);
      }
    }
  };

  if (!permissions) {
    return (
      <View style={styles.centerContent}>
        <Text>Awaiting permissions</Text>
      </View>
    );
  }

  if (!permissions.granted) {
    return (
      <View style={styles.centerContent}>
        <Text>Permissions are missing</Text>
        <Button mode="contained" onPress={requestPermission}>
          Grant permission
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.centerContent}>
      <CameraView
        style={{ minWidth: "100%", minHeight: "100%" }}
        ref={cameraRef}
      ></CameraView>
      <Pressable style={styles.cameraButton} onPress={handleCapture}>
        {isProcessingImage ? (
          <ActivityIndicator size={"large"} color="white" />
        ) : (
          <Text style={styles.text}>Scan</Text>
        )}
      </Pressable>

      <CustomModal
        visible={showAddCardsModal}
        onClose={() => {
            setIsProcessingImage(false)
            setShowAddCardsModal(!showAddCardsModal)}}
      >
        <View style={{ height: 600, width: "100%" }}>
          <FlatList
            data={scryfallCards}
            style={{
              flex: 1,
            }}
            nestedScrollEnabled={true}
            keyExtractor={(item) => item.id}
            renderItem={(item) => renderListItem(item.item)}
          />
        </View>
      </CustomModal>
    </View>
  );
}
