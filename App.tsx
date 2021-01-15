import React, { useState } from "react";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest, exchangeCodeAsync, TokenResponse } from "expo-auth-session";
import { Button, View, Text } from "react-native";
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

    const [tokenResponse, setTokenResponse] = useState<TokenResponse>();

    const [, response, promptAsync] = useAuthRequest(
        {
            clientId: "web_app",
            scopes: ["jhipster"],
            // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
            // this must be set to false
            usePKCE: false,
            // For usage in managed apps using the proxy
            redirectUri: makeRedirectUri({
                // For usage in bare and standalone
                native: "it-rex://redirect",
                useProxy: false,
            }),
        },
        discovery
    );

    const createNewCourse = async () => {
        // http://localhost:8761/services/gateway/gateway:d486b567a8a18fb5fc5fcdfa31473135/api/account
        try {
            fetch("http://localhost:8080/api/account", {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: tokenResponse?.tokenType + " " + tokenResponse?.accessToken,
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
        if (response?.type === "success") {
            const { code } = response.params;
            console.log(code);
            console.log(response.params);

            // we have received our session_state and code, now we can request our token
            exchangeCodeAsync(
                {
                    clientId: "web_app",
                    redirectUri: makeRedirectUri({
                        // For usage in bare and standalone
                        native: "it-rex://redirect",
                    }),
                    code: response?.params.code,
                    extraParams: {
                        // You must use the extraParams variation of clientSecret.
                        // Never store your client secret on the client.
                        client_secret: "",
                    },
                },
                { tokenEndpoint: discovery.tokenEndpoint }
            ).then((tResponse) => {
                setTokenResponse(tResponse);
                //tokenResponse = tResponse;
            });
        }
    }, [response]);

    return (
        <View>
            <Button
                disabled={response?.type === "success"}
                title="Login"
                onPress={() => {
                    promptAsync();
                }}
            />
            <Text>Code: {response?.type === "success" && response?.params.code}</Text>
            <Text>Token: {tokenResponse?.accessToken}</Text>
            <Button
                disabled={tokenResponse == null}
                title="Create new Course"
                onPress={() => {
                    createNewCourse();
                }}></Button>
            <CreateCourseComponent></CreateCourseComponent>
            <TestComponent></TestComponent>
        </View>
    );
}
