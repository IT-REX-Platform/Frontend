import { UploadVideoComponent } from "../../src/components/UploadVideoComponent";
import "react-native";
import React from "react";
import { render } from "@testing-library/react-native";

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

describe("test upload video component", () => {
    it("see if stuff is rendered", () => {
        const { getByText } = render(<UploadVideoComponent></UploadVideoComponent>);

        expect(getByText("Browse Files")).toBeDefined();
    });
});
