import React, { useState } from "react";
import { Button, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import AuthenticationService from "../services/AuthenticationService";
import i18n from "../locales/index";

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

    const requestUserInfo = async () => {
        console.log("Test");
        try {
            fetch("http://localhost:8080/api/account", {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: authToken?.tokenType + " " + authToken?.accessToken,
                } /*
                body:JSON.stringify({
                    "endDate": "2021-01-11",
                    "maxFoodSum": 0,
                    "name": "Theo3",
                    "startDate": "2021-01-11",
                    "courseDescription": "Was für ein mega geiler Kurs..."
                })*/,
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson);
                });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View>
            <Button
                disabled={authResponse?.type === "success"}
                title={i18n.t("itrex.login")}
                onPress={() => {
                    promptAuthentication();
                }}
            />
        </View>
    );
};
