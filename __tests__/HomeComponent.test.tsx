import { HomeComponent } from "../src/components/HomeComponent";
import "react-native";
import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { mocked } from "ts-jest/utils";
import { useNavigation } from "@react-navigation/native";

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

describe("test home component", () => {
    const mockedUseNavigation = mocked(useNavigation, true);

    it("see if stuff is rendered", () => {
        const { getByText } = render(<HomeComponent></HomeComponent>);

        expect(getByText("Go to Login")).toBeDefined();

        expect(getByText("Go to Create Course")).toBeDefined();

        expect(getByText("Go to Upload Video")).toBeDefined();
    });

    it("check Login navigation", () => {
        const { getByText } = render(<HomeComponent></HomeComponent>);

        expect(mockedNavigate).not.toBeCalled;

        fireEvent.press(getByText("Go to Login"));

        expect(mockedNavigate).toBeCalledWith("Login");
    });

    it("check Create Course navigation", () => {
        const { getByText } = render(<HomeComponent></HomeComponent>);

        expect(mockedNavigate).not.toBeCalled;

        fireEvent.press(getByText("Go to Create Course"));

        expect(mockedNavigate).toBeCalledWith("CreateCourse");
    });

    it("check Upload Video navigation", () => {
        const { getByText } = render(<HomeComponent></HomeComponent>);

        expect(mockedNavigate).not.toBeCalled;

        fireEvent.press(getByText("Go to Upload Video"));

        expect(mockedNavigate).toBeCalledWith("UploadVideo");
    });
});
