import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useWindowDimensions } from "react-native";
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
import { JoinCourseComponent } from "../../components/JoinCourseComponent";

const Drawer = createDrawerNavigator<RootDrawerParamList>();

export const DrawerNavigator: React.FC = () => {
    const dimensions = useWindowDimensions();

    return (
        <Drawer.Navigator
            drawerStyle={{ backgroundColor: dark.theme.darkBlue1, paddingBottom: 5, height: dimensions.height }}
            drawerType={dimensions.width >= 1280 ? "permanent" : "front"}
            drawerContentOptions={{
                activeTintColor: "white",
                activeBackgroundColor: dark.theme.pink,
                inactiveTintColor: "white",
                inactiveBackgroundColor: dark.theme.darkBlue2,
            }}
            drawerContent={(props) => <DrawerContent {...props} />}>
            {_gotoHomeScreen()}
            {_gotoCreateCourseScreen()}
            {_gotoJoinCourse()}
            {_gotoLastAccessedCourse()}
        </Drawer.Navigator>
    );
};

function _gotoHomeScreen() {
    const userRole: string[] = AuthenticationService.getInstance().getRoles();
    switch (true) {
        case userRole.includes(ITREXRoles.ROLE_ADMIN):
            return _getHomeScreen(ScreenHomeAdmin);
        case userRole.includes(ITREXRoles.ROLE_LECTURER):
            return _getHomeScreen(ScreenHomeLecturer);
        case userRole.includes(ITREXRoles.ROLE_STUDENT):
            return _getHomeScreen(ScreenHomeStudent);
        default:
            return;
    }
}

function _getHomeScreen(homeScreenType: React.FC) {
    return (
        <Drawer.Screen
            name="ROUTE_HOME"
            component={homeScreenType}
            options={{
                title: i18n.t("itrex.home"),
                drawerIcon: () => <MaterialCommunityIcons name="home" size={28} color="white" />,
            }}
        />
    );
}

function _gotoCreateCourseScreen() {
    if (
        AuthenticationService.getInstance().getRoles().includes(ITREXRoles.ROLE_ADMIN) ||
        AuthenticationService.getInstance().getRoles().includes(ITREXRoles.ROLE_LECTURER)
    ) {
        return (
            <Drawer.Screen
                name="ROUTE_CREATE_COURSE"
                component={CreateCourseComponent}
                options={{
                    title: i18n.t("itrex.createCourse"),
                    drawerIcon: () => <MaterialIcons name="note-add" size={28} color="white" />,
                }}
            />
        );
    }
}

function _gotoJoinCourse() {
    return (
        <Drawer.Screen
            name="ROUTE_JOIN_COURSE"
            component={JoinCourseComponent}
            options={{
                title: i18n.t("itrex.joinCourse"),
                drawerIcon: () => <MaterialIcons name="add" size={28} color="white" />,
            }}
        />
    );
}

function _gotoLastAccessedCourse() {
    return (
        <Drawer.Screen
            name="ROUTE_COURSE_DETAILS"
            component={ScreenCourse}
            options={{
                title: i18n.t("itrex.lastAccessedCourse"),
                drawerIcon: () => <MaterialIcons name="skip-previous" size={28} color="white" />,
            }}
        />
    );
}

export default DrawerNavigator;
