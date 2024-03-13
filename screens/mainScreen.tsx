import React, {useEffect, useState} from 'react';
import {NativeEventEmitter, NativeModules, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Colors} from "react-native/Libraries/NewAppScreen";
import BleManager, {Peripheral} from "react-native-ble-manager";
import {deviceNameRegex} from "../utils/regex.ts";
import {ScreensNames} from "./screensNames.ts";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {AppColors, commonStyles} from "./commonStyles.ts";
import {setUpBleAlert, setUpFoundedDeviceAlert} from "../utils/alertConsts.tsx";

const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

type Props = {};

function MainScreen({navigation}: { navigation: NativeStackNavigationProp<Props> }) {
    /// information about available devices
    const [devices, setDevices] = useState<Peripheral[]>([]);
    /// State is app current in scanning mode
    const [isScanning, setIsScanning] = useState(false);
    /// State is bluetooth currently swiched on
    const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(false);

    /// use effect to start Ble manager
    useEffect(() => {
        BleManager.start({showAlert: false}).then(() => {
            console.log('BleManager initialized');
        });
        return () => {
            stopScan();
        };
    }, []);

    /// use effect to set up timer for check bluetooth state every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            checkBleState(isBluetoothEnabled);
        }, 5000); // 5000 milliseconds = 5 seconds

        // Cleanup function to clear the interval when component unmounts
        return () => clearInterval(interval);
    }, [isBluetoothEnabled]);

    /// function to check bluetooth state
    const checkBleState = (currentBleState: boolean) => {
        BleManager.checkState()
            .then((state) => {
                const newBleState = state === 'on';
                if (currentBleState !== newBleState) {
                    setIsScanning(false);
                    setIsBluetoothEnabled(newBleState);
                    setUpBleAlert(newBleState);
                }
            })
            .catch((error) => {
                console.error('Error checking Bluetooth status:', error);
            });
    }

    /// use effect to subscribe for new founded devices
    useEffect(() => {
        const getDevices = BleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);

        return () => {
            stopScan();
            getDevices.remove();
        };
    }, []);

    /// check and save information about new device
    const handleDiscoverPeripheral = (peripheral: Peripheral) => {
        const foundDevice = devices.find((dev) => dev.id === peripheral.id);
        console.log('name', peripheral.name);
        if (deviceNameRegex.test(peripheral.name!)) {
            setUpFoundedDeviceAlert(peripheral.name!);
            stopScan();
            navigation.navigate(ScreensNames.AUTH);
            console.log('The device by pattern has been found');
        }
        if (!foundDevice) {
            setDevices([...devices, peripheral]);
        }
    };

    /// Function to start scan devices
    const startScan = () => {
        setIsScanning(true);
        BleManager.scan([], 10, false).then(() => {
            console.log('Scanning...');
        });
    };
    /// Function to stop scan devices
    const stopScan = () => {
        console.log('stop scan');
        BleManager.stopScan().then(() => {
            setIsScanning(false);
        });
    };

    return (
        <View
            style={styles.container}>
            <View>
                <Text
                    style={commonStyles.textStyle}>
                    React Native BLE
                </Text>
                <Text style={styles.textStyleWarning}>
                    Bluetooth is {isBluetoothEnabled ? 'enabled' : 'disabled'}
                </Text>
                <Text style={styles.textStyleWarning}>
                    {!isBluetoothEnabled ? 'Please, turn on bluetooth' : ''}
                </Text>
            </View>
            <TouchableOpacity
                disabled={!isBluetoothEnabled}
                activeOpacity={0.5}
                style={isBluetoothEnabled ? commonStyles.buttonStyle : commonStyles.buttonStyleDisabled}
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