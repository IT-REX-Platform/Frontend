import { ExpoConfig } from "@expo/config";

interface Environment {
    apiUrl: string;
    authEndpoint: string;
    authTokenEndpoint: string;
    authTokenRevoke: string;
    frontendUrl: string;
}

/**
 * Environment variables, based on the current release-channel
 */
export default (config: ExpoConfig): ExpoConfig => {
    const env_variables: { [id: string]: Environment } = {
        dev: {
            apiUrl: "http://localhost:8080/",
            authEndpoint: "http://keycloak:9080/auth/realms/jhipster/protocol/openid-connect/auth",
            authTokenEndpoint: "http://keycloak:9080/auth/realms/jhipster/protocol/openid-connect/token",
            authTokenRevoke: "http://keycloak:9080/auth/realms/jhipster/protocol/openid-connect/logout",
            frontendUrl: "http://localhost:19006/",
        },
        staging: {
            apiUrl: "http://129.69.217.173:8080/",
            authEndpoint: "http://129.69.217.173:9080/auth/realms/jhipster/protocol/openid-connect/auth",
            authTokenEndpoint: "http://129.69.217.173:9080/auth/realms/jhipster/protocol/openid-connect/token",
            authTokenRevoke: "http://129.69.217.173:9080/auth/realms/jhipster/protocol/openid-connect/logout",
            frontendUrl: "http://129.69.217.173:8085/",
        },
        prod: {
            apiUrl: "prod",
            authEndpoint: "",
            authTokenEndpoint: "",
            authTokenRevoke: "",
            frontendUrl: "",
        },
    };
    const general_variables = {
        authClientId: "web_app",
        authRedirectUrl: "it-rex://login",
    };

    const channel: string = process.env.ITREX_CHANNEL || "dev";

    return {
        ...config,
        extra: {
            channel: channel,
            ...general_variables,
            ...env_variables[channel],
        },
    };
};
