import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Text, ImageBackground, StyleSheet, View } from "react-native";
import { dark } from "../../../constants/themes/dark";
import { LocalizationContext } from "../../Context";
import AuthenticationService from "../../../services/AuthenticationService";
import { IUser } from "../../../types/IUser";

export const ScreenAddQuiz: React.FC = () => {
    React.useContext(LocalizationContext);

    const [user, setUserInfo] = useState<IUser>({});
    useEffect(() => {
        AuthenticationService.getInstance().getUserInfo(setUserInfo);
    }, []);

    return (
        <View style={styles.rootContainer}>
            <ImageBackground source={require("../../../constants/images/Background2.png")} style={styles.image}>
                <View style={styles.container}>
                    <View style={styles.content}></View>
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 70,
        textDecorationColor: dark.theme.pink,
        fontSize: 50,
        color: "white",
        fontWeight: "bold",
        justifyContent: "center",
        textAlign: "center",
    },
    rootContainer: {
        paddingTop: "3%",
        flex: 4,
        flexDirection: "column",
        backgroundColor: dark.theme.darkBlue1,
    },
    image: {
        flex: 1,
        resizeMode: "stretch",
    },
    content: {
        flex: 1,
        margin: 15,
        color: "white",
        alignItems: "center",
    },
});
