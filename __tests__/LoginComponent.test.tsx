import { LoginComponent } from "../src/components/LoginComponent";
import "react-native";
import React from "react";
import "../app.config";
import { Constants } from "expo";
import { getVariables } from "../src/constants/Constants";
import { render } from "@testing-library/react-native";

// jest.mock("expo", () => ({
//     Constants: {
//         manifest: {
//             version: "0.0.1",
//             releaseChannel: "dev",
//             extra: {
//                 apiUrl: "http://localhost:8080/",
//                 authEndpoint: "http://keycloak:9080/auth/realms/jhipster/protocol/openid-connect/auth",
//                 authTokenEndpoint: "http://keycloak:9080/auth/realms/jhipster/protocol/openid-connect/token",
//                 channel: "dev",
//             },
//         },
//     },
// }));

// beforeAll(() => {
//     Constants.manifest.extra.apiUrl = "http://localhost:8080/";
//     Constants.manifest.extra.authEndpoint = "http://keycloak:9080/auth/realms/jhipster/protocol/openid-connect/auth";
//     Constants.manifest.extra.authTokenEndpoint =
//         "http://keycloak:9080/auth/realms/jhipster/protocol/openid-connect/token";
//     Constants.manifest.extra.channel = "dev";

//     return Constants;
// });

describe("test login component", () => {
    it("see if login button works", () => {
        const mockFunctionOutput = {
            apiUrl: "http://localhost:8080/",
            authEndpoint: "http://keycloak:9080/auth/realms/jhipster/protocol/openid-connect/auth",
            authTokenEndpoint: "http://keycloak:9080/auth/realms/jhipster/protocol/openid-connect/token",
            channel: "dev",
        };

        getVariables.itRexVars = jest.fn().mockReturnValue(mockFunctionOutput);

        const { getByText } = render(<LoginComponent></LoginComponent>);

        expect(getVariables.itRexVars).toHaveBeenCalled();

        expect(getByText("Login")).toBeDefined();
    });
});
