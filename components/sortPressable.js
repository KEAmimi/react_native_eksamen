import { Pressable, Text } from "react-native";
import { styles } from "../styles";

export default function SortPressable({
  onPress,
  title,
  sortChoice,
  ascendingStatus,
  desiredAsc,
  desiredSort,

}) {
  const sortActive = "#5b5b5bff";
  const sortInActive = "#474747ff";
  return (
    <Pressable
      onPress={onPress}
      style={() => {
        var isActive = sortChoice === desiredSort && ascendingStatus === desiredAsc;

        return [
          styles.rowView,
          styles.sortingBlock,
          {
            backgroundColor: isActive ? sortActive : sortInActive,
            borderColor: isActive ? "white" : sortInActive,
          },
        ];
      }}
    >
      <Text style={styles.cardName}>{title}</Text>
    </Pressable>
  );
}
