import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ContentProgressTrackerState } from "../../constants/ContentProgressTrackerState";
import { dark } from "../../constants/themes/dark";
import i18n from "../../locales";
import { IContentProgressTracker } from "../../types/IContentProgressTracker";

interface ContentProgressInfoProps {
    contentTracker: IContentProgressTracker;
}

export const ContentProgressInfo: React.FC<ContentProgressInfoProps> = (props) => {
    if (props.contentTracker === undefined) {
        return (
            <View style={styles.untouchedCard}>
                <View style={styles.circleUntouched} />
                <Text style={styles.textUntouched}>{i18n.t("itrex.contentProgressUntouched")}</Text>
            </View>
        );
    } else if (props.contentTracker.state === ContentProgressTrackerState.STARTED) {
        return (
            <View style={styles.startedCard}>
                <View style={styles.circleStarted} />
                <Text style={styles.textStarted}>{i18n.t("itrex.contentProgressStarted")}</Text>
            </View>
        );
    } else if (props.contentTracker.state === ContentProgressTrackerState.COMPLETED) {
        return (
            <View style={styles.completedCard}>
                <View style={styles.circleCompleted} />
                <Text style={styles.textCompleted}>{i18n.t("itrex.contentProgressCompleted")}</Text>
            </View>
        );
    } else {
        return <></>;
    }
};

const styles = StyleSheet.create({
    untouchedCard: {
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
    circleUntouched: {
        shadowRadius: 10,
        shadowColor: dark.theme.pink,
        shadowOffset: { width: -1, height: 1 },
        width: 8,
        height: 8,
        borderRadius: 8 / 2,
        backgroundColor: dark.theme.pink,
        marginRight: 3,
    },
    textUntouched: {
        color: dark.theme.pink,
        fontSize: 10,
    },

    startedCard: {
        flexDirection: "row",
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
        borderColor: dark.theme.lightBlue,
        borderWidth: 2,
        textShadowColor: dark.theme.lightBlue,
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
        width: 100,
        height: 20,
    },
    circleStarted: {
        shadowRadius: 10,
        shadowColor: dark.theme.lightBlue,
        shadowOffset: { width: -1, height: 1 },
        width: 8,
        height: 8,
        borderRadius: 8 / 2,
        backgroundColor: dark.theme.lightBlue,
        marginRight: 5,
    },
    textStarted: {
        color: dark.theme.lightBlue,
        fontSize: 10,
    },

    completedCard: {
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
    circleCompleted: {
        shadowRadius: 10,
        shadowColor: dark.theme.lightGreen,
        shadowOffset: { width: -1, height: 1 },
        width: 8,
        height: 8,
        borderRadius: 8 / 2,
        backgroundColor: dark.theme.lightGreen,
        marginRight: 5,
    },
    textCompleted: {
        color: dark.theme.lightGreen,
        fontSize: 10,
    },
});
