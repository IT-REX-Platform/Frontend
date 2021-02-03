import { HomeComponent } from "../../src/components/HomeComponent";
import "react-native";
import React from "react";
import { fireEvent, render } from "@testing-library/react-native";

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

        expect(getByText("Go to Login")).toBeDefined();

        expect(getByText("Go to Create Course")).toBeDefined();

        expect(getByText("Go to Upload Video")).toBeDefined();
    });

    xit("check Login navigation", () => {
        const { getByText } = render(<HomeComponent></HomeComponent>);

        expect(mockedNavigate).not.toBeCalled;

        fireEvent.press(getByText("Go to Login"));

        expect(mockedNavigate).toBeCalledWith("ROUTE_LOGIN");
    });

    xit("check Create Course navigation", () => {
        const { getByText } = render(<HomeComponent></HomeComponent>);

        expect(mockedNavigate).not.toBeCalled;

        fireEvent.press(getByText("Go to Create Course"));

        expect(mockedNavigate).toBeCalledWith("ROUTE_CREATE_COURSE");
    });

    xit("check Upload Video navigation", () => {
        const { getByText } = render(<HomeComponent></HomeComponent>);

        expect(mockedNavigate).not.toBeCalled;

        fireEvent.press(getByText("Go to Upload Video"));

        expect(mockedNavigate).toBeCalledWith("ROUTE_UPLOAD_VIDEO");
    });
});
