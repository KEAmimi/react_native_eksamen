import {View, Text, Pressable} from 'react-native'
import { styles } from '../styles'


const CustomHeader = ({title, onLeftPress, leftLabel, onRightPress, rightLabel}) =>{
    return(
        <View style={styles.header}>
            <Pressable onPress={onLeftPress}>
                <Text>{leftLabel}</Text>
            </Pressable>
            <Text>{title}</Text>
            <Pressable onPress={onRightPress}>
                <Text>{rightLabel}</Text>
            </Pressable>
        </View>
    )
}

export default CustomHeader