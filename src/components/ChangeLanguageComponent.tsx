import React, { useState } from "react";
import { StyleSheet, SafeAreaView, Text, Button, Alert, Pressable } from "react-native";
import i18n from "../locales/index";

export default function App() {
    var colorSwtich;

    if (i18n.locale == "de" || i18n.locale == "de-DE") {
        colorSwtich = true;
    } else {
        colorSwtich = false;
    }

    return (
        <SafeAreaView style={styles.container}>
            <Pressable style={styles.StyledButtonEN}>
                <Button title="EN" onPress={() => Alert.alert("Button with adjusted color pressed")} />
            </Pressable>
            <Pressable style={styles.StyledButtonDE}>
                <Button title="DE" onPress={() => Alert.alert("Button with adjusted color pressed")} />
            </Pressable>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    },
    StyledButtonEN: {
        marginRight: 5,
    },
    StyledButtonDE: {
        marginLeft: 5,
    },
});
