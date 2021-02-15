import React from "react";
import { Image, StyleSheet, View, Text, ImageBackground } from "react-native";
import { LocalizationContext } from "../App";
import i18n from "../locales";
import { Header } from "../constants/navigators/Header";

export const HomeComponent: React.FC = () => {
    React.useContext(LocalizationContext);

    return (
        <View style={styles.container}>
            <ImageBackground source={require("../constants/images/Background_forest.svg")} style={styles.image}>
                <Header title={i18n.t("itrex.home")} />
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
