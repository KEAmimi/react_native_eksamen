import React from 'react'
import {Modal, View, Pressable, Text, StyleSheet} from "react-native"
import { styles } from "../styles";
import react from "react";

const CustomModal = ({ visible, onClose, children }) => {

  
  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View onPress={onClose} style={[styles.centerContent, styles.modalBackGround]}>
        <View style={styles.modalBox}>
          <Pressable onPress={onClose} style={[styles.button.base, styles.button.close]}>
            <Text style={styles.buttonText}>Close</Text>
          </Pressable>

          {children}
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;
