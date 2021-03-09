import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { dark } from "../../constants/themes/dark";
import i18n from "../../locales";

export const InfoUnpublished: React.FC = () => {
    return (
        <View style={styles.unpublishedCard}>
            <View style={styles.circleUnpublished} />
            <Text style={styles.textUnpublished}>{i18n.t("itrex.unpublished")}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    unpublishedCard: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
        borderColor: dark.theme.pink,
        borderWidth: 2,
        textShadowColor: dark.theme.pink,
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
        width: 100,
        height: 20,
    },
    circleUnpublished: {
        shadowRadius: 10,
        shadowColor: dark.theme.pink,
        shadowOffset: { width: -1, height: 1 },
        width: 8,
        height: 8,
        borderRadius: 8 / 2,
        backgroundColor: dark.theme.pink,
        marginRight: 3,
    },
    textUnpublished: {
        color: dark.theme.pink,
        fontSize: 10,
    },
});
