import {Alert} from "react-native";

export const setUpBleAlert = (state: boolean) => {
    Alert.alert('Bluetooth alert', state ? 'Bluetooth was switched on' : 'Bluetooth was switched off', [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
    ])
}

export const setUpFoundedDeviceAlert = (name: string) => {
    Alert.alert('Founded device', `The device by pattern has been found: ${name}`, [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
    ])
}