import React from "react";

// import { makeRedirectUri, useAuthRequest, exchangeCodeAsync, TokenResponse } from "expo-auth-session";
import Constants from "expo-constants";
import { View, Linking, Text, SafeAreaView } from "react-native";
import { CreateCourseComponent } from "./src/components/CreateCourseComponent";
import { LoginComponent } from "./src/components/LoginComponent";
import { UploadVideoComponent } from "./src/components/UploadVideoComponent";
import TestComponent from "./src/components/TestComponent";
import ChangeLanguageComponent from "./src/components/ChangeLanguageComponent";
import ITREXVARS from "./src/Constants";

export default function App(): JSX.Element {
    Linking.addEventListener("login", (url) => {
        console.log("URL" + url);
    });

    return (
        <SafeAreaView style={{ paddingTop: Constants.statusBarHeight }}>
            <LoginComponent></LoginComponent>
            <CreateCourseComponent></CreateCourseComponent>
            <UploadVideoComponent></UploadVideoComponent>
            <ChangeLanguageComponent></ChangeLanguageComponent>
            <TestComponent></TestComponent>
        </SafeAreaView>
    );
}
