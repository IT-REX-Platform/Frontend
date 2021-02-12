import React from "react";
import { Button, View, ImageBackground, StyleSheet, Pressable } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import AuthenticationService from "../services/AuthenticationService";
import { itRexVars } from "../constants/Constants";
import { LocalizationContext } from "../App";
import i18n from "../locales";

WebBrowser.maybeCompleteAuthSession();

export const LoginComponent: React.FC = () => {
    // Endpoint
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
            AuthenticationService.getInstance().setTokenResponse(authResponse.authentication);
        }
    }, [authResponse]);

    React.useContext(LocalizationContext);

    return (
        <View style={styles.container}>
            <ImageBackground source={require("../constants/images/Background_forest.svg")} style={styles.image}>
                <Pressable style={styles.StyledButton}>
                    <Button
                        disabled={authResponse?.type === "success"}
                        title={i18n.t("itrex.login")}
                        onPress={() => {
                            promptAuthentication();
                        }}
                    />
                </Pressable>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
    },
    image: {
        flex: 1,
        resizeMode: "stretch",
        justifyContent: "center",
    },
    StyledButton: {
        marginTop: 16,
        marginLeft: 500,
        marginRight: 500,
    },
});
