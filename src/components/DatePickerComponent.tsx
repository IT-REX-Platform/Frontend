/* eslint-disable complexity */
import React, { useState } from "react";
import { Button, Platform, Text } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

interface DatePickerProps {
    title: string;
    date: Date | undefined;
    onDateChanged: (event: any, selectedDate?: Date) => void;
}

export const DatePickerComponent: React.FC<DatePickerProps> = (props) => {
    const { title, date, onDateChanged } = props;

    function closeDatePicker(event: any, selectedDate?: Date): void {
        setShow(false);
        onDateChanged(event, selectedDate);
    }

    const lastPickedDate = date ? date : undefined;

    // Year-Month-Date format string of last selected value
    let yyyymmdd = "";
    if (lastPickedDate) {
        yyyymmdd = lastPickedDate?.toISOString().substr(0, 10);
    }

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
                        value={lastPickedDate ? lastPickedDate : new Date()}
                        mode="date"
                        display="default"
                        onChange={closeDatePicker}
                    />
                )}
                {date && <Text>{date.toISOString()}</Text>}
            </>
        );
    }

    return (
        <>
            <Text>{title}</Text>
            <input type="date" onChange={onDateChanged} value={yyyymmdd}></input>
            {date && <Text>{date.toISOString()}</Text>}
        </>
    );
};
