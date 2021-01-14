import { exchangeCodeAsync, makeRedirectUri, useAuthRequest } from "expo-auth-session";
import React from "react";

export class AuthenticationService {
    // Endpoint-Configuration
    private discovery = {
        authorizationEndpoint: "http://keycloak:9080/auth/realms/jhipster/protocol/openid-connect/auth",
        tokenEndpoint: "http://keycloak:9080/auth/realms/jhipster/protocol/openid-connect/token",
    };

    private loggedIn: boolean = false;

    public async login() {
        let [request, response] = useAuthRequest(
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
            this.discovery
        );

        if (response?.type === "success") {
            console.log(response.params);
            this.retrieveToken(response);
        }
    }

    private async retrieveToken(response: any) {
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
            { tokenEndpoint: this.discovery.tokenEndpoint }
        ).then((tokenResponse) => {
            console.log(tokenResponse);
        });
    }

    /**
     * name
     */
    public isLoggedIn(): boolean {
        return this.loggedIn;
    }
}
