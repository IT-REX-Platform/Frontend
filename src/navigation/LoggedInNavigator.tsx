import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AuthenticationService from "../services/AuthenticationService";
import { ScreenHomeLecturer } from "../components/screens/ScreenHomeLecturer";
import { ScreenHomeStudent } from "../components/screens/ScreenHomeStudent";
import { ScreenHomeAdmin } from "../components/screens/ScreenHomeAdmin";
import { ITREXRoles } from "../constants/ITREXRoles";
import { NavigationRoutes } from "../constants/NavigationRoutes";
import { NavigationContainer } from "@react-navigation/native";
import { LocalizationContext } from "../App";
import i18n from "../locales";
import { Text, View } from "react-native";
import { VideoPoolComponent } from "../components/VideoPoolComponent";
import { UploadVideoComponent } from "../components/UploadVideoComponent";
import { VideoComponent } from "../components/VideoComponent";

const Stack = createStackNavigator();

export const LoggedInNavigator: React.FC = () => {
    const { t } = React.useContext(LocalizationContext);
    const authenticationService = AuthenticationService.getInstance();

    // May complete different stacks for Lecturer/Student/Admin ?
    let homeScreen;

    if (authenticationService.getRoles().includes(ITREXRoles.ROLE_LECTURER)) {
        homeScreen = (
            <Stack.Screen
                name={NavigationRoutes.ROUTE_HOME}
                component={ScreenHomeLecturer}
                options={{ title: i18n.t("itrex.homeLecturerTitle") }}
            />
        );
    } else if (authenticationService.getRoles().includes(ITREXRoles.ROLE_STUDENT)) {
        homeScreen = (
            <Stack.Screen
                name={NavigationRoutes.ROUTE_HOME}
                component={ScreenHomeStudent}
                options={{ title: i18n.t("itrex.homeStudentTitle") }}
            />
        );
    } else if (authenticationService.getRoles().includes(ITREXRoles.ROLE_ADMIN)) {
        homeScreen = (
            <Stack.Screen
                name={NavigationRoutes.ROUTE_HOME}
                component={ScreenHomeAdmin}
                options={{ title: i18n.t("itrex.homeAdminTitle") }}
            />
        );
    } else {
        return (
            <View>
                <Text>{i18n.t("itrex.homeErrorText")}</Text>
            </View>
        );
    }

    const videoPoolScreen = (
        <Stack.Screen
            name={NavigationRoutes.ROUTE_VIDEO_POOL}
            component={VideoPoolComponent}
            options={{ title: i18n.t("itrex.videoPool") }}
        />
    );

    const videoScreen = (
        <Stack.Screen
            name={NavigationRoutes.ROUTE_VIDEO}
            component={VideoComponent}
            options={{ title: i18n.t("itrex.video") }}
        />
    );

    const videoUploadScreen = (
        <Stack.Screen
            name={NavigationRoutes.ROUTE_UPLOAD_VIDEO}
            component={UploadVideoComponent}
            options={{ title: i18n.t("itrex.toUploadVideo") }}
        />
    );

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={NavigationRoutes.ROUTE_HOME}>
                {homeScreen}
                {videoPoolScreen}
                {videoScreen}
                {videoUploadScreen}
            </Stack.Navigator>
        </NavigationContainer>
    );
};
