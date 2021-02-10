import "react-native";
import React from "react";
import { itRexVars } from "../../../src/constants/Constants";
import { fireEvent, render } from "@testing-library/react-native";
import { ScreenCourses } from "../../../src/components/screens/ScreenCourses";

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

describe("test create course component", () => {
    it("see if stuff is rendered", () => {
        const { getByText } = render(<ScreenCourses></ScreenCourses>);

        expect(getByText("Enter Course name:")).toBeDefined();

        expect(getByText("Create New Course")).toBeDefined();

        expect(getByText("Get All Courses")).toBeDefined();
    });
});
