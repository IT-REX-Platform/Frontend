import { CreateCourseComponent } from "../../src/components/CreateCourseComponent";
import "react-native";
import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { sendRequest } from "../../src/api/endpoints/sendRequest";
import { mocked } from "ts-jest/utils";

// Disable logs in CreateCourseComponent.ts.
console.log = jest.fn();

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

global.alert = jest.fn();

describe("test create course component", () => {
    it("see if stuff is rendered", () => {
        const { getByText } = render(<CreateCourseComponent></CreateCourseComponent>);

        expect(getByText("Enter Course name:")).toBeDefined();

        expect(getByText("Create New Course")).toBeDefined();

        expect(getByText("Get All Courses")).toBeDefined();
    });

    // Enable if fixed.
    xit("see if course name validation works", () => {
        const { getByText, getByTestId } = render(<CreateCourseComponent></CreateCourseComponent>);

        const sendRequestMock = mocked(sendRequest);

        fireEvent.press(getByText("Create New Course"));

        expect(sendRequestMock).not.toBeCalled();

        fireEvent.changeText(getByTestId("courseNameInput"), "Name for course");
        fireEvent.press(getByText("Create New Course"));

        expect(sendRequestMock).toBeCalled();
    });
});
