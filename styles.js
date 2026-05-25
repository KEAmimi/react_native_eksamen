import { StyleSheet } from "react-native";

const bgBlack = "#1a1b1eff";
const boxGray = "#313337ff";
const lightGray = "#3e4144ff";
const textWhite = "white";
const primary = "#008b89ff";
const danger = '#be1c1cff';

export const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: bgBlack,
  },
  content: {
    flex: 1,
    padding: 10,
    gap: 10
  },
  box: {
    width: "100%",
    backgroundColor: boxGray,
    padding: 20,
    borderRadius: 10,
  },
  boxTitle: {
    color: textWhite,
    fontFamily: "Beleren",
    fontSize: 20,
    marginBottom: 20,
  },
  loginBox: {
    backgroundColor: boxGray,
    width: 300,
    padding: 20,
    borderRadius: 20,
    gap: 10,
  },
  button: {
    base: {
      backgroundColor: primary,
      display: "flex",
      padding: 10,
      borderRadius: 10,
      alignSelf: "flex-start",
    },
    gray:{
      backgroundColor:lightGray
    },
    close:{
      backgroundColor: danger,
      position: 'absolute',
      top:-40,
      right: 0,
      zIndex: 2
    },
    shadow:{
      shadowColor: 'black',
      shadowOffset: {height: 3, width: 3},
      shadowOpacity: 0.4,
      shadowRadius: 6
    },
    large:{
      padding:20
    },
    danger:{
      backgroundColor: danger
    }
  },
  buttonText: {
    color: textWhite,
    fontFamily: "Beleren",
  },
  header: {
    backgroundColor: "yellow",
    height: 70,
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    padding: 15,
  },
  footer: {
    whole: {
      backgroundColor: boxGray,
      height: 80,
      bottom: -40,
    },
    top: {
      backgroundColor: "blue",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
    },
    bottom: {
      backgroundColor: "red",
    },
    button: {
      padding: 10,
    },
  },
  rowView: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  modalBox: {
    width: "90%",
    minHeight: '40%',
    maxHeight: "80%",
    padding: 10,
    gap: 10,
    backgroundColor: boxGray,
    borderRadius: 20,
    shadowColor: "black",
    shadowRadius: 20,
    shadowOpacity: 0.3,
    shadowOffset: { width: 5, height: 5 },
  },
  modalBackGround:{
    backgroundColor: "#00000077"
  },
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  colorFilterSwitchBox:{
    width: '30%',
    gap: 10,
    alignItems: 'center',
  },
  colorSwitch:{
    alignSelf: 'center'
  },
  textInput: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    padding: 5,
    fontSize: 12,
  },
  cameraButton: {
    position: "absolute",
    minHeight: 100,
    minWidth: 100,
    backgroundColor: primary,
    borderRadius: 50,
    bottom: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
  },
  textLight:{
    color: "#ffffff7c"
  },
  textInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    color: bgBlack,
    borderRadius: 10,
    backgroundColor: "white",
  },
  collectionControls:{
    position: 'absolute',
    bottom: -30,
    zIndex: 10,
    margin: 10
  },
  testBox:{
    borderWidth: 2,
    borderColor: 'red'
  },
  compressedCard:{
    height: 100,
    marginBottom: 5,
    borderRadius: 17,
    flexDirection: 'row',
    overflow: 'hidden',
    boxShadow: '-2px 2px 1px #ffffff55 inset, 2px -2px 1px rgba(0, 0, 0, 0.51)3 inset'
  },
  normalCard:{
    borderWidth: 0,
    padding: 10
  },
  fullartCard:{
  },
  cardColors:{
    multicolor:{
      backgroundColor: '#c99e42ff'
    },
    colorless:{
      backgroundColor: 'gray'
    },
    white:{
      backgroundColor: 'white'
    },
    blue:{
      backgroundColor: 'blue'
    },
    black:{
      backgroundColor: 'black'
    },
    red:{
      backgroundColor: 'red'
    },
    green:{
      backgroundColor: 'green'
    },
    land:{
      backgroundColor: 'purple'
    }
  },
  fullartImage:{
    left: 0,
    width: 100,
    height: 100,
  },
  normalImage:{
    width: 80,
    height: 78,
    borderRadius: 7
  },
  cardInfo:{
    padding: 4,
    gap: 3
  },
  cardName:{
    color:'white',
    fontFamily: 'Beleren',
  },
  amountControl:{
    container:{
      flexDirection: 'row',
      gap: 10,
      alignSelf: 'flex-start',
      backgroundColor: 'white',
      borderRadius: 20,
      overflow: 'hidden'
    },
    button:{
      backgroundColor: primary,
      padding: 10,
      paddingLeft: 15,
      paddingRight: 15
    },
    amount:{
      padding: 10
    }
  },
  totalPrice:{
    fontSize: 60,
    fontFamily: 'Beleren',
    color: 'white'
  },
  profilePicBox:{
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10
  },
  sortingBlock:{
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10
  }
});
