import { ExpoConfig, ConfigContext } from "@expo/config";

interface ITREX_VARIABLES {
    apiUrl: string;
    authEndpoint: string;
    authTokenEndpoint: string;
}

export default ({ config }): ExpoConfig => {
    let env_variables: { [id: string]: ITREX_VARIABLES } = {};

    env_variables = {
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

    const channel = process.env.ITREX_CHANNEL || "dev";

    return {
        ...config,
        extra: {
            channel: channel,
            variables: { ...env_variables[channel], channel: channel },
        },
    };
};
