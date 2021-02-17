/* eslint-disable complexity */
import React, { useState } from "react";
import { Button, Platform, Text } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getDateIsoString } from "../helperScripts/validateCourseDates";

interface DatePickerProps {
    title: string;
    date: Date | undefined;
    onDateChanged: (event: any, selectedDate?: Date) => void;
    minDate?: Date;
    maxDate?: Date;
}

export const DatePickerComponent: React.FC<DatePickerProps> = (props) => {
    const { title, date, onDateChanged, minDate, maxDate } = props;

    function closeDatePicker(event: any, selectedDate?: Date): void {
        setShow(false);
        onDateChanged(event, selectedDate);
    }

    // Year-Month-Date format string of last selected value
    const yyyymmdd = getDateIsoString(date);

    const displayTitle: string = yyyymmdd.length > 0 ? title + ": " + yyyymmdd : title;

    const [show, setShow] = useState(false);

    const mobile: boolean = Platform.OS === ("android" || "ios");

    if (mobile) {
        return (
            <>
                {console.log("yeeeeeeeeet")}
                {console.log(displayTitle)}
                <Button
                    testID="datePickerButtonMobile"
                    title={displayTitle}
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
