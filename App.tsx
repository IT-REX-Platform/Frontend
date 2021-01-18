import React from "react";

// import { makeRedirectUri, useAuthRequest, exchangeCodeAsync, TokenResponse } from "expo-auth-session";

import { View, Linking } from "react-native";
import { CreateCourseComponent } from "./src/components/CreateCourseComponent";
import { LoginComponent } from "./src/components/LoginComponent";
import { UploadVideoComponent } from "./src/components/UploadVideoComponent";
import TestComponent from "./src/components/TestComponent";

export default function App(): JSX.Element {
    Linking.addEventListener("login", (url) => {
        console.log("URL" + url);
    });

    return (
        <View>
            <LoginComponent></LoginComponent>
            <CreateCourseComponent></CreateCourseComponent>
            <UploadVideoComponent></UploadVideoComponent>
            <TestComponent></TestComponent>
        </View>
    );
}
