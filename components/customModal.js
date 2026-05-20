import React from 'react'
import {Modal, View, Pressable, Text, StyleSheet} from "react-native"
import { styles } from "../styles";
import react from "react";

const CustomModal = ({ visible, onClose, children }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.centerContent}>
        <View style={styles.modalBox}>
          <Pressable onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </Pressable>

          {children}
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;
