import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Switch, Text, View } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { ICourse } from "../../types/ICourse";
import { loggerFactory } from "../../../logger/LoggerConfig";
import { EndpointsCourseExtended } from "../../api/endpoints/EndpointsCourseExtended";
import { RequestFactory } from "../../api/requests/RequestFactory";
import { useNavigation } from "@react-navigation/native";
import { NavigationRoutes } from "./NavigationRoutes";

export const DrawerContent: React.FC = (props) => {
    const { navigation } = props;

    // Display all courses
    const initialCourseState: ICourse[] = [];
    const [courses, setCourses] = useState(initialCourseState);

    const loggerService = loggerFactory.getLogger("service.CreateCourseComponent");
    const endpointsCourseExtended: EndpointsCourseExtended = new EndpointsCourseExtended();

    const drawerItems = [];

    const [isDarkTheme, setIsDarkTheme] = React.useState(false);
    const toggleIsDarkTheme = () => setIsDarkTheme((previousState) => !previousState);

    function getAllCourses(): void {
        loggerService.trace("Getting all courses.");
        const request: RequestInit = RequestFactory.createGetRequest();
        endpointsCourseExtended.getFilteredCourses(request).then((receivedCourses) => {
            setCourses(receivedCourses);
        });
    }

    for (const course of courses) {
        drawerItems.push(
            <DrawerItem
                icon={() => (
                    <MaterialCommunityIcons name="notebook-outline" size={28} color="#011B45" style={styles.icon} />
                )}
                label={"" + course.name}
                key={course.id}
                onPress={() => {
                    navigation.navigate(NavigationRoutes.ROUTE_COURSE_DETAILS, {
                        courseId: course.id,
                    });
                }}></DrawerItem>
        );
    }

    useEffect(() => {
        getAllCourses();
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image source={require("../images/ITRex-Logo-ob_750x750.png")} style={[styles.icon]}></Image>
                <Text>IT-REX</Text>
            </View>
            <DrawerItem
                icon={() => <MaterialCommunityIcons name="home" size={28} color="#011B45" style={styles.icon} />}
                label="Home"
                onPress={() => {
                    navigation.navigate(NavigationRoutes.ROUTE_HOME);
                }}></DrawerItem>
            <DrawerContentScrollView {...props}>
                {drawerItems}
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingVertical: 12,
                        paddingHorizontal: 16,
                    }}>
                    <Text>Dark Theme</Text>
                    <Switch value={isDarkTheme} onValueChange={toggleIsDarkTheme}></Switch>
                </View>
            </DrawerContentScrollView>
            <DrawerItem label="Sign Out" onPress={() => {}}></DrawerItem>
        </View>
    );
};

const styles = StyleSheet.create({
    icon: {
        width: 36,
        height: 36,
    },
});
