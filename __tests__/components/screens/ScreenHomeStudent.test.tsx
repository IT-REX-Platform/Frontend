import "react-native";
import React from "react";
import { itRexVars } from "../../../src/constants/Constants";
import { fireEvent, render } from "@testing-library/react-native";
import { ScreenCourses } from "../../../src/components/screens/ScreenCourses";
import { ScreenHomeAdmin } from "../../../src/components/screens/ScreenHomeAdmin";
import { ScreenHomeLecturer } from "../../../src/components/screens/ScreenHomeLecturer";
import { ScreenHomeStudent } from "../../../src/components/screens/ScreenHomeStudent";

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

describe("test HomeScreenStudent", () => {
    it("see if stuff is rendered", () => {
        const { getByText } = render(<ScreenHomeStudent></ScreenHomeStudent>);

        expect(getByText("hello student")).toBeDefined();
    });
});
