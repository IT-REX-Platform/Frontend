import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import React from "react";
import { AuthContext, LocalizationContext } from "../Context";

import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { itRexVars } from "../../constants/Constants";
import i18n from "../../locales";

WebBrowser.maybeCompleteAuthSession();

export const ScreenLogin: React.FC = () => {
    const { signIn } = React.useContext(AuthContext);

    const { locale, setLocale } = React.useContext(LocalizationContext);

    const discovery = {
        authorizationEndpoint: itRexVars().authEndpoint,
        tokenEndpoint: itRexVars().authTokenEndpoint,
    };

    const [, authResponse, promptAuthentication] = AuthSession.useAuthRequest(
        {
            responseType: AuthSession.ResponseType.Token,
            clientId: "web_app",
            scopes: [],
            // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
            // this must be set to false
            usePKCE: false,
            // For usage in managed apps using the proxy
            redirectUri: AuthSession.makeRedirectUri({
                // For usage in bare and standalone
                native: "it-rex://login",
                useProxy: false,
            }),
        },
        discovery
    );

    React.useEffect(() => {
        if (authResponse?.type === "success" && authResponse.authentication != null) {
            signIn(authResponse.authentication);
        }
    }, [authResponse]);

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    promptAuthentication();
                }}>
                <Text style={styles.buttonText}>{i18n.t("itrex.login")}</Text>
            </TouchableOpacity>
            {locale == "en" || locale == "en-GB" || locale == "en-US" ? (
                <Button title={i18n.t("itrex.switchLangDE")} onPress={() => setLocale("de-DE")} />
            ) : (
                <Button title={i18n.t("itrex.switchLangEN")} onPress={() => setLocale("en")} />
            )}
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
