import React from "react";
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";
import i18n from "../../locales";
import { Header } from "../../constants/navigators/Header";
import { LocalizationContext } from "../Context";

export const ScreenHomeLecturer: React.FC = () => {
    React.useContext(LocalizationContext);

    return (
        <View style={styles.container}>
            <ImageBackground source={require("../../constants/images/Background2.png")} style={styles.image}>
                <Header title={i18n.t("itrex.home")} />
                <View style={styles.textContainer}>
                    <Image
                        source={require("../../constants/images/ITRex-Logo-ob_750x750.png")}
                        style={[styles.icon]}></Image>
                    <Text style={styles.textSytle}>{i18n.t("itrex.welcome")} Lecturer</Text>
                    <Text style={styles.textSytle}>{i18n.t("itrex.starter")}</Text>
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
        resizeMode: "contain",
        justifyContent: "center",
    },
    icon: {
        width: 100,
        height: 100,
    },
    textSytle: {
        color: "white",
    },
});
