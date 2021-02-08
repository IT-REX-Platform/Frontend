import React, { useState } from "react";
import { Button, Platform, Text } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

interface DatePickerProps {
    title: string;
    date: Date | undefined;
    onDateChanged: (event: any, selectedDate?: Date) => void;
}

// eslint-disable-next-line complexity
export const DatePickerComponent: React.FC<DatePickerProps> = (props) => {
    const { title, date, onDateChanged } = props;

    function closeDatePicker(event: any, selectedDate?: Date): void {
        setShow(false);
        onDateChanged(event, selectedDate);
    }

    const [show, setShow] = useState(false);

    if (Platform.OS === ("android" || "ios")) {
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
                        is24Hour={true}
                        display="default"
                        onChange={closeDatePicker}></DateTimePicker>
                )}
                {date && <Text>{date.toISOString()}</Text>}
            </>
        );
    }

    return (
        <>
            <Text>{title}</Text>
            {/* <input type="date" onChange={webDateChanged} value={date.toISOString()}></input> */}
            <input
                type="date"
                onChange={onDateChanged}
                value={date ? date.toISOString() : new Date().toISOString()}></input>
            {date && <Text>{date.toISOString()}</Text>}
        </>
    );
};
