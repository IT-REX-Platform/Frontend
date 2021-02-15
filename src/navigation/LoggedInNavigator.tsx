/* eslint-disable complexity */
import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ScreenCourses } from "../components/screens/ScreenCourses";
import AuthenticationService from "../services/AuthenticationService";
import { ScreenHomeLecturer } from "../components/screens/ScreenHomeLecturer";
import { ScreenHomeStudent } from "../components/screens/ScreenHomeStudent";
import { ScreenHomeAdmin } from "../components/screens/ScreenHomeAdmin";
import { ITREXRoles } from "../constants/ITREXRoles";
import { NavigationRoutes } from "../constants/navigators/NavigationRoutes";
import { UploadVideoComponent } from "../components/UploadVideoComponent";
import { NavigationContainer } from "@react-navigation/native";
import DrawerLayout from "react-native-gesture-handler/DrawerLayout";
import { DrawerNavigator } from "../constants/navigators/DrawNavigation";
import { View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { dark } from "../constants/themes/dark";

const Stack = createStackNavigator();

export const LoggedInNavigator: React.FC = () => {
    return (
        <NavigationContainer linking={NavigationRoutes.linking}>
            <DrawerNavigator />
        </NavigationContainer>
    );
};
