import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ImageBackground } from "react-native";

import React from "react";
import { AuthContext, LocalizationContext } from "../Context";

import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { itRexVars } from "../../constants/Constants";
import i18n from "../../locales";
import { discovery } from "../../services/AuthenticationService";
import { TextButton } from "../UIElements/TextButton";

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
        //TODO: Login page completely responsive -> Login & IT-Rex
        <View style={styles.landing}>
            <ImageBackground
                source={require("../../constants/images/Background_Login.png")}
                style={styles.background}></ImageBackground>
            <View style={styles.container}>
                <View style={styles.login}>
                    <Text style={styles.welcome}>{i18n.t("itrex.welcome")}</Text>
                    <TextButton
                        title={i18n.t("itrex.login")}
                        size={"large"}
                        fontsize="large"
                        color="dark"
                        onPress={() => {
                            promptAuthentication();
                        }}
                    />
                    {locale == "en" || locale == "en-GB" || locale == "en-US" ? (
                        <TextButton
                            title={i18n.t("itrex.switchLangDE")}
                            size="small"
                            color="light"
                            onPress={() => setLocale("de-DE")}
                        />
                    ) : (
                        <TextButton
                            title={i18n.t("itrex.switchLangEN")}
                            size="small"
                            color="light"
                            onPress={() => setLocale("en")}
                        />
                    )}
                </View>
                <Image source={require("../../constants/images/ITRex-Login.png")} style={[styles.itrex]}></Image>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    landing: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: "#071C45",
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    background: {
        flex: 1,
        resizeMode: "stretch",
        paddingBottom: 300,
        alignItems: "center",
    },
    itrex: {
        zIndex: 1,
        marginBottom: 840,
        width: 480,
        height: 440,
    },
    login: {
        flex: 1,
        zIndex: 0,
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 150,
        paddingTop: 50,
        paddingBottom: 30,
        width: 500,
        shadowColor: "black",
        shadowRadius: 50,
        shadowOpacity: 0.5,
        borderRadius: 30,
        backgroundColor: "#071C45",
    },
    welcome: {
        marginBottom: 30,
        fontSize: 40,
        fontWeight: "500",
        color: "#FFFFFF",
    },
});
