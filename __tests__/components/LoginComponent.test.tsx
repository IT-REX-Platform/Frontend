import { LoginComponent } from "../../src/components/LoginComponent";
import "react-native";
import React from "react";
import { itRexVars } from "../../src/constants/Constants";
import { fireEvent, render } from "@testing-library/react-native";

const mockFunctionOutput = {
    apiUrl: "http://localhost:8080/",
    authEndpoint: "http://keycloak:9080/auth/realms/jhipster/protocol/openid-connect/auth",
    authTokenEndpoint: "http://keycloak:9080/auth/realms/jhipster/protocol/openid-connect/token",
    channel: "dev",
};

jest.mock("../../src/constants/Constants", () => {
    return {
        itRexVars: jest.fn(() => {
            return mockFunctionOutput;
        }),
    };
});

describe("test login component", () => {
    it("see if login button is rendered", () => {
        const { getByText } = render(<LoginComponent></LoginComponent>);

        expect(itRexVars).toHaveBeenCalled();

        expect(getByText("Login")).toBeDefined();
    });

    it("see if login button triggers authentication", () => {
        const { getByText } = render(<LoginComponent></LoginComponent>);

        fireEvent.press(getByText("Login"));
    });
});
