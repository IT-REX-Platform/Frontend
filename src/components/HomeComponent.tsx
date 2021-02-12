import React from "react";
import { Button, Image, StyleSheet, View, Text, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NavigationRoutes } from "../constants/navigators/NavigationRoutes";
import { LocalizationContext } from "../App";
import i18n from "../locales";
import { dark } from "../constants/themes/dark";

export const HomeComponent: React.FC = ({ navigation }) => {
    React.useContext(LocalizationContext);

    return (
        <View style={styles.container}>
            <ImageBackground source={require("../constants/images/Background_forest.svg")} style={styles.image}>
                <View style={styles.textContainer}>
                    <Image source={require("../constants/images/ITRex-Logo-ob.svg")} style={[styles.icon]}></Image>
                    <Text>{i18n.t("itrex.welcome")}</Text>
                    <Text>{i18n.t("itrex.starter")}</Text>
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    textContainer: {
        marginTop: 20,
        marginBottom: 20,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    container: {
        flex: 1,
        flexDirection: "column",
    },
    image: {
        flex: 1,
        resizeMode: "stretch",
        justifyContent: "center",
    },
    icon: {
        width: 100,
        height: 100,
    },
});
