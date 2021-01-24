import React, { useState } from "react";
import { View, Switch, StyleSheet, SafeAreaView, Text } from "react-native";
import i18n from "../locales/index";

export default function App() {
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

    return (
        <SafeAreaView style={styles.container}>
            <Text>{i18n.t("itrex.languageSwitch")}</Text>
            <Switch
                trackColor={{ false: "#767577", true: "#767577" }}
                thumbColor={isEnabled ? "#f4f3f4" : "#f4f3f4"}
                ios_backgroundColor="#767577"
                onValueChange={toggleSwitch}
                value={isEnabled}
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
