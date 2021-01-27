import React, { ReactElement } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { loggerFactory } from "../logger/LoggerConfig";
import { NavigationRoutes } from "./constants/NavigationRoutes";
import { Linking } from "react-native";
import { CreateCourseComponent } from "./components/CreateCourseComponent";
import { LoginComponent } from "./components/LoginComponent";
import { HomeComponent } from "./components/HomeComponent";
import { UploadVideoComponent } from "./components/UploadVideoComponent";
import TestComponent from "./components/TestComponent";

const loggerService = loggerFactory.getLogger("service.App");

const Stack = createStackNavigator();

function App(): ReactElement {
    Linking.addEventListener("login", (url) => {
        loggerService.trace("URL" + url);
    });

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={NavigationRoutes.ROUTE_HOME}>
                <Stack.Screen
                    name={NavigationRoutes.ROUTE_HOME}
                    component={HomeComponent}
                    options={{ title: "Home" }}
                />
                <Stack.Screen
                    name={NavigationRoutes.ROUTE_LOGIN}
                    component={LoginComponent}
                    options={{ title: "Login" }}
                />
                <Stack.Screen
                    name={NavigationRoutes.ROUTE_CREATE_COURSE}
                    component={CreateCourseComponent}
                    options={{ title: "Create Course" }}
                />
                <Stack.Screen
                    name={NavigationRoutes.ROUTE_UPLOAD_VIDEO}
                    component={UploadVideoComponent}
                    options={{ title: "Upload Video" }}
                />
                <Stack.Screen
                    name={NavigationRoutes.ROUTE_TEST}
                    component={TestComponent}
                    options={{ title: "Test" }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
export default App;
