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
            drawerType={dimensions.width >= 1400 ? "permanent" : "front"}
            drawerContentOptions={{
                activeTintColor: "white",
                activeBackgroundColor: dark.theme.pink,
                inactiveTintColor: "white",
                inactiveBackgroundColor: dark.theme.darkBlue2,
            }}
            drawerContent={(props) => <DrawerContent {...props} />}>
            {_getHomeScreen()}
            {_getCreateCourseScreen()}
            <Drawer.Screen
                name="ROUTE_JOIN_COURSE"
                component={JoinCourseComponent}
                options={{ title: i18n.t("itrex.joinCourse") }}
            />
            {_lastVisitedCourse()}
        </Drawer.Navigator>
    );
};

function _getHomeScreen() {
    const userRole: string[] = AuthenticationService.getInstance().getRoles();
    switch (true) {
        case userRole.includes(ITREXRoles.ROLE_ADMIN):
            return _homeScreen(ScreenHomeAdmin);
        case userRole.includes(ITREXRoles.ROLE_LECTURER):
            return _homeScreen(ScreenHomeLecturer);
        case userRole.includes(ITREXRoles.ROLE_STUDENT):
            return _homeScreen(ScreenHomeStudent);
        default:
            return;
    }
}

function _homeScreen(homeScreenType: React.FC) {
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

function _getCreateCourseScreen() {
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
                    drawerIcon: () => <MaterialIcons name="add" size={28} color="white" />,
                }}
            />
        );
    }
}

function _lastVisitedCourse() {
    return (
        <Drawer.Screen
            name="ROUTE_COURSE_DETAILS"
            component={ScreenCourse}
            options={{
                title: i18n.t("itrex.lastVisited"),
                drawerIcon: () => <MaterialIcons name="skip-previous" size={28} color="white" />,
            }}
        />
    );
}

export default DrawerNavigator;
