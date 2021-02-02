import React, { useState } from "react";
import { Button, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import AuthenticationService from "../services/AuthenticationService";
import { itRexVars } from "../constants/Constants";
import { LocalizationContext } from "../App";
WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
    authorizationEndpoint: "http://keycloak:9080/auth/realms/jhipster/protocol/openid-connect/auth",
    tokenEndpoint: "http://keycloak:9080/auth/realms/jhipster/protocol/openid-connect/token",
};

export const LoginComponent: React.FC = () => {
    // const authenticationService: AuthenticationService = useContext(AuthenticationContext);

    const [authToken, setTokenResponse] = useState<AuthSession.TokenResponse>();

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
            setTokenResponse(authResponse.authentication);
            // authenticationService.setTokenResponse(authResponse.authentication);
            AuthenticationService.getInstance().setTokenResponse(authResponse.authentication);
        }
    }, [authResponse]);

    const { t } = React.useContext(LocalizationContext);

    return (
        <View>
            <Button
                disabled={authResponse?.type === "success"}
                title={t("itrex.login")}
                onPress={() => {
                    promptAuthentication();
                }}
            />
        </View>
    );
};
