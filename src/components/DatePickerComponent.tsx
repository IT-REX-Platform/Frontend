/* eslint-disable complexity */
import React, { useState } from "react";
import { StyleSheet, Button, Platform, Text, View } from "react-native";
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
            <View style={styles.container}>
                <View style={{ flexDirection: "row", position: "absolute" }}>
                    <Text style={styles.styledText}>{title}</Text>
                </View>
                <input
                    style={{
                        fontSize: 18,
                        borderStyle: "hidden",
                        backgroundColor: "transparent",
                        lineHeight: 1.25,
                        paddingTop: 8,
                    }}
                    type="date"
                    onChange={onDateChanged}
                    value={yyyymmdd ? yyyymmdd : "yyyy-mm-dd"}
                    min={getDateIsoString(minDate)}
                    max={getDateIsoString(maxDate)}></input>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        borderStyle: "solid",
        borderColor: "black",
        borderWidth: 2,
        borderRadius: 4,
    },
    styledText: {
        fontSize: 12,
        marginTop: -8,
        marginLeft: 8,
        paddingLeft: 8,
        paddingRight: 8,
        backgroundColor: "white",
    },
});
