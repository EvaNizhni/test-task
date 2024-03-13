import React, {useEffect, useState} from 'react';
import {
    Alert,
    Dimensions,
    NativeEventEmitter,
    NativeModules,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';
import BleManager, {Peripheral} from 'react-native-ble-manager';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {deviceNameRegex} from "./utils/regex.ts";

const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const App = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    const [devices, setDevices] = useState<Peripheral[]>([]);
    const [scanning, setScanning] = useState(false);
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
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
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
        setScanning(true);
        BleManager.scan([], 10, false).then(() => {
            console.log('Scanning...');
        });
    };
    const stopScan = () => {
        console.log('stop scan');
        BleManager.stopScan().then(() => {
            setScanning(false);
        });
    };

    const handleDiscoverPeripheral = (peripheral: Peripheral) => {
        const foundDevice = devices.find((dev) => dev.id === peripheral.id);
        if (deviceNameRegex.test(peripheral.name!)) {
            console.log('The device by pattern has found');
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
        <SafeAreaView style={[backgroundStyle, styles.mainBody]}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />
            <ScrollView
                style={backgroundStyle}
                contentContainerStyle={styles.mainBody}
                contentInsetAdjustmentBehavior="automatic">
                <View
                    style={{
                        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
                        marginBottom: 40,
                    }}>
                    <View>
                        <Text
                            style={styles.textStyle}>
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
                        style={bluetoothEnabled ? styles.buttonStyle : styles.buttonStyleDisabled}
                        onPress={startScan}
                    >
                        <Text style={styles.buttonTextStyle}>
                            {isScanning ? 'Scanning...' : 'Scan Bluetooth Devices'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    mainBody: {
        flex: 1,
        justifyContent: 'center',
        height: windowHeight,
    },
    textStyle: {
        fontSize: 30,
        textAlign: 'center',
        color: Colors.white,
    },
    textStyleWarning: {
        fontSize: 24,
        textAlign: 'center',
        color: Colors.white,
    },
    buttonStyle: {
        backgroundColor: '#307ecc',
        borderWidth: 0,
        color: '#FFFFFF',
        borderColor: '#307ecc',
        height: 40,
        alignItems: 'center',
        borderRadius: 30,
        marginLeft: 35,
        marginRight: 35,
        marginTop: 15,
    },
    buttonStyleDisabled: {
        backgroundColor: 'gray',
        borderWidth: 0,
        color: '#FFFFFF',
        borderColor: '#307ecc',
        height: 40,
        alignItems: 'center',
        borderRadius: 30,
        marginLeft: 35,
        marginRight: 35,
        marginTop: 15,
    },
    buttonTextStyle: {
        color: '#FFFFFF',
        paddingVertical: 10,
        fontSize: 16,
    },
});
export default App;