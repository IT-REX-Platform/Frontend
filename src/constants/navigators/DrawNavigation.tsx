import React from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";
import { Image, StyleSheet, useWindowDimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { RootDrawerParamList } from "./NavigationRoutes";
import i18n from "../../locales";

import AuthenticationService from "../../services/AuthenticationService";
import { ITREXRoles } from "../ITREXRoles";
import { ScreenHomeLecturer } from "../../components/screens/ScreenHomeLecturer";
import { ScreenHomeAdmin } from "../../components/screens/ScreenHomeAdmin";
import { ScreenHomeStudent } from "../../components/screens/ScreenHomeStudent";
import { DrawerContent } from "./DrawerContent";
import { ScreenCourse } from "../../components/screens/ScreenCourse";
import { dark } from "../themes/dark";
import { CreateCourseComponent } from "../../components/CreateCourseComponent";

const Drawer = createDrawerNavigator<RootDrawerParamList>();

export const DrawerNavigator: React.FC = () => {
    const dimensions = useWindowDimensions();

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
            <Drawer.Screen
                name="ROUTE_COURSE_DETAILS"
                component={ScreenCourse}
                options={{ title: i18n.t("itrex.lastLearned") }}
            />
        </Drawer.Navigator>
    );
};

function getCreateCourseScreen() {
    if (
        AuthenticationService.getInstance().getRoles().includes(ITREXRoles.ROLE_LECTURER) ||
        AuthenticationService.getInstance().getRoles().includes(ITREXRoles.ROLE_ADMIN)
    ) {
        return (
            <Drawer.Screen
                name="ROUTE_CREATE_COURSE"
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
                name="ROUTE_HOME"
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
                name="ROUTE_HOME"
                component={ScreenHomeAdmin}
                options={{
                    title: i18n.t("itrex.home"),
                    drawerIcon: () => (
                        <MaterialCommunityIcons name="home" size={28} color="white" style={styles.icon} />
                    ),
                }}
            />
        );
    }
    if (AuthenticationService.getInstance().getRoles().includes(ITREXRoles.ROLE_STUDENT)) {
        homeScreen = (
            <Drawer.Screen
                name="ROUTE_HOME"
                component={ScreenHomeStudent}
                options={{
                    title: i18n.t("itrex.home"),
                    drawerIcon: () => (
                        <MaterialCommunityIcons name="home" size={28} color="white" style={styles.icon} />
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
