/* eslint-disable complexity */
import React, { useState } from "react";
import { Button, Platform, Text } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { isValidDate } from "../helperScripts/validateCourseDates";

interface DatePickerProps {
    title: string;
    date: Date | undefined;
    onDateChanged: (event: any, selectedDate?: Date) => void;
    minDate?: Date;
    maxDate?: Date;
}

// TODO: export
export function getDateIsoString(dateToTest: Date | undefined): string {
    if (isValidDate(dateToTest) && dateToTest) {
        return dateToTest.toISOString().substr(0, 10);
    }
    return "";
}

export const DatePickerComponent: React.FC<DatePickerProps> = (props) => {
    const { title, date, onDateChanged, minDate, maxDate } = props;

    function closeDatePicker(event: any, selectedDate?: Date): void {
        setShow(false);
        onDateChanged(event, selectedDate);
    }

    // Year-Month-Date format string of last selected value
    const yyyymmdd = getDateIsoString(date);

    const [show, setShow] = useState(false);

    const mobile: boolean = Platform.OS === ("android" || "ios");

    if (mobile) {
        return (
            <>
                <Button
                    title={title}
                    onPress={() => {
                        setShow(true);
                    }}
                />
                {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date ? date : new Date()}
                        mode="date"
                        display="default"
                        onChange={closeDatePicker}
                        minimumDate={minDate}
                        maximumDate={maxDate}
                    />
                )}
                {date && <Text>{date.toISOString()}</Text>}
            </>
        );
    }

    return (
        <>
            <Text>{title}</Text>
            <input
                type="date"
                onChange={onDateChanged}
                value={yyyymmdd ? yyyymmdd : "yyyy-mm-dd"}
                min={getDateIsoString(minDate)}
                max={getDateIsoString(maxDate)}></input>
            {/* {date && <Text>{date.toISOString()}</Text>} */}
        </>
    );
};
