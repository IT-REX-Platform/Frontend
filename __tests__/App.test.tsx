import "react-native";
import React from "react";
import { render } from "@testing-library/react-native";
import App from "../src/App";

jest.mock("react-native/Libraries/Animated/src/NativeAnimatedHelper");

it("this test should succeed", () => {
    expect(true).toBe(true);
});

it("renders correctly", () => {
    render(<App></App>);
});
