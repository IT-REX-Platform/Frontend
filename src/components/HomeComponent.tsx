import React from "react";
import { Button, Image, StyleSheet, View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NavigationRoutes } from "../constants/navigators/NavigationRoutes";
import { LocalizationContext } from "../App";
import i18n from "../locales";

export const HomeComponent: React.FC = ({ navigation }) => {
    React.useContext(LocalizationContext);

    return (
        <View style={styles.container}>
            <Image source={require("../constants/images/ITRex-Logo-ob.svg")} style={[styles.icon]}></Image>
            <Text>{i18n.t("itrex.welcome")}</Text>
            <Text>{i18n.t("itrex.starter")}</Text>
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
