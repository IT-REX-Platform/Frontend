import React, { useEffect, useState } from "react";

import { createDrawerNavigator, DrawerItem, DrawerItemList, DrawerNavigationProp } from "@react-navigation/drawer";
import { Image, StyleSheet, useWindowDimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { HomeComponent } from "../../components/HomeComponent";
import { DrawerParamList, NavigationRoutes } from "./NavigationRoutes";
import i18n from "../../locales";
import { loggerFactory } from "../../../logger/LoggerConfig";
import { RequestFactory } from "../../api/requests/RequestFactory";
import { EndpointsCourseExtended } from "../../api/endpoints/EndpointsCourseExtended";
import { ICourse } from "../../types/ICourse";
import { CreateCourseComponent } from "../../components/CreateCourseComponent";
import { UploadVideoComponent } from "../../components/UploadVideoComponent";
import AuthenticationService from "../../services/AuthenticationService";
import { ITREXRoles } from "../ITREXRoles";
import { ScreenHomeLecturer } from "../../components/screens/ScreenHomeLecturer";
import { ScreenHomeAdmin } from "../../components/screens/ScreenHomeAdmin";
import { ScreenHomeStudent } from "../../components/screens/ScreenHomeStudent";
import { DrawerContent } from "./DrawerContent";
import { ScreenCourse } from "../../components/screens/ScreenCourse";
import { RouteProp } from "@react-navigation/native";
import { dark } from "../themes/dark";

const Drawer = createDrawerNavigator();

export const DrawerNavigator: React.FC = () => {
    const dimensions = useWindowDimensions();

    const loggerService = loggerFactory.getLogger("service.CreateCourseComponent");

    return (
        <Drawer.Navigator
            drawerContentOptions={{
                activeBackgroundColor: dark.theme.pink,
                activeTintColor: "white",
                inactiveBackgroundColor: dark.theme.darkBlue2,
                inactiveTintColor: "white",
            }}
            drawerType={dimensions.width >= 1400 ? "permanent" : "front"}
            drawerStyle={{ backgroundColor: dark.theme.darkBlue1 }}
            drawerContent={(props) => <DrawerContent {...props}></DrawerContent>}>
            {getHomeScreen()}
            {getCreateCourseScreen()}
            {getUploadVideoScreen()}
            <Drawer.Screen
                name={NavigationRoutes.ROUTE_COURSE_DETAILS}
                component={ScreenCourse}
                options={{ title: i18n.t("itrex.lastLearned") }}
            />
        </Drawer.Navigator>
    );
};

function getUploadVideoScreen() {
    if (
        AuthenticationService.getInstance().getRoles().includes(ITREXRoles.ROLE_LECTURER) ||
        AuthenticationService.getInstance().getRoles().includes(ITREXRoles.ROLE_ADMIN)
    ) {
        return (
            <Drawer.Screen
                name={NavigationRoutes.ROUTE_UPLOAD_VIDEO}
                component={UploadVideoComponent}
                options={{
                    title: i18n.t("itrex.toUploadVideo"),
                    drawerIcon: () => (
                        <MaterialCommunityIcons name="upload-outline" size={28} color="white" style={styles.icon} />
                    ),
                }}
            />
        );
    }
}

function getCreateCourseScreen() {
    if (
        AuthenticationService.getInstance().getRoles().includes(ITREXRoles.ROLE_LECTURER) ||
        AuthenticationService.getInstance().getRoles().includes(ITREXRoles.ROLE_ADMIN)
    ) {
        return (
            <Drawer.Screen
                name={NavigationRoutes.ROUTE_CREATE_COURSE}
                component={CreateCourseComponent}
                options={{
                    title: i18n.t("itrex.createCourse"),
                    drawerIcon: () => <MaterialIcons name="add" size={28} color="white" style={styles.icon} />,
                }}
            />
        );
    }
}

function getHomeScreen() {
    let homeScreen;
    if (AuthenticationService.getInstance().getRoles().includes(ITREXRoles.ROLE_LECTURER)) {
        homeScreen = (
            <Drawer.Screen
                name={NavigationRoutes.ROUTE_HOME}
                component={ScreenHomeLecturer}
                options={{
                    title: i18n.t("itrex.home"),
                    drawerIcon: () => (
                        <MaterialCommunityIcons name="home" size={28} color="white" style={styles.icon} />
                    ),
                }}
            />
        );
    }
    if (AuthenticationService.getInstance().getRoles().includes(ITREXRoles.ROLE_ADMIN)) {
        homeScreen = (
            <Drawer.Screen
                name={NavigationRoutes.ROUTE_HOME}
                component={ScreenHomeAdmin}
                options={{
                    title: i18n.t("itrex.home"),
                    drawerIcon: () => (
                        <Image source={require("../images/ITRex-Logo-ob_750x750.png")} style={[styles.icon]}></Image>
                    ),
                }}
            />
        );
    }
    if (AuthenticationService.getInstance().getRoles().includes(ITREXRoles.ROLE_STUDENT)) {
        homeScreen = (
            <Drawer.Screen
                name={NavigationRoutes.ROUTE_HOME}
                component={ScreenHomeStudent}
                options={{
                    title: i18n.t("itrex.home"),
                    drawerIcon: () => (
                        <Image source={require("../images/ITRex-Logo-ob_750x750.png")} style={[styles.icon]}></Image>
                    ),
                }}
            />
        );
    }
    return homeScreen;
}

const styles = StyleSheet.create({
    icon: {
        width: 24,
        height: 24,
    },
});
export default DrawerNavigator;
