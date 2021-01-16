import React, { useState } from "react";
import * as WebBrowser from "expo-web-browser";
// import { makeRedirectUri, useAuthRequest, exchangeCodeAsync, TokenResponse } from "expo-auth-session";
import * as AuthSession from "expo-auth-session";
import { Button, View, Linking } from "react-native";
import { CreateCourseComponent } from "./src/components/CreateCourseComponent";
import TestComponent from "./src/components/TestComponent";

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
    authorizationEndpoint: "http://keycloak:9080/auth/realms/jhipster/protocol/openid-connect/auth",
    tokenEndpoint: "http://keycloak:9080/auth/realms/jhipster/protocol/openid-connect/token",
};

export default function App(): JSX.Element {
    // const [tokenResponse] = useState();

    // let tokenResponse:TokenResponse;

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

    const requestUserInfo = async () => {
        // http://localhost:8080/services/courseservice/api/courses
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

    React.useEffect(() => {
        if (authResponse?.type === "success" && authResponse.authentication != null) {
            setTokenResponse(authResponse.authentication);
            console.log(authResponse);
        }
    }, [authResponse]);

    Linking.addEventListener("login", (url) => {
        console.log("URL" + url);
    });

    return (
        <View>
            <Button
                disabled={authResponse?.type === "success"}
                title="Login"
                onPress={() => {
                    promptAuthentication();
                }}
            />
            <Button
                disabled={authToken == null}
                title="Request User Info"
                onPress={() => {
                    requestUserInfo();
                }}></Button>
            <CreateCourseComponent></CreateCourseComponent>
            <TestComponent></TestComponent>
        </View>
    );
}
