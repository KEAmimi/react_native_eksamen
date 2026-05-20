import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { styles } from "../styles";
import { CameraView, useCameraPermissions } from "expo-camera";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CameraPageTest() {
  const [permissions, requestPermission] = useCameraPermissions();

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
        <Button mode='contained' onPress={requestPermission}>
            Grant permission
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.centerContent}>
      <Text>Hello camera</Text>
      <CameraView style={{ minHeight: 500, minWidth: 300 }}></CameraView>
    </View>
  );
}
