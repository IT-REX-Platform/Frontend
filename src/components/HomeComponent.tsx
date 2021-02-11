import React from "react";
import { Button, Image, StyleSheet, View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NavigationRoutes } from "../constants/NavigationRoutes";
import { LocalizationContext } from "../App";
import i18n from "../locales";

export const HomeComponent: React.FC = ({ navigation }) => {
    React.useContext(LocalizationContext);

    return (
        <View style={styles.container}>
            <Image source={require("../constants/themes/ITRex-Logo-ob.svg")} style={[styles.icon]}></Image>
            <Text>This is IT-Rex!</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    icon: {
        width: 100,
        height: 100,
    },
});
