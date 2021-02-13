import "react-native";
import React from "react";
import { itRexVars } from "../../../src/constants/Constants";
import { fireEvent, render } from "@testing-library/react-native";
import { ScreenCourses } from "../../../src/components/screens/ScreenCourses";
import { ScreenHomeAdmin } from "../../../src/components/screens/ScreenHomeAdmin";
import { ScreenHomeLecturer } from "../../../src/components/screens/ScreenHomeLecturer";
import { ScreenHomeStudent } from "../../../src/components/screens/ScreenHomeStudent";

console.log = jest.fn();

describe("test HomeScreenStudent", () => {
    it("see if stuff is rendered", () => {
        const { getByText } = render(<ScreenHomeStudent></ScreenHomeStudent>);

        expect(getByText("Student Home")).toBeDefined();
    });
});
