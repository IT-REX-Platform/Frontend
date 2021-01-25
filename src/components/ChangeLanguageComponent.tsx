import React, { useState } from "react";
import { Switch, StyleSheet, SafeAreaView, Text } from "react-native";
import i18n from "../locales/index";

export default function App() {
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
    var boolSwitch;

    if (i18n.locale == "de" || i18n.locale == "de-DE") {
        boolSwitch = true;
    } else {
        boolSwitch = false;
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text>{i18n.t("itrex.languageSwitch")}</Text>
            <Switch
                trackColor={{ false: "#767577", true: "#767577" }}
                thumbColor={boolSwitch ? "#f4f3f4" : "#f4f3f4"}
                ios_backgroundColor="#767577"
                onValueChange={toggleSwitch}
                value={boolSwitch}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
    },
});
