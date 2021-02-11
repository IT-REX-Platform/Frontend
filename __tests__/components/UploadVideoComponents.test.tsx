import { UploadVideoComponent } from "../../src/components/UploadVideoComponent";
import "react-native";
import React from "react";
import { fireEvent, render, act } from "@testing-library/react-native";
import { sendRequest } from "../../src/api/endpoints/sendRequest";
import { getDocumentAsync } from "expo-document-picker";
import { mocked } from "ts-jest/utils";

jest.mock("../../src/api/endpoints/sendRequest", () => {
    return { sendRequest: jest.fn() };
});

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

jest.mock("expo-document-picker", () => {
    return {
        getDocumentAsync: jest.fn(() => {
            return new Promise((resolve, reject) => {
                console.log("called!!");
                resolve({
                    type: "success",
                    uri: "",
                    name: "test.mp4",
                    file: null,
                    lastModified: "",
                    size: 0,
                    output: null,
                });
            });
        }),
    };
});

describe("test upload video component", () => {
    it("see if stuff is rendered", async () => {
        const { getByText } = render(<UploadVideoComponent></UploadVideoComponent>);

        expect(getByText("Browse Files")).toBeDefined();
    });

    it("test document picker", async () => {
        const { getByText } = render(<UploadVideoComponent></UploadVideoComponent>);

        expect(getDocumentAsync).not.toBeCalled;

        await act(() => {
            fireEvent.press(getByText("Browse Files"));
        });

        expect(getDocumentAsync).toBeCalled;
    });

    it("test upload video", async () => {
        const { getByText, getByTestId } = render(<UploadVideoComponent></UploadVideoComponent>);

        const sendRequestMock = mocked(sendRequest);

        fireEvent.press(getByText("Upload Video"));

        expect(sendRequestMock).not.toBeCalled();

        expect(getByTestId("fileNameInput").props.value).toMatch("");

        await act(() => {
            fireEvent.press(getByText("Browse Files"));
        });

        expect(getByTestId("fileNameInput").props.value).toMatch("test.mp4");

        await act(() => {
            fireEvent.press(getByText("Upload Video"));
        });

        // komponenten des upload-vorgangs müssen hierfür noch korrekt gemockt werden
        // der document picker scheint so weit mehr oder weniger zu tun
        // expect(sendRequestMock).toBeCalled();
    });
});
