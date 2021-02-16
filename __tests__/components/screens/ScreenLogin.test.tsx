import "../../../setupTests.ts";
import "../../utils/crypto.mock";
import { ScreenLogin } from "../../../src/components/screens/ScreenLogin";
import "react-native";
import React from "react";
import { itRexVars } from "../../../src/constants/Constants";
import { fireEvent, render, act } from "@testing-library/react-native";

jest.mock("../../../src/constants/Constants", () => {
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
    it("see if login button is rendered", () => {
        const { getByText } = render(<ScreenLogin></ScreenLogin>);

        expect(itRexVars).toHaveBeenCalled();

        expect(getByText("Login")).toBeDefined();
    });

    xit("see if login button triggers authentication", () => {
        const { getByText } = render(<ScreenLogin></ScreenLogin>);

        act(() => {
            fireEvent.press(getByText("Login"));
        });
    });
});
