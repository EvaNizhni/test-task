import React, {useState} from 'react';
import {Alert, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Colors} from "react-native/Libraries/NewAppScreen";
import {ScreensNames} from "./screensNames.ts";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {AppColors, commonStyles} from "./commonStyles.ts";

type Props = {};

const AuthScreen = ({navigation}: { navigation: NativeStackNavigationProp<Props, ScreensNames.AUTH> }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Here you can implement your authentication logic
        if (email === 'example@email.com' && password === 'password') {
            Alert.alert('Login Successful');
            navigation.navigate(ScreensNames.MAIN);
        } else {
            Alert.alert('Invalid email or password');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={text => setEmail(text)}
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                onChangeText={text => setPassword(text)}
                value={password}
                secureTextEntry
            />
            <TouchableOpacity style={commonStyles.buttonStyle} onPress={handleLogin}>
                <Text style={commonStyles.buttonTextStyle}>
                    Login
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: AppColors.bodyColor,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    input: {
        color: Colors.white,
        height: 40,
        width: '100%',
        borderColor: Colors.white,
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
});

export default AuthScreen;
