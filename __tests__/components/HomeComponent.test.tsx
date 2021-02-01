import { HomeComponent } from "../../src/components/HomeComponent";
import "react-native";
import React from "react";
import { fireEvent, render } from "@testing-library/react-native";

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

        expect(mockedNavigate).toBeCalledWith("ROUTE_LOGIN");
    });

    it("check Create Course navigation", () => {
        const { getByText } = render(<HomeComponent></HomeComponent>);

        expect(mockedNavigate).not.toBeCalled;

        fireEvent.press(getByText("Go to Create Course"));

        expect(mockedNavigate).toBeCalledWith("ROUTE_CREATE_COURSE");
    });

    it("check Upload Video navigation", () => {
        const { getByText } = render(<HomeComponent></HomeComponent>);

        expect(mockedNavigate).not.toBeCalled;

        fireEvent.press(getByText("Go to Upload Video"));

        expect(mockedNavigate).toBeCalledWith("ROUTE_UPLOAD_VIDEO");
    });
});
