import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { dark } from "../../constants/themes/dark";
import i18n from "../../locales";

export const InfoPublished: React.FC = () => {
    return (
        <View style={styles.publishedCard}>
            <View style={styles.circlePublished} />
            <Text style={styles.textPublished}>{i18n.t("itrex.published")}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    publishedCard: {
        flexDirection: "row",
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
        borderColor: dark.theme.lightGreen,
        borderWidth: 2,
        textShadowColor: dark.theme.lightGreen,
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
        width: 100,
        height: 20,
    },
    circlePublished: {
        shadowRadius: 10,
        shadowColor: dark.theme.lightGreen,
        shadowOffset: { width: -1, height: 1 },
        width: 8,
        height: 8,
        borderRadius: 8 / 2,
        backgroundColor: dark.theme.lightGreen,
        marginRight: 5,
    },
    textPublished: {
        color: dark.theme.lightGreen,
        fontSize: 10,
    },
});
