import React, { ChangeEvent, useState } from "react";
import { Button, ImageBackground, Platform, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { ICourse } from "../types/ICourse";
import { validateCourseName } from "../helperScripts/validateCourseEntry";
import { validateCourseDescription } from "../helperScripts/validateCourseEntry";
import i18n from "../locales";
import { RequestFactory } from "../api/requests/RequestFactory";
import { loggerFactory } from "../../logger/LoggerConfig";
import { CoursePublishState } from "../constants/CoursePublishState";
import { DatePickerComponent } from "./DatePickerComponent";
import { validateCourseDates } from "../helperScripts/validateCourseDates";
import { EndpointsCourse } from "../api/endpoints/EndpointsCourse";
import { Header } from "../constants/navigators/Header";
import { LocalizationContext } from "./Context";
import { Event } from "@react-native-community/datetimepicker";
import { dark } from "../constants/themes/dark";
import { TextButton } from "./UIElements/TextButton";

const loggerService = loggerFactory.getLogger("service.CreateCourseComponent");
const endpointsCourse: EndpointsCourse = new EndpointsCourse();

export const CreateCourseComponent: React.FC = () => {
    React.useContext(LocalizationContext);

    // Enter course name to create course
    const [courseName, setCourseName] = useState("");

    // Enter course description to create course
    const [courseDescription, setCourseDescription] = useState("");

    // Start- and Enddate for a published course
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);

    const startDateChanged = (event: ChangeEvent | Event, selectedDate?: Date) => {
        if (Platform.OS === ("android" || "ios")) {
            const currentDate = selectedDate || startDate;
            setStartDate(currentDate);
        } else {
            const target: HTMLInputElement = event.target as HTMLInputElement;
            const currdate: Date = new Date(target.value);
            setStartDate(currdate);
        }
    };

    const endDateChanged = (event: ChangeEvent | Event, selectedDate?: Date) => {
        if (Platform.OS === ("android" || "ios")) {
            const currentDate = selectedDate || endDate;
            setEndDate(currentDate);
        } else {
            const target: HTMLInputElement = event.target as HTMLInputElement;
            const currdate: Date = new Date(target.value);
            setEndDate(currdate);
        }
    };

    return (
        <ImageBackground source={require("../constants/images/Background2.png")} style={styles.image}>
            <ScrollView>
                <View style={styles.container}>
                    <Header title={i18n.t("itrex.toCourse")} />
                    <View style={styles.pageContainer} />
                    <View style={styles.styledInputContainer}>
                        <Text style={styles.textSytle}>{i18n.t("itrex.enterCourseName")}</Text>
                    </View>
                    <View style={styles.styledInputContainer}>
                        <TextInput
                            style={styles.styledTextInput}
                            onChangeText={(text: string) => setCourseName(text)}
                            testID="courseNameInput"></TextInput>
                    </View>
                    <View style={styles.styledInputContainer}>
                        <Text style={styles.textSytle}>{i18n.t("itrex.enterCourseDescription")}</Text>
                    </View>
                    <View style={styles.styledInputContainer}>
                        <TextInput
                            style={styles.styledTextInput}
                            onChangeText={(text: string) => setCourseDescription(text)}
                            testID="courseDescriptionInput"></TextInput>
                    </View>
                    <View style={[styles.styledInputContainer, styles.separator]}>
                        <DatePickerComponent
                            title={i18n.t("itrex.startDate")}
                            date={startDate}
                            onDateChanged={startDateChanged}
                            maxDate={endDate}></DatePickerComponent>

                        <View style={{ margin: 16 }}></View>

                        <DatePickerComponent
                            title={i18n.t("itrex.endDate")}
                            date={endDate}
                            onDateChanged={endDateChanged}
                            minDate={startDate}></DatePickerComponent>
                    </View>
                    <View style={styles.styledInputContainer}>
                        <View style={[{ width: "20%", margin: 5 }]}>
                            <TextButton
                                title={i18n.t("itrex.createCourse")}
                                size={"small"}
                                onPress={createCourse}></TextButton>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </ImageBackground>
    );

    // eslint-disable-next-line complexity
    function createCourse(): void {
        loggerService.trace(`Validating course name: ${courseName}.`);

        if (validateCourseName(courseName) == false) {
            loggerService.warn("Course name invalid.");
            return;
        }

        if (validateCourseDescription(courseDescription) == false) {
            loggerService.warn("Course description invalid.");
        }

        // Validate start/end Date
        // Check if start and Enddate are set
        if (!validateCourseDates(startDate, endDate)) {
            return;
        }

        const course: ICourse = {
            name: courseName,
            startDate: startDate,
            endDate: endDate,
            courseDescription: courseDescription ? courseDescription : undefined,
            publishState: CoursePublishState.UNPUBLISHED,
        };

        loggerService.trace(`Creating course: name=${courseName}.`);
        const postRequest: RequestInit = RequestFactory.createPostRequestWithBody(course);
        endpointsCourse.createCourse(postRequest).then((data) => console.log(data));
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
    },
    pageContainer: {
        marginTop: 70,
    },
    image: {
        flex: 1,
        resizeMode: "stretch",
        justifyContent: "center",
    },
    styledInputContainer: {
        margin: 5,
        flexDirection: "row",
        justifyContent: "center",
    },
    separator: {
        marginTop: 20,
    },
    styledTextInput: {
        color: "white",
        borderColor: "lightgray",
        borderWidth: 2,
        borderRadius: 5,
        height: 30,
        width: 200,
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
    textSytle: {
        color: "white",
        fontSize: 18,
    },
});
