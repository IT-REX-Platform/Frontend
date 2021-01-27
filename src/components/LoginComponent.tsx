import React from "react";
import { Button, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import AuthenticationService from "../services/AuthenticationService";
import { getVariables } from "../constants/Constants";

WebBrowser.maybeCompleteAuthSession();

export const LoginComponent: React.FC = () => {
    // Endpoint
    const discovery = {
        authorizationEndpoint: getVariables.itRexVars().authEndpoint,
        tokenEndpoint: getVariables.itRexVars().authTokenEndpoint,
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

    return (
        <View>
            <Button
                disabled={authResponse?.type === "success"}
                title="Login"
                onPress={() => {
                    promptAuthentication();
                }}
            />
        </View>
    );
};
