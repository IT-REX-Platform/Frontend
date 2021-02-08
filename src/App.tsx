import { ReactElement } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { loggerFactory } from "../logger/LoggerConfig";
import { NavigationRoutes } from "./constants/NavigationRoutes";
import { Button, Linking } from "react-native";
import i18n from "./locales/index";
import * as Localization from "expo-localization";
import { HomeComponent } from "./components/HomeComponent";
import { CreateCourseComponent } from "./components/CreateCourseComponent";
import { LoginComponent } from "./components/LoginComponent";
import { UploadVideoComponent } from "./components/UploadVideoComponent";
import React from "react";
import { CourseDetailsComponent } from "./components/CourseDetailsComponent";

const loggerService = loggerFactory.getLogger("service.App");

const Stack = createStackNavigator();

export const LocalizationContext = React.createContext({});

function App(): ReactElement {
    Linking.addEventListener("login", (url) => {
        loggerService.trace("URL" + url);
    });

    // Language Switch (save locale as const)
    const [locale, setLocale] = React.useState(Localization.locale);
    i18n.locale = locale;
    const localizationContext = React.useMemo(
        () => ({
            t: (scope: i18n.Scope, options: i18n.TranslateOptions | undefined) => i18n.t(scope, { locale, ...options }),
            locale,
            setLocale,
        }),
        [locale]
    );

    return (
        <LocalizationContext.Provider value={localizationContext}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName={NavigationRoutes.ROUTE_HOME}>
                    <Stack.Screen
                        name={NavigationRoutes.ROUTE_HOME}
                        component={HomeComponent}
                        options={{ title: i18n.t("itrex.home") }}
                    />
                    <Stack.Screen
                        name={NavigationRoutes.ROUTE_LOGIN}
                        component={LoginComponent}
                        options={{ title: i18n.t("itrex.login") }}
                    />
                    <Stack.Screen
                        name={NavigationRoutes.ROUTE_CREATE_COURSE}
                        component={CreateCourseComponent}
                        options={{ title: i18n.t("itrex.toCourse") }}
                    />
                    <Stack.Screen
                        name={NavigationRoutes.ROUTE_UPLOAD_VIDEO}
                        component={UploadVideoComponent}
                        options={{ title: i18n.t("itrex.toUploadVideo") }}
                    />
                    <Stack.Screen
                        name={NavigationRoutes.ROUTE_COURSE_DETAILS}
                        component={CourseDetailsComponent}
                        options={({ route }) => ({ title: route.params.name })}
                    />
                </Stack.Navigator>
                {locale == "en" || locale == "en-GB" || locale == "en-US" ? (
                    <Button title={i18n.t("itrex.switchLangDE")} onPress={() => setLocale("de-DE")} />
                ) : (
                    <Button title={i18n.t("itrex.switchLangEN")} onPress={() => setLocale("en")} />
                )}
            </NavigationContainer>
        </LocalizationContext.Provider>
    );
}
export default App;
