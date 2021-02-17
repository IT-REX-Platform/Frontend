import "../../setupTests.ts";
import "react-native";
import React from "react";
import { itRexVars } from "../../src/constants/Constants";
import { fireEvent, render } from "@testing-library/react-native";
import { LoggedInNavigator } from "../../src/navigation/LoggedInNavigator";
import { TokenResponse, TokenResponseConfig } from "expo-auth-session";
import AuthenticationService from "../../src/services/AuthenticationService";

console.log = jest.fn();

jest.mock("../../src/constants/Constants", () => {
    const mockFunctionOutput = {
        apiUrl: "http://localhost:8080/",
        authEndpoint: "http://keycloak:9080/auth/realms/jhipster/protocol/openid-connect/auth",
        authTokenEndpoint: "http://keycloak:9080/auth/realms/jhipster/protocol/openid-connect/token",
        channel: "dev",
    };

    return {
        itRexVars: jest.fn(() => {
            return mockFunctionOutput;
        }),
    };
});

describe("test login component", () => {
    const mockedNavigate = jest.fn(() => {});
    jest.mock("@react-navigation/native", () => {
        return {
            useNavigation: jest.fn(() => {
                return {
                    navigate: mockedNavigate,
                };
            }),
        };
    });

    xit("See if Lecturer Home is rendered", () => {
        global.atob = jest.fn().mockReturnValueOnce("{name:'myCoolToken', roles: ['ITREX_LECTURER']}");
        JSON.parse = jest.fn().mockImplementationOnce(() => {
            return { name: "myCoolToken", roles: ["ITREX_LECTURER"] };
        });

        // btoa("{name:'myCoolToken', roles: ['ITREX_LECTURER']}")
        const myToken = "hallo." + "e25hbWU6J215Q29vbFRva2VuJywgcm9sZXM6IFsnSVRSRVhfTEVDVFVSRVInXX0=" + ".hallo";
        const tokenResponseConfig: TokenResponseConfig = {
            accessToken: myToken,
        };

        const tokenResponse: TokenResponse = new TokenResponse(tokenResponseConfig);
        const authService = AuthenticationService.getInstance();
        authService.setTokenResponse(tokenResponse);

        const { getByText } = render(<LoggedInNavigator></LoggedInNavigator>);

        expect(getByText("hello lecturer")).toBeDefined();
    });

    xit("See if Student Home is rendered", () => {
        global.atob = jest.fn().mockReturnValueOnce("{name:'myCoolToken', roles: ['ITREX_STUDENT']}");

        JSON.parse = jest.fn().mockImplementationOnce(() => {
            return { name: "myCoolToken", roles: ["ITREX_STUDENT"] };
        });

        // btoa("{name:'myCoolToken', roles: ['ITREX_STUDENT']}")
        const myToken = "hallo." + "e25hbWU6J215Q29vbFRva2VuJywgcm9sZXM6IFsnSVRSRVhfU1RVREVOVCddfQ==" + ".hallo";
        const tokenResponseConfig: TokenResponseConfig = {
            accessToken: myToken,
        };

        const tokenResponse: TokenResponse = new TokenResponse(tokenResponseConfig);
        const authService = AuthenticationService.getInstance();
        authService.setTokenResponse(tokenResponse);

        const { getByText } = render(<LoggedInNavigator></LoggedInNavigator>);

        expect(getByText("hello student")).toBeDefined();
    });

    xit("See if Admin Home is rendered", () => {
        global.atob = jest.fn().mockReturnValueOnce("{name:'myCoolToken', roles: ['ITREX_ADMIN']}");

        JSON.parse = jest.fn().mockImplementationOnce(() => {
            return { name: "myCoolToken", roles: ["ITREX_ADMIN"] };
        });

        // btoa("{name:'myCoolToken', roles: ['ITREX_ADMIN']}")
        const myToken = "hallo." + "e25hbWU6J215Q29vbFRva2VuJywgcm9sZXM6IFsnSVRSRVhfQURNSU4nXX0=" + ".hallo";
        const tokenResponseConfig: TokenResponseConfig = {
            accessToken: myToken,
        };

        const tokenResponse: TokenResponse = new TokenResponse(tokenResponseConfig);
        const authService = AuthenticationService.getInstance();
        authService.setTokenResponse(tokenResponse);

        const { getByText } = render(<LoggedInNavigator></LoggedInNavigator>);

        expect(getByText("hello admin")).toBeDefined();
    });
});
