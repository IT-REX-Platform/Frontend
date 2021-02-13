import "react-native";
import React from "react";
import { itRexVars } from "../../../src/constants/Constants";
import { fireEvent, render } from "@testing-library/react-native";
import { ScreenCourses } from "../../../src/components/screens/ScreenCourses";
import { ScreenHomeAdmin } from "../../../src/components/screens/ScreenHomeAdmin";
import { ScreenHomeLecturer } from "../../../src/components/screens/ScreenHomeLecturer";

console.log = jest.fn();

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

describe("test HomeScreenLecturer", () => {
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
        const { getByText } = render(<ScreenHomeLecturer></ScreenHomeLecturer>);

        expect(getByText("Go to Upload Video")).toBeDefined();
    });
});
