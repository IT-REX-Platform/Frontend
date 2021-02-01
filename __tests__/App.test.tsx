import "react-native";
import React from "react";
import { render } from "@testing-library/react-native";
import App from "../src/App";

jest.mock("react-native/Libraries/Animated/src/NativeAnimatedHelper");

const mockFunctionOutput = {
    apiUrl: "http://localhost:8080/",
    authEndpoint: "http://keycloak:9080/auth/realms/jhipster/protocol/openid-connect/auth",
    authTokenEndpoint: "http://keycloak:9080/auth/realms/jhipster/protocol/openid-connect/token",
    channel: "dev",
};

jest.mock("../src/constants/Constants", () => {
    return {
        itRexVars: jest.fn(() => {
            return mockFunctionOutput;
        }),
    };
});

it("this test should succeed", () => {
    expect(true).toBe(true);
});

it("renders correctly", () => {
    render(<App></App>);
});
