import React, { ChangeEvent, useState } from "react";
import { ImageBackground, Platform, StyleSheet, Text, TextInput, View } from "react-native";
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
import { TextButton } from "./uiElements/TextButton";
import { ToastService } from "../services/toasts/ToastService";

const loggerService = loggerFactory.getLogger("service.CreateCourseComponent");
const endpointsCourse: EndpointsCourse = new EndpointsCourse();

export const CreateCourseComponent: React.FC = () => {
    React.useContext(LocalizationContext);

    const toast: ToastService = new ToastService();

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
        <ImageBackground source={require("../constants/images/Background2.png")} style={styles.imageContainer}>
            <Header title={i18n.t("itrex.toCourse")} />

            <View style={styles.container}>
                <View style={{ marginTop: 70 }} />

                <Text style={styles.textStyle}>{i18n.t("itrex.enterCourseName")}</Text>

                <TextInput
                    style={[styles.nameInput, styles.separator]}
                    onChangeText={(text: string) => setCourseName(text)}
                    defaultValue={""} // TODO
                    testID="courseNameInput"
                />

                <Text style={styles.textStyle}>{i18n.t("itrex.enterCourseDescription")}</Text>

                <TextInput
                    style={[styles.descriptionInput, styles.separator]}
                    onChangeText={(text: string) => setCourseDescription(text)}
                    defaultValue={""} // TODO
                    multiline={true}
                    testID="courseDescriptionInput"
                />

                <View style={[styles.horizontalContainer, styles.separator]}>
                    {/* <View style={styles.horizontalContainer}> */}
                    <DatePickerComponent
                        title={i18n.t("itrex.startDate")}
                        date={startDate}
                        onDateChanged={startDateChanged}
                        maxDate={endDate}
                    />

                    <View style={{ margin: 20 }} />

                    <DatePickerComponent
                        title={i18n.t("itrex.endDate")}
                        date={endDate}
                        onDateChanged={endDateChanged}
                        minDate={startDate}
                    />
                </View>

                <TextButton title={i18n.t("itrex.createCourse")} onPress={_createCourse}></TextButton>
            </View>
        </ImageBackground>
    );

    // eslint-disable-next-line complexity
    function _createCourse(): void {
        loggerService.trace(`Validating course name: ${courseName}.`);

        if (validateCourseName(courseName) == false) {
            loggerService.warn("Course name invalid.");
            return;
        }

        if (validateCourseDescription(courseDescription) == false) {
            loggerService.warn("Course description invalid.");
            return;
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
        endpointsCourse.createCourse(postRequest).then((data) => {
            toast.success(i18n.t("itrex.courseCreated") + courseName);
            console.log(data);
            _resetStates();
        });
    }

    function _resetStates(): void {
        setCourseName("");
        setCourseDescription("");
        setStartDate(undefined);
        setEndDate(undefined);
    }
};

const styles = StyleSheet.create({
    imageContainer: {
        flex: 1,
        resizeMode: "stretch",
    },
    container: {
        alignItems: "center",
    },
    textStyle: {
        color: "white",
        fontSize: 18,
    },
    nameInput: {
        width: "50%",
        margin: 5,
        padding: 5,
        fontSize: 16,
        color: "white",
        borderColor: "white",
        borderWidth: 2,
        borderRadius: 2,
    },
    descriptionInput: {
        width: "50%",
        height: 150,
        margin: 5,
        padding: 5,
        fontSize: 16,
        color: "white",
        borderColor: "white",
        borderWidth: 2,
        borderRadius: 2,
    },
    styledTextInput: {
        color: "white",
        borderColor: "lightgray",
        borderWidth: 2,
        borderRadius: 5,
        height: 30,
        width: 200,
    },
    horizontalContainer: {
        flexDirection: "row",
    },
    separator: {
        marginBottom: 20,
    },
});
