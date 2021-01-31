import { CreateCourseComponent } from "../src/components/CreateCourseComponent";
import "react-native";
import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { sendRequest } from "../src/api/sendRequest";
import { mocked } from "ts-jest/utils";

jest.mock("../src/api/createPostRequest", () => {
    return { createPostRequest: jest.fn() };
});

jest.mock("../src/api/sendRequest", () => {
    return { sendRequest: jest.fn() };
});

global.alert = jest.fn();

describe("test create course component", () => {
    it("see if stuff is rendered", () => {
        const { getByText } = render(<CreateCourseComponent></CreateCourseComponent>);

        expect(getByText("Enter Course name:")).toBeDefined();

        expect(getByText("Create new Course")).toBeDefined();
    });

    it("see if course name validation works", () => {
        const { getByText, getByTestId } = render(<CreateCourseComponent></CreateCourseComponent>);

        const sendRequestMock = mocked(sendRequest);

        fireEvent.press(getByText("Create new Course"));

        expect(sendRequestMock).not.toBeCalled();

        fireEvent.changeText(getByTestId("courseNameInput"), "Name for course");
        fireEvent.press(getByText("Create new Course"));

        expect(sendRequestMock).toBeCalled();
    });
});
