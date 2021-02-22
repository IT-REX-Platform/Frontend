import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { LocalizationContext } from "../App";
import { loggerFactory } from "../../logger/LoggerConfig";
// import { Route, useRoute } from "@react-navigation/native";
// const route = useRoute();
import { IVideo } from "../types/IVideo";
import { NavigationProps } from "../types/NavigationProps";

const loggerService = loggerFactory.getLogger("service.VideoComponent");

export const VideoComponent: React.FC<NavigationProps> = ({ route }) => {
    loggerService.trace("Started VideoComponent.");

    const video: IVideo = route.params.video;
    console.log(video);

    React.useContext(LocalizationContext);

    return (
        <View style={styles.container}>
            <Text style={styles.textStyle}>{video.title}</Text>
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
    textStyle: {
        color: "black",
        fontSize: 20,
    },
});
