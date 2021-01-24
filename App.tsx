import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { loggerFactory } from "./logger/LoggerConfig";
import { NavigationRoutes } from "./src/constants/NavigationRoutes";
import { Linking } from "react-native";
import { CreateCourseComponent } from "./src/components/CreateCourseComponent";
import { LoginComponent } from "./src/components/LoginComponent";
import { HomeComponent } from "./src/components/HomeComponent";
import { UploadVideoComponent } from "./src/components/UploadVideoComponent";
import TestComponent from "./src/components/TestComponent";

const loggerService = loggerFactory.getLogger("service.App");

const Stack = createStackNavigator();

function HomeScreen() {
    return <HomeComponent></HomeComponent>;
}

function LoginScreen() {
    return <LoginComponent></LoginComponent>;
}

function CreateCourseScreen() {
    return <CreateCourseComponent></CreateCourseComponent>;
}

function UploadVideoScreen() {
    return <UploadVideoComponent></UploadVideoComponent>;
}

function TestScreen() {
    return <TestComponent></TestComponent>;
}

function App(): JSX.Element {
    Linking.addEventListener("login", (url) => {
        loggerService.trace("URL" + url);
    });

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={NavigationRoutes.ROUTE_HOME}>
                <Stack.Screen name={NavigationRoutes.ROUTE_HOME} component={HomeScreen} options={{ title: "Home" }} />
                <Stack.Screen
                    name={NavigationRoutes.ROUTE_LOGIN}
                    component={LoginScreen}
                    options={{ title: "Login" }}
                />
                <Stack.Screen
                    name={NavigationRoutes.ROUTE_CREATE_COURSE}
                    component={CreateCourseScreen}
                    options={{ title: "Create Course" }}
                />
                <Stack.Screen
                    name={NavigationRoutes.ROUTE_UPLOAD_VIDEO}
                    component={UploadVideoScreen}
                    options={{ title: "Upload Video" }}
                />
                <Stack.Screen name={NavigationRoutes.ROUTE_TEST} component={TestScreen} options={{ title: "Test" }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
export default App;
