import { HomeComponent } from "../../src/components/HomeComponent";
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

describe("test home component", () => {
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

    xit("see if stuff is rendered", () => {
        const { getByText } = render(<HomeComponent></HomeComponent>);

        expect(getByText("Login")).toBeDefined();

        expect(getByText("Create Course")).toBeDefined();

        expect(getByText("Upload Video")).toBeDefined();
    });

    xit("check Login navigation", () => {
        const { getByText } = render(<HomeComponent></HomeComponent>);

        expect(mockedNavigate).not.toBeCalled;

        fireEvent.press(getByText("Login"));

        expect(mockedNavigate).toBeCalledWith("ROUTE_LOGIN");
    });

    xit("check Create Course navigation", () => {
        const { getByText } = render(<HomeComponent></HomeComponent>);

        expect(mockedNavigate).not.toBeCalled;

        fireEvent.press(getByText("Create Course"));

        expect(mockedNavigate).toBeCalledWith("ROUTE_CREATE_COURSE");
    });

    xit("check Upload Video navigation", () => {
        const { getByText } = render(<HomeComponent></HomeComponent>);

        expect(mockedNavigate).not.toBeCalled;

        fireEvent.press(getByText("Upload Video"));

        expect(mockedNavigate).toBeCalledWith("ROUTE_UPLOAD_VIDEO");
    });
});
