import React from "react";
import { useState } from "react";
import { Button, FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { ICourse } from "../types/ICourse";
import { validateCourseName } from "../helperScripts/validateCourseName";
import { RequestFactory } from "../api/RequestFactory";
import { EndpointsCourse } from "../api/EndpointsCourse";
import { loggerFactory } from "../../logger/LoggerConfig";
import { CoursePublishStates } from "../constants/CoursePublishStates";

const loggerService = loggerFactory.getLogger("service.CreateCourseComponent");

export const CreateCourseComponent: React.FC = () => {
    // Enter course name to create course
    const [courseName, setCourseName] = useState("");

    // Display all courses
    const initialCourseState: ICourse[] = [];
    const [courses, setCourses] = useState(initialCourseState);

    // Enter course name and course ID to publish course
    const [courseNameUpdated, setCourseNameUpdated] = useState("");
    const [courseIdString, setCourseId] = useState("");

    // Display all published courses
    const initialPublishedCourseState: ICourse[] = [];
    const [coursesPublished, setCoursesPublished] = useState(initialPublishedCourseState);

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.styledInputContainer}>
                    <Text>Enter Course name:</Text>
                    <TextInput
                        style={styles.styledTextInput}
                        onChangeText={(text: string) => setCourseName(text)}></TextInput>
                </View>
                <Pressable style={styles.styledButton}>
                    <Button title="Create New Course" onPress={createCourse}></Button>
                </Pressable>
                <Pressable style={styles.styledButton}>
                    <Button title="Get All Courses" onPress={getAllCourses}></Button>
                </Pressable>
                <FlatList
                    data={courses}
                    renderItem={({ item }) => <Text style={{}}>{item.id?.toString() + "\t" + item.name}</Text>}
                />

                <View style={styles.separator}></View>

                <View style={styles.styledInputContainer}>
                    <Text>Enter Course ID:</Text>
                    <TextInput
                        style={styles.styledTextInput}
                        keyboardType="numeric"
                        onChangeText={(id: string) => setCourseId(id)}></TextInput>
                </View>
                <View style={styles.styledInputContainer}>
                    <Text>Enter Course name:</Text>
                    <TextInput
                        style={styles.styledTextInput}
                        onChangeText={(text: string) => setCourseNameUpdated(text)}></TextInput>
                </View>
                <Pressable style={styles.styledButton}>
                    <Button title="Publish Course" onPress={updateCourse}></Button>
                </Pressable>
                <Pressable style={styles.styledButton}>
                    <Button title="Get Published Courses" onPress={getPublishedCourses}></Button>
                </Pressable>
                <FlatList
                    data={coursesPublished}
                    renderItem={({ item }) => <Text style={{}}>{item.id?.toString() + "\t" + item.name}</Text>}
                />
            </View>
        </ScrollView>
    );

    function createCourse(): void {
        if (validateCourseName(courseNameUpdated) === false) {
            loggerService.warn("Course name invalid");
            return;
        }

        loggerService.trace(`sending a request: ${courseName}`);
        const currentDate: Date = new Date();
        const course: ICourse = { name: courseName, startDate: currentDate };
        const postRequest: RequestInit = RequestFactory.createPostRequest(course);
        EndpointsCourse.createCourse(postRequest);
    }

    function getAllCourses(): void {
        const request: RequestInit = RequestFactory.createGetAllRequest();
        EndpointsCourse.getAllCourses(request).then((receivedCourses) => {
            setCourses(receivedCourses);
        });
    }

    function updateCourse(): void {
        if (validateCourseName(courseNameUpdated) === false) {
            loggerService.warn("Course name invalid");
            return;
        }

        let courseIdNumber = 0;
        try {
            courseIdNumber = +courseIdString;
        } catch (error) {
            loggerService.error("An error occured while parsing course ID.", error);
            return;
        }

        loggerService.trace(`sending a request: ${courseNameUpdated} ${courseIdNumber}`);
        // ATTENTION: fields without values will be overwritten with null in DB. @slawa 27.01.21
        const course: ICourse = { id: courseIdNumber, name: courseNameUpdated };
        // const course: ICourse = {
        //     id: courseIdNumber,
        //     name: courseNameUpdated,
        //     publishedState: CoursePublishedStates.STATE_PUBLISHED,
        // };
        const putRequest: RequestInit = RequestFactory.createPutRequest(course);
        EndpointsCourse.updateCourse(putRequest);
    }

    // TODO: get only published courses
    function getPublishedCourses(): void {
        const request: RequestInit = RequestFactory.createGetAllRequest();
        EndpointsCourse.getAllCourses(request).then((receivedCoursesPublished) => {
            setCoursesPublished(receivedCoursesPublished);

            for (const coursePublished of receivedCoursesPublished) {
                loggerService.trace(
                    coursePublished.id?.toString() +
                        " " +
                        coursePublished.name +
                        " " +
                        coursePublished.startDate?.toString()
                );
            }
        });
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
