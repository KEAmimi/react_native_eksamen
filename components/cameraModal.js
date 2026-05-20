import React from "react";
import { Modal, View, Pressable, Text, StyleSheet } from "react-native";
import { styles } from "../styles";
import react from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Button } from "react-native-paper";

const CameraModal = ({ visible, onClose, captureFunction, camRef }) => {
  const [permissions, requestPermission] = useCameraPermissions();

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.centerContent}>
        <View style={styles.modalBox}>
          <Pressable onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
          {permissions ? (
            permissions.granted ? (
              <View style={{flex: 1}}>
                <CameraView style={{ flex: 1 }} ref={camRef}></CameraView>
                <Button mode="contained" onPress={captureFunction}>Take picture</Button>
              </View>
            ) : (
              <View>
                <Text>Not Allowed</Text>
                <Button mode="contained" onPress={requestPermission}>
                  Request permissions
                </Button>
              </View>
            )
          ) : (
            <Text>Awaiting Permissions</Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default CameraModal;
