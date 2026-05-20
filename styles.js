import { StyleSheet } from "react-native";

const bgBlack = "#1a1b1eff";
const boxGray = "#26282bff";
const textWhite = "white";

export const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: bgBlack,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  box: {
    width: "100%",
    backgroundColor: boxGray,
    padding: 10,
    borderRadius: 10,
  },
  loginBox: {
    backgroundColor: boxGray,
    width: 200,
  },
  buttonText: {
    color: "blue",
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
    top:{
      backgroundColor: 'blue',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row'
    },
    bottom:{
      backgroundColor: 'red'
    },
    button:{
      padding: 10,
      
    }
  },
  rowView: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  modalBox: {
    width: "80%",
    height: "60%",
    padding: 20,
    gap: 10,
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "black",
    shadowRadius: 20,
    shadowOpacity: 0.3,
    shadowOffset: { width: 5, height: 5 },
  },
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    padding: 5,
    fontSize: 12,
  },
});
