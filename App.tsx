import React from "react";

// import { makeRedirectUri, useAuthRequest, exchangeCodeAsync, TokenResponse } from "expo-auth-session";
import Constants from "expo-constants";
import { Button, Linking, Pressable, SafeAreaView, View } from "react-native";
import { CreateCourseComponent } from "./src/components/CreateCourseComponent";
import { LoginComponent } from "./src/components/LoginComponent";
import { UploadVideoComponent } from "./src/components/UploadVideoComponent";
import TestComponent from "./src/components/TestComponent";

// import expo localization and properties in index.tsx
import i18n from "./src/locales/index";
import * as Localization from "expo-localization";

export default function App(): JSX.Element {
    Linking.addEventListener("login", (url) => {
        console.log("URL" + url);
    });

    // "setLocale" is necessary in App(), otherwise language will only change single component and not complete application
    const [locale, setLocale] = React.useState(Localization.locale);
    i18n.locale = locale;

    return (
        <SafeAreaView style={{ paddingTop: Constants.statusBarHeight }}>
            <LoginComponent></LoginComponent>
            <CreateCourseComponent></CreateCourseComponent>
            <UploadVideoComponent></UploadVideoComponent>
            <Pressable>
                <Button title={i18n.t("itrex.en")} onPress={() => setLocale("en")} />
            </Pressable>
            <Pressable>
                <Button title={i18n.t("itrex.de")} onPress={() => setLocale("de-DE")} />
            </Pressable>
            <TestComponent></TestComponent>
        </SafeAreaView>
    );
}
