import React, { useEffect } from "react";
import { useState } from "react";
import { Button, FlatList, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { ICourse } from "../types/ICourse";
import { LocalizationContext } from "../App";
import { validateCourseName } from "../helperScripts/validateCourseEntry";
import { validateCourseDescription } from "../helperScripts/validateCourseEntry";
import i18n from "../locales";
import { RequestFactory } from "../api/requests/RequestFactory";
import { EndpointsCourse } from "../api/endpoints/EndpointsCourse";
import { loggerFactory } from "../../logger/LoggerConfig";
import { CoursePublishState } from "../constants/CoursePublishState";
import { EndpointsCourseExtended } from "../api/endpoints/EndpointsCourseExtended";
import { DatePickerComponent } from "./DatePickerComponent";
import { validateCourseDates } from "../helperScripts/validateCourseDates";

const loggerService = loggerFactory.getLogger("service.CreateCourseComponent");
const endpointsCourse: EndpointsCourse = new EndpointsCourse();
const endpointsCourseExtended: EndpointsCourseExtended = new EndpointsCourseExtended();

export const CreateCourseComponent: React.FC = () => {
    React.useContext(LocalizationContext);

    // Enter course name to create course
    const [courseName, setCourseName] = useState("");

    // Enter course description to create course
    const [courseDescription, setCourseDescription] = useState("");

    // Display all courses
    const initialCourseState: ICourse[] = [];
    const [courses, setCourses] = useState(initialCourseState);

    // Enter course ID to publish course
    const [courseIdString, setCourseId] = useState("");

    // Display all published courses
    const initialPublishedCourseState: ICourse[] = [];
    const [coursesPublished, setCoursesPublished] = useState(initialPublishedCourseState);

    // Start- and Enddate for a published course
    const [lastChangedDate, setLastChangedDate] = useState<"startDate" | "endDate" | undefined>(undefined);
    const [startDate, setStartDate] = useState<Date | undefined>(new Date());
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);

    useEffect(() => {
        console.log(startDate);
        console.log(endDate);
        if (endDate && startDate) {
            if (!validateCourseDates(startDate, endDate)) {
                // Remove the Date because the combination is not ok
                removeLastDateEntry();
            }
        }
    }, [startDate, endDate]);

    function removeLastDateEntry(): void {
        if (lastChangedDate === "startDate") {
            setStartDate(undefined);
        } else {
            setEndDate(undefined);
        }
    }

    const startDateChanged = (event: any, selectedDate?: Date) => {
        setLastChangedDate("startDate");
        if (Platform.OS === ("android" || "ios")) {
            const currentDate = selectedDate || startDate;
            setStartDate(currentDate);
        } else {
            const target: HTMLInputElement = event.target as HTMLInputElement;
            const currdate: Date = new Date(target.value);
            setStartDate(currdate);
        }
    };

    const endDateChanged = (event: any, selectedDate?: Date) => {
        setLastChangedDate("endDate");
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
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.styledInputContainer}>
                    <Text>{i18n.t("itrex.enterCourseName")}</Text>
                    <TextInput
                        style={styles.styledTextInput}
                        onChangeText={(text: string) => setCourseName(text)}
                        testID="courseNameInput"></TextInput>
                </View>
                <View style={styles.styledInputContainer}>
                    <Text>{i18n.t("itrex.enterCourseDescription")}</Text>
                    <TextInput
                        style={styles.styledTextInput}
                        onChangeText={(text: string) => setCourseDescription(text)}
                        testID="courseDescriptionInput"></TextInput>
                </View>
                <Pressable style={styles.styledButton}>
                    <Button title={i18n.t("itrex.createCourse")} onPress={createCourse}></Button>
                </Pressable>
                <Pressable style={styles.styledButton}>
                    <Button title={i18n.t("itrex.getAllCourses")} onPress={getAllCourses}></Button>
                </Pressable>
                <FlatList
                    data={courses}
                    renderItem={({ item }) => (
                        <Text style={{}}>
                            {item.id +
                                "\t" +
                                item.publishState +
                                "\t" +
                                item.name +
                                "\t" +
                                (item.courseDescription ? item.courseDescription : "")}
                        </Text>
                    )}
                    keyExtractor={(item, index) => String(index)}
                />

                <View style={styles.separator}></View>

                <View style={styles.styledInputContainer}>
                    <Text>{i18n.t("itrex.enterCouseId")}</Text>
                    <TextInput
                        style={styles.styledTextInput}
                        keyboardType="numeric"
                        onChangeText={(id: string) => setCourseId(id)}
                        testID="courseIdInput"></TextInput>
                </View>
                <Pressable style={styles.styledButton}>
                    <Button title={i18n.t("itrex.publishCourse")} onPress={updateCourse}></Button>
                </Pressable>
                <Pressable style={styles.styledButton}>
                    <Button title={i18n.t("itrex.getPublishedCourses")} onPress={getPublishedCourses}></Button>
                </Pressable>
                <FlatList
                    data={coursesPublished}
                    renderItem={({ item }) => (
                        <Text style={{}}>{item.id + "\t" + item.publishState + "\t" + item.name}</Text>
                    )}
                    keyExtractor={(item, index) => String(index)}
                />
                <Pressable style={styles.styledButton}>
                    <Button title={i18n.t("itrex.deleteCourse")} onPress={deleteCourse}></Button>
                </Pressable>

                <View style={styles.styledInputContainer}>
                    <View>
                        <DatePickerComponent
                            title="startDate"
                            date={startDate}
                            onDateChanged={startDateChanged}></DatePickerComponent>
                    </View>
                    <View>
                        <DatePickerComponent
                            title="endDate"
                            date={endDate}
                            onDateChanged={endDateChanged}></DatePickerComponent>
                    </View>
                </View>
            </View>
        </ScrollView>
    );

    function createCourse(): void {
        loggerService.trace(`Validating course name: ${courseName}.`);

        if (validateCourseName(courseName) == false) {
            loggerService.warn("Course name invalid.");
            return;
        }

        if (validateCourseDescription(courseDescription) == false) {
            loggerService.warn("Course description invalid.");
        }

        const currentDate: Date = new Date();
        const course: ICourse = {
            name: courseName,
            startDate: currentDate,
            courseDescription: courseDescription ? courseDescription : undefined,
            publishState: CoursePublishState.UNPUBLISHED,
        };

        loggerService.trace(`Creating course: name=${courseName}, startDate=${currentDate}.`);
        const postRequest: RequestInit = RequestFactory.createPostRequest(course);
        endpointsCourse.createCourse(postRequest).then((data) => console.log(data));
    }

    function getAllCourses(): void {
        loggerService.trace("Getting all courses.");
        const request: RequestInit = RequestFactory.createGetRequest();
        endpointsCourse.getAllCourses(request).then((receivedCourses) => {
            setCourses(receivedCourses);
        });
    }

    function updateCourse(): void {
        loggerService.trace("Parsing ID string to ID number");
        const courseIdNumber: number = parseCourseId();

        // TODO: Validation: Check if start and Enddate are set

        // ATTENTION: fields without values will be overwritten with null in DB. @s.pastuchov 27.01.21
        const course: ICourse = {
            id: courseIdNumber,
            publishState: CoursePublishState.PUBLISHED,
        };

        loggerService.trace(`Updating course: name=${courseName}, publishedState=${CoursePublishState.PUBLISHED}.`);
        const putRequest: RequestInit = RequestFactory.createPutRequest(course);
        endpointsCourse.updateCourse(putRequest).then((data) => console.log(data));
    }

    function parseCourseId(): number {
        let courseIdNumber = 0;
        try {
            courseIdNumber = +courseIdString;
        } catch (error) {
            loggerService.error("An error occured while parsing course ID.", error);
        }
        return courseIdNumber;
    }

    function getPublishedCourses(): void {
        const request: RequestInit = RequestFactory.createGetRequest();
        endpointsCourseExtended
            .getFilteredCourses(request, { publishState: CoursePublishState.PUBLISHED })
            .then((receivedCoursesPublished) => {
                setCoursesPublished(receivedCoursesPublished);
            });
    }

    function deleteCourse(): void {
        const request: RequestInit = RequestFactory.createDeleteRequest();

        loggerService.trace("Parsing ID string to ID number");
        const courseIdNumber: number = parseCourseId();

        endpointsCourse.deleteCourse(request, courseIdNumber);
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    styledInputContainer: {
        margin: 5,
        flexDirection: "row",
        justifyContent: "center",
    },
    styledTextInput: {
        marginLeft: 8,
        borderColor: "lightgray",
        borderWidth: 2,
    },
    styledButton: {
        margin: 5,
    },
    separator: {
        width: "100%",
        backgroundColor: "#eeeeee",
        padding: 2,
        margin: 10,
    },
});
