import React, {useEffect, useState} from 'react';
import {
    Alert,
    NativeEventEmitter,
    NativeModules,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View
} from "react-native";
import {Colors} from "react-native/Libraries/NewAppScreen";
import BleManager, {Peripheral} from "react-native-ble-manager";
import {deviceNameRegexTest} from "../utils/regex.ts";
import {screensNames} from "./screensNames.ts";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {AppColors, commonStyles} from "./commonStyles.ts";

const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

type Props = {};

function MainScreen({navigation}: { navigation: NativeStackNavigationProp<Props> }) {
    const isDarkMode = useColorScheme() === 'dark';

    const [devices, setDevices] = useState<Peripheral[]>([]);
    const [isScanning, setIsScanning] = useState(false);
    const [bluetoothEnabled, setBluetoothEnabled] = useState(false);

    useEffect(() => {
        BleManager.start({showAlert: false}).then(() => {
            console.log('BleManager initialized');
        });
        return () => {
            stopScan();
        };
    }, []);

    const checkBleState = (currentBleState: boolean) => {
        BleManager.checkState()
            .then((state) => {
                const newBleState = state === 'on';
                if (currentBleState !== newBleState) {
                    setIsScanning(false);
                    setBluetoothEnabled(newBleState);
                    setUpBleAlert(newBleState);
                }
            })
            .catch((error) => {
                console.error('Error checking Bluetooth status:', error);
            });
    }

    const setUpBleAlert = (state: boolean) => {
        Alert.alert('Bluetooth alert', state ? 'Bluetooth was switched on' : 'Bluetooth was switched off', [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
        ])
    }

    const setUpFoundedDeviceAlert = (name: string) => {
        Alert.alert('Founded device', `The device by pattern has been found: ${name}`, [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
        ])
    }

    useEffect(() => {
        const interval = setInterval(() => {
            checkBleState(bluetoothEnabled);
        }, 5000); // 5000 milliseconds = 5 seconds

        // Cleanup function to clear the interval when component unmounts
        return () => clearInterval(interval);
    }, [bluetoothEnabled]);

    const startScan = () => {
        setIsScanning(true);
        BleManager.scan([], 10, false).then(() => {
            console.log('Scanning...');
        });
    };
    const stopScan = () => {
        console.log('stop scan');
        BleManager.stopScan().then(() => {
            setIsScanning(false);
        });
    };

    const handleDiscoverPeripheral = (peripheral: Peripheral) => {
        const foundDevice = devices.find((dev) => dev.id === peripheral.id);
        console.log('name', peripheral.name);
        if (deviceNameRegexTest.test(peripheral.name!)) {
            setUpFoundedDeviceAlert(peripheral.name!);
            stopScan();
            navigation.navigate(screensNames.AUTH);
            console.log('The device by pattern has been found');
        }
        if (!foundDevice) {
            setDevices([...devices, peripheral]);
        }
    };

    useEffect(() => {
        const getDevices = BleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);

        return () => {
            stopScan();
            getDevices.remove();
        };
    }, []);

    return (
        <View
            style={styles.container}>
            <View>
                <Text
                    style={commonStyles.textStyle}>
                    React Native BLE
                </Text>
                <Text style={styles.textStyleWarning}>
                    Bluetooth is {bluetoothEnabled ? 'enabled' : 'disabled'}
                </Text>
                <Text style={styles.textStyleWarning}>
                    {!bluetoothEnabled ? 'Please, turn on bluetooth' : ''}
                </Text>
            </View>
            <TouchableOpacity
                disabled={!bluetoothEnabled}
                activeOpacity={0.5}
                style={bluetoothEnabled ? commonStyles.buttonStyle : commonStyles.buttonStyleDisabled}
                onPress={startScan}
            >
                <Text style={commonStyles.buttonTextStyle}>
                    {isScanning ? 'Scanning...' : 'Scan Bluetooth Devices'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                disabled={!isScanning}
                activeOpacity={0.5}
                style={isScanning ? commonStyles.buttonStyle : commonStyles.buttonStyleDisabled}
                onPress={stopScan}
            >
                <Text style={commonStyles.buttonTextStyle}>
                    Stop scanning
                </Text>
            </TouchableOpacity>
        </View>

    );
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: AppColors.bodyColor,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textStyleWarning: {
        fontSize: 24,
        textAlign: 'center',
        color: Colors.white,
    },
});
export default MainScreen;