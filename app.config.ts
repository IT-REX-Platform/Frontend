import { ExpoConfig } from "@expo/config";

interface Environment {
    apiUrl: string;
    authEndpoint: string;
    authTokenEndpoint: string;
}

export default (config: ExpoConfig): ExpoConfig => {
    const env_variables: { [id: string]: Environment } = {
        dev: {
            apiUrl: "http://localhost:8080/",
            authEndpoint: "http://keycloak:9080/auth/realms/jhipster/protocol/openid-connect/auth",
            authTokenEndpoint: "http://keycloak:9080/auth/realms/jhipster/protocol/openid-connect/token",
        },
        staging: {
            apiUrl: "http://129.69.217.173:8080/",
            authEndpoint: "http://129.69.217.173:9080/auth/realms/jhipster/protocol/openid-connect/auth",
            authTokenEndpoint: "http://129.69.217.173:9080/auth/realms/jhipster/protocol/openid-connect/token",
        },
        prod: {
            apiUrl: "prod",
            authEndpoint: "",
            authTokenEndpoint: "",
        },
    };

    const channel: string = process.env.ITREX_CHANNEL || "dev";

    return {
        ...config,
        extra: {
            channel: channel,
            ...env_variables[channel],
        },
    };
};
