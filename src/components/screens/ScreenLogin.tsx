import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from "react-native";

import React from "react";
import { AuthContext, LocalizationContext } from "../Context";

import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { itRexVars } from "../../constants/Constants";
import i18n from "../../locales";
import { InteractionButton } from "../UIElements/InteractionButton";
import AuthenticationService, { discovery } from "../../services/AuthenticationService";
import { light } from "../../constants/themes/light";

WebBrowser.maybeCompleteAuthSession();

export const ScreenLogin: React.FC = () => {
    const { signIn } = React.useContext(AuthContext);

    const { locale, setLocale } = React.useContext(LocalizationContext);

    const [, authResponse, promptAuthentication] = AuthSession.useAuthRequest(
        {
            responseType: AuthSession.ResponseType.Code,
            clientId: itRexVars().authClientId,
            scopes: [],
            // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
            // this must be set to false
            usePKCE: false,
            // For usage in managed apps using the proxy
            redirectUri: AuthSession.makeRedirectUri({
                // For usage in bare and standalone
                native: itRexVars().authRedirectUrl,
                useProxy: false,
            }),
        },
        discovery
    );

    React.useEffect(() => {
        if (authResponse?.type === "success") {
            // we have received our session_state and code, now we can request our token
            AuthSession.exchangeCodeAsync(
                {
                    clientId: itRexVars().authClientId,
                    redirectUri: AuthSession.makeRedirectUri({
                        // For usage in bare and standalone
                        native: itRexVars().authRedirectUrl,
                    }),
                    code: authResponse?.params.code,
                    extraParams: {
                        // You must use the extraParams variation of clientSecret.
                        // Never store your client secret on the client.
                        client_secret: "",
                    },
                },
                { tokenEndpoint: discovery.tokenEndpoint }
            ).then((tResponse) => {
                signIn(tResponse);
            });
        }
    }, [authResponse]);

    return (
        <View style={styles.container}>
            <View style={styles.login}>
                <Text style={styles.welcome}>{i18n.t("itrex.welcome")}</Text>
                <InteractionButton
                    size={"large"}
                    onPress={() => {
                        promptAuthentication();
                    }}
                    title={i18n.t("itrex.login")}></InteractionButton>
                {locale == "en" || locale == "en-GB" || locale == "en-US" ? (
                    <InteractionButton
                        title={i18n.t("itrex.switchLangDE")}
                        onPress={() => setLocale("de-DE")}
                        size={"small"}
                        color={"light"}></InteractionButton>
                ) : (
                    <InteractionButton
                        title={i18n.t("itrex.switchLangEN")}
                        onPress={() => setLocale("en")}
                        size={"small"}
                        color={"light"}></InteractionButton>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingTop: 250,
        alignItems: "center",
        backgroundColor: "#071C45",
    },
    login: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 300,
        marginBottom: 150,
        paddingTop: 100,
        paddingBottom: 70,
        width: 500,
        shadowColor: "black",
        shadowRadius: 50,
        shadowOpacity: 0.5,
        borderRadius: 30,
        backgroundColor: "#071C45",
    },
    title: {
        marginTop: 20,
        marginBottom: 30,
        fontSize: 28,
        fontWeight: "500",
        color: "#7f78d2",
    },
    welcome: {
        marginBottom: 30,
        fontSize: 40,
        fontWeight: "500",
        color: "#FFFFFF",
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
