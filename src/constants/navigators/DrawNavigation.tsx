import React, { useEffect, useState } from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";
import { Image, StyleSheet, useWindowDimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { HomeComponent } from "../../components/HomeComponent";
import { NavigationRoutes } from "./NavigationRoutes";
import i18n from "../../locales";
import { loggerFactory } from "../../../logger/LoggerConfig";
import { RequestFactory } from "../../api/requests/RequestFactory";
import { EndpointsCourseExtended } from "../../api/endpoints/EndpointsCourseExtended";
import { ICourse } from "../../types/ICourse";
import { CourseDetailsComponent } from "../../components/CourseDetailsComponent";
import { CreateCourseComponent } from "../../components/CreateCourseComponent";
import { UploadVideoComponent } from "../../components/UploadVideoComponent";

const Drawer = createDrawerNavigator();

export const DrawerNavigator: React.FC = () => {
    const dimensions = useWindowDimensions();

    // Display all courses
    const initialCourseState: ICourse[] = [];
    const [courses, setCourses] = useState(initialCourseState);

    const loggerService = loggerFactory.getLogger("service.CreateCourseComponent");
    const endpointsCourseExtended: EndpointsCourseExtended = new EndpointsCourseExtended();

    const items = [];

    function getAllCourses(): void {
        loggerService.trace("Getting all courses.");
        const request: RequestInit = RequestFactory.createGetRequest();
        endpointsCourseExtended.getFilteredCourses(request).then((receivedCourses) => {
            setCourses(receivedCourses);
        });
    }

    useEffect(() => {
        getAllCourses();
    }, []);

    for (const course of courses) {
        items.push(
            <Drawer.Screen
                name={course.id?.toString()}
                component={CourseDetailsComponent}
                options={{
                    title: course.id?.toString(),
                    drawerIcon: () => (
                        <MaterialCommunityIcons name="notebook-outline" size={28} color="#011B45" style={styles.icon} />
                    ),
                }}
            />
        );
    }

    console.log("" + dimensions);

    return (
        <Drawer.Navigator
            drawerType={dimensions.width >= 1400 ? "permanent" : "front"}
            drawerStyle={{ backgroundColor: "lightgrey" }}>
            <Drawer.Screen
                name={NavigationRoutes.ROUTE_HOME}
                component={HomeComponent}
                options={{
                    title: i18n.t("itrex.home"),
                    drawerIcon: () => (
                        <Image source={require("../images/ITRex-Logo-ob.svg")} style={[styles.icon]}></Image>
                    ),
                }}
            />

            <Drawer.Screen
                name={NavigationRoutes.ROUTE_CREATE_COURSE}
                component={CreateCourseComponent}
                options={{
                    title: i18n.t("itrex.createCourse"),
                    drawerIcon: () => <MaterialIcons name="add" size={28} color="#011B45" style={styles.icon} />,
                }}
            />
            <Drawer.Screen
                name={NavigationRoutes.ROUTE_UPLOAD_VIDEO}
                component={UploadVideoComponent}
                options={{
                    title: i18n.t("itrex.toUploadVideo"),
                    drawerIcon: () => (
                        <MaterialCommunityIcons name="upload-outline" size={28} color="#011B45" style={styles.icon} />
                    ),
                }}
            />

            {items}
        </Drawer.Navigator>
    );
};

const styles = StyleSheet.create({
    icon: {
        width: 24,
        height: 24,
    },
});
export default DrawerNavigator;
