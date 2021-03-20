import { Button, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import React from "react";
import { AuthContext, LocalizationContext } from "../Context";

import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { itRexVars } from "../../constants/Constants";
import i18n from "../../locales";
import { discovery } from "../../services/AuthenticationService";

export const ScreenLogout: React.FC = () => {
    if (Platform.OS === "web") {
        window.close();
    }
    return (
        <View style={styles.container}>
            <Text>Erfolgreich ausgeloggt</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        marginTop: 20,
        marginBottom: 30,
        fontSize: 28,
        fontWeight: "500",
        color: "#7f78d2",
    },
    button: {
        flexDirection: "row",
        borderRadius: 30,
        marginTop: 10,
        marginBottom: 10,
        width: 300,
        height: 60,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#481380",
    },
    buttonText: {
        color: "#ffe2ff",
        fontSize: 24,
        marginRight: 5,
    },
});
