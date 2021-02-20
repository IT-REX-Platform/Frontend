import { DatePickerComponent } from "../../src/components/DatePickerComponent";
import "react-native";
import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { getDateIsoString } from "../../src/helperScripts/validateCourseDates";
import { Platform } from "react-native";

describe("test DatePicker component", () => {
    it("see if stuff is rendered", () => {
        const { getByText } = render(
            <DatePickerComponent title="startDate" date={undefined} onDateChanged={() => {}}></DatePickerComponent>
        );

        expect(getByText("startDate")).toBeDefined();
    });
    it("see if title is correct on mobile", () => {
        Platform.OS = "android";

        const currDate = new Date();
        const currDateISO = getDateIsoString(currDate);

        const { getByText, getByDisplayValue, getByTestId, queryByText } = render(
            <DatePickerComponent title="startDate" date={currDate} onDateChanged={() => {}}></DatePickerComponent>
        );

        const datePickerButton = getByTestId("datePickerButtonMobile");
        fireEvent.press(datePickerButton);
    });
});
