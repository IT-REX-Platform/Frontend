import "react-native";
import React from "react";
import { itRexVars } from "../../../src/constants/Constants";
import { fireEvent, render } from "@testing-library/react-native";
import { ScreenCourses } from "../../../src/components/screens/ScreenCourses";
import { ScreenHomeAdmin } from "../../../src/components/screens/ScreenHomeAdmin";

console.log = jest.fn();

describe("test ScreenHomeAdmin", () => {
    it("see if stuff is rendered", () => {
        const { getByText } = render(<ScreenHomeAdmin></ScreenHomeAdmin>);

        expect(getByText("Admin Home")).toBeDefined();
    });
});
