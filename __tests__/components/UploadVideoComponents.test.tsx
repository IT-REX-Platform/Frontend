import "../../setupTests.ts";
import { UploadVideoComponent } from "../../src/components/UploadVideoComponent";
import "react-native";
import React from "react";
import { fireEvent, render, act, waitFor } from "@testing-library/react-native";
import { sendRequest } from "../../src/api/endpoints/sendRequest";
import { getDocumentAsync } from "expo-document-picker";
import { launchImageLibraryAsync } from "expo-image-picker";
import { mocked } from "ts-jest/utils";
import i18n from "../../src/locales";
import { Platform } from "react-native";

/*
const headers = { key: "val" };

const clone = () => {
    return response;
};

const blob = () => {
    return null;
};

const response = {
    headers: headers,
    json: null,
    text: null,
    status: 200,
    arrayBuffer: null,
    ok: true,
    statusText: "",
    redirected: false,
    trailer: Promise.resolve(headers),
    url: "",
    body: null,
    bodyUsed: null,
    blob: blob,
    formData: null,
    clone: clone,
    type: "default",
};

global.fetch = jest.fn(() =>
    Promise.resolve({
        headers: headers,
        json: null,
        text: null,
        status: 200,
        arrayBuffer: null,
        ok: true,
        statusText: "",
        redirected: false,
        trailer: Promise.resolve(headers),
        url: "",
        body: null,
        bodyUsed: null,
        blob: blob,
        formData: null,
        clone: clone,
        type: "default",
    })
);

function FormDataMock() {
    this.append = jest.fn();
}
global.FormData = FormDataMock;
*/

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
                resolve({
                    type: "success",
                    uri: "http://localhost:8080/",
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

jest.mock("expo-image-picker", () => {
    return {
        launchImageLibraryAsync: jest.fn(() => {
            return new Promise((resolve, reject) => {
                resolve({
                    cancelled: false,
                    type: "video",
                    uri: "quatsch",
                    width: 100,
                    height: 100,
                    exif: null,
                    base64: null,
                });
            });
        }),
    };
});

describe("test upload video component", () => {
    it("see if stuff is rendered", async () => {
        const { getByText, toJSON } = render(<UploadVideoComponent></UploadVideoComponent>);

        expect(await waitFor(() => getByText(i18n.t("itrex.browseVideos")))).toBeDefined();
        expect(await waitFor(() => getByText(i18n.t("itrex.toUploadVideo")))).toBeDefined();
        expect(await waitFor(() => getByText(i18n.t("itrex.uploadVideoHere")))).toBeDefined();

        expect(toJSON()).toMatchSnapshot();
    });

    xit("test document picker", async () => {
        Platform.OS = "android";
        const { getByTestId, getByText } = render(<UploadVideoComponent></UploadVideoComponent>);

        expect(getDocumentAsync).not.toBeCalled;
        expect(launchImageLibraryAsync).not.toBeCalled;
        expect(getByTestId("videoNameInput").props.value).toBeDefined();

        await act(async () => {
            fireEvent.press(getByText(i18n.t("itrex.browseVideos")));
        });

        expect(getDocumentAsync).toBeCalled;
        expect(launchImageLibraryAsync).not.toBeCalled;
        expect(getByTestId("videoNameInput").props.value).toMatch("test.mp4");
    });

    xit("test document picker to be cancelled", async () => {
        const { getByText, getByTestId } = render(<UploadVideoComponent></UploadVideoComponent>);

        if (Platform.OS !== "ios") {
            jest.mock("expo-document-picker", () => {
                return {
                    getDocumentAsync: jest.fn(() => {
                        return new Promise((resolve, reject) => {
                            resolve({
                                type: "cancel",
                                uri: "http://localhost:8080/",
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

            expect(getDocumentAsync).not.toBeCalled;
            expect(launchImageLibraryAsync).not.toBeCalled;
            expect(getByTestId("videoNameInput").props.value).toMatch("");

            await act(async () => {
                fireEvent.press(getByText(i18n.t("itrex.browseVideos")));
            });

            expect(getDocumentAsync).toBeCalled;
            expect(launchImageLibraryAsync).not.toBeCalled;
            expect(getByTestId("videoNameInput").props.value).toMatch("");
        }
    });

    xit("test upload video", async () => {
        require("node-fetch");
        const { getByText, getByTestId } = render(<UploadVideoComponent></UploadVideoComponent>);

        if (Platform.OS !== "ios") {
            const sendRequestMock = mocked(sendRequest);

            fireEvent.press(getByText(i18n.t("itrex.toUploadVideo")));

            expect(sendRequestMock).not.toBeCalled();

            expect(getByTestId("videoNameInput").props.value).toMatch("");

            await act(async () => {
                fireEvent.press(getByText(i18n.t("itrex.browseVideos")));
            });

            expect(getByTestId("videoNameInput").props.value).toMatch("test.mp4");

            /*
            await act(async () => {
                await fireEvent.press(getByText("Upload Video"));
            });
    
            // komponenten des upload-vorgangs müssen hierfür noch korrekt gemockt werden
            // der document picker scheint so weit mehr oder weniger zu tun
    
            expect(sendRequestMock).toBeCalled();
            */
        }
    });
});
