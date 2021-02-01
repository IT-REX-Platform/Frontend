import { UploadVideoComponent } from "../../src/components/UploadVideoComponent";
import "react-native";
import React from "react";
import { render } from "@testing-library/react-native";

describe("test upload video component", () => {
    it("see if stuff is rendered", () => {
        const { getByText } = render(<UploadVideoComponent></UploadVideoComponent>);

        expect(getByText("Browse Files")).toBeDefined();
    });
});
