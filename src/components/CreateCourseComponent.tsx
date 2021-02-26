import React, { ChangeEvent } from "react";
import { useState } from "react";
import {
    Button,
    FlatList,
    ImageBackground,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
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
import { useNavigation } from "@react-navigation/native";
import { NavigationRoutes } from "../constants/navigators/NavigationRoutes";
import { Header } from "../constants/navigators/Header";
import { LocalizationContext } from "./Context";
import { Event } from "@react-native-community/datetimepicker";

const loggerService = loggerFactory.getLogger("service.CreateCourseComponent");
const endpointsCourse: EndpointsCourse = new EndpointsCourse();

export const CreateCourseComponent: React.FC = () => {
    React.useContext(LocalizationContext);
    const navigation = useNavigation();

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
                        <TextInput
                            style={styles.styledTextInput}
                            onChangeText={(text: string) => setCourseName(text)}
                            testID="courseNameInput"></TextInput>
                    </View>
                    <View style={styles.styledInputContainer}>
                        <Text style={styles.textSytle}>{i18n.t("itrex.enterCourseDescription")}</Text>
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
                        renderItem={({ item }: { item: ICourse }) => (
                            <>
                                <TouchableOpacity key={item.id} onPress={() => onPress(item)}>
                                    <View style={{ backgroundColor: "white" }}>
                                        <Text style={styles.item}>
                                            {item.id +
                                                "\t" +
                                                item.publishState +
                                                "\t" +
                                                item.name +
                                                "\t" +
                                                (item.courseDescription ? item.courseDescription : "")}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </>
                        )}
                        keyExtractor={(item, index) => String(index)}
                    />
                    <View style={styles.styledInputContainer}>
                        <Text style={styles.textSytle}>{i18n.t("itrex.enterCouseId")}</Text>
                        <TextInput
                            style={styles.styledTextInput}
                            keyboardType="numeric"
                            onChangeText={(id: string) => setCourseId(id)}
                            testID="courseIdInput"></TextInput>
                    </View>
                    <Pressable style={styles.styledButton}>
                        <Button title={i18n.t("itrex.publishCourse")} onPress={patchCourse}></Button>
                    </Pressable>
                    <Pressable style={styles.styledButton}>
                        <Button title={i18n.t("itrex.getPublishedCourses")} onPress={getPublishedCourses}></Button>
                    </Pressable>
                    <FlatList
                        data={coursesPublished}
                        renderItem={({ item }: { item: ICourse }) => (
                            <Text style={{}}>{item.id + "\t" + item.publishState + "\t" + item.name}</Text>
                        )}
                        keyExtractor={(item, index) => String(index)}
                    />
                    <Pressable style={styles.styledButton}>
                        <Button title={i18n.t("itrex.deleteCourse")} onPress={deleteCourse}></Button>
                    </Pressable>

                    <View style={styles.styledInputContainer}>
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
                </View>
            </ScrollView>
        </ImageBackground>
    );

    function onPress(item: ICourse) {
        navigation.navigate(NavigationRoutes.ROUTE_COURSE_DETAILS, { item: item, name: item.name });
    }

    function createCourse(): void {
        loggerService.trace(`Validating course name: ${courseName}.`);

        if (validateCourseName(courseName) == false) {
            loggerService.warn("Course name invalid.");
            return;
        }

        if (validateCourseDescription(courseDescription) == false) {
            loggerService.warn("Course description invalid.");
        }

        const course: ICourse = {
            name: courseName,
            startDate: startDate,
            courseDescription: courseDescription ? courseDescription : undefined,
            publishState: CoursePublishState.UNPUBLISHED,
        };

        loggerService.trace(`Creating course: name=${courseName}.`);
        const postRequest: RequestInit = RequestFactory.createPostRequest(course);
        endpointsCourse.createCourse(postRequest).then((data) => console.log(data));
    }

    async function getAllCourses(): Promise<void> {
        loggerService.trace("Getting all courses.");
        const request: RequestInit = RequestFactory.createGetRequest();

        const test: ICourse[] = await endpointsCourse.getAllCourses(request);
        setCourses(test);
    }

    function patchCourse(): void {
        loggerService.trace("Parsing ID string to ID number");
        let course: ICourse;

        if (startDate == undefined) {
            return;
        }
        // Check if start and Enddate are set
        if (!validateCourseDates(startDate, endDate)) {
            return;
        }

        //TODO: if startdate > current date -> Course is not publishd yet
        // ATTENTION: fields without values will be overwritten with null in DB. @s.pastuchov 27.01.21
        const currdate = new Date();

        if (startDate > currdate) {
            course = {
                id: courseIdString,
                publishState: CoursePublishState.UNPUBLISHED,
                startDate: startDate,
                endDate: endDate,
            };
        } else {
            course = {
                id: courseIdString,
                publishState: CoursePublishState.PUBLISHED,
                startDate: startDate,
                endDate: endDate,
            };
        }

        console.log(course);
        loggerService.trace(`Updating course: name=${courseName}, publishedState=${CoursePublishState.PUBLISHED}.`);
        const putRequest: RequestInit = RequestFactory.createPatchRequest(course);
        endpointsCourse.patchCourse(putRequest).then((data) => console.log(data));
    }

    function getPublishedCourses(): void {
        const request: RequestInit = RequestFactory.createGetRequest();
        endpointsCourse
            .getAllCourses(request, { publishState: CoursePublishState.PUBLISHED })
            .then((receivedCoursesPublished) => {
                setCoursesPublished(receivedCoursesPublished);
            });
    }

    function deleteCourse(): void {
        const request: RequestInit = RequestFactory.createDeleteRequest();
        endpointsCourse.deleteCourse(request, courseIdString);
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
    styledTextInput: {
        marginLeft: 8,
        borderColor: "lightgray",
        borderWidth: 2,
    },
    styledButton: {
        margin: 5,
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
    textSytle: {
        color: "white",
    },
});
