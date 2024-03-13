import {StyleSheet} from "react-native";
import {Colors} from "react-native/Libraries/NewAppScreen";

export const AppColors={
    bodyColor:'#010e42',
    headerColor:'#0035b5',
    buttonColorActive:'#0481ab'
}

export const commonStyles = StyleSheet.create({
    textStyle: {
        fontSize: 30,
        textAlign: 'center',
        color: Colors.white,
    },
    buttonStyle: {
        backgroundColor: AppColors.buttonColorActive,
        borderWidth: 0,
        color: '#FFFFFF',
        borderColor: '#307ecc',
        height: 40,
        alignItems: 'center',
        borderRadius: 10,
        paddingHorizontal: 20,
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
        borderRadius: 10,
        paddingHorizontal: 20,
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