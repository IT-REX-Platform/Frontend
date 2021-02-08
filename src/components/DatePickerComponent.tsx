import React, { ChangeEvent, useState } from "react";
import { Button, Platform, Text } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

interface DatePickerProps {
    title: string;
}

// eslint-disable-next-line complexity
export const DatePickerComponent: React.FC<DatePickerProps> = (props) => {
    const { title } = props;

    const [show, setShow] = useState(false);
    const [date, setDate] = useState(new Date());

    const dateChanged = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        console.log(currentDate);
        setDate(currentDate);
        setShow(false);
    };

    const webDateChanged = (event: ChangeEvent) => {
        const target: HTMLInputElement = event.target as HTMLInputElement;
        const currdate: Date = new Date(target.value);
        setDate(currdate);
        console.log(currdate.toISOString());
    };

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
                        value={date}
                        mode="date"
                        is24Hour={true}
                        display="default"
                        onChange={dateChanged}></DateTimePicker>
                )}
                <Text>{date.toISOString()}</Text>
            </>
        );
    }

    return (
        <>
            <Text>{title}</Text>
            <input type="date" onChange={webDateChanged} value={date.toISOString()}></input>
            <Text>{date.toISOString()}</Text>
        </>
    );
};
