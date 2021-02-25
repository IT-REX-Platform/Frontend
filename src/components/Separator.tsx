import React from "react";
import { StyleSheet, View } from "react-native";

export const Separator: React.FC = () => {
    return <View style={[styles.separator]} />;
};

const styles = StyleSheet.create({
    separator: {
        width: "100%",
        backgroundColor: "#eeeeee",
        padding: 1,
    },
});
