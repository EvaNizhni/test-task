import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainScreen from "./screens/mainScreen.tsx";
import AuthScreen from "./screens/authScreen.tsx";
import {screensNames} from "./screens/screensNames.ts";
import {Dimensions, SafeAreaView, ScrollView, StatusBar, StyleSheet, useColorScheme} from "react-native";
import {Colors} from "react-native/Libraries/NewAppScreen";

const Stack = createNativeStackNavigator();

const App = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

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
                <NavigationContainer>
                    <Stack.Navigator
                        screenOptions={{
                            headerStyle: {
                                backgroundColor: '#0035b5', // Set the background color of the header
                            },
                            headerTintColor: '#fff', // Set the text color of the header
                            headerTitleStyle: {
                                fontWeight: 'bold', // Set the font weight of the header title
                            },
                        }}>
                        <Stack.Screen
                            name={screensNames.MAIN}
                            component={MainScreen}
                        />
                        <Stack.Screen name={screensNames.AUTH} component={AuthScreen}/>
                    </Stack.Navigator>
                </NavigationContainer>
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
    }
});

export default App;