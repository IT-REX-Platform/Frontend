import { UploadVideoComponent } from "../../src/components/UploadVideoComponent";
import "react-native";
import React from "react";
import { fireEvent, render } from "@testing-library/react-native";

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

const mockedDocument = jest.fn(() => {});
jest.mock("expo-document-picker", () => {
    return { getDocumentAsync: mockedDocument };
});

describe("test upload video component", () => {
    it("see if stuff is rendered", () => {
        const { getByText } = render(<UploadVideoComponent></UploadVideoComponent>);

        expect(getByText("Browse Files")).toBeDefined();
    });

    it("test document picker", () => {
        const { getByText } = render(<UploadVideoComponent></UploadVideoComponent>);

        expect(mockedDocument).not.toBeCalled;

        fireEvent.press(getByText("Browse Files"));

        expect(mockedDocument).toBeCalled;
    });

    it("test upload video", () => {
        const { getByText } = render(<UploadVideoComponent></UploadVideoComponent>);

        fireEvent.press(getByText("Upload Video"));
    });
});
