import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { LocalizationContext } from "../Context";
import i18n from "../../locales";

/**
 * After logout, keycloak will redirect to this page.
 * This happens in a new Browser Tab/Window
 * The ScreenLogout will close the Window/Tab
 */
export const ScreenLogout: React.FC = () => {
    React.useContext(LocalizationContext);

    if (Platform.OS === "web") {
        window.close();
    }

    return (
        <View style={styles.container}>
            <Text>{i18n.t("itrex.logoutSuccess")}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
