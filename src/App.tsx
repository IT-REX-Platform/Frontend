/* eslint-disable complexity */
import { ReactElement } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { loggerFactory } from "../logger/LoggerConfig";
import { NavigationRoutes } from "./constants/NavigationRoutes";
import { ActivityIndicator, Button, Linking, SafeAreaView } from "react-native";
import i18n from "./locales/index";
import * as Localization from "expo-localization";
import { HomeComponent } from "./components/HomeComponent";
import { CreateCourseComponent } from "./components/CreateCourseComponent";
import { LoginComponent } from "./components/LoginComponent";
import { UploadVideoComponent } from "./components/UploadVideoComponent";
import React from "react";
import { AuthContext } from "./components/Context";
import { LoggedInStack } from "./navigation/LoggedInStack";
import { LoggedOutStack } from "./navigation/LoggedOutStack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AuthenticationService from "./services/AuthenticationService";
import * as AuthSession from "expo-auth-session";
import { IAuthContext } from "./components/Context";

const loggerService = loggerFactory.getLogger("service.App");

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

    const initialLoginState = {
        isLoading: true,
        userInfo: null,
    };

    const loginReducer = (prevState, action) => {
        switch (action.type) {
            case "RESTORE_TOKEN":
                return {
                    ...prevState,
                    userInfo: null,
                    isLoading: false,
                };
            case "LOGIN":
                console.log("LOGIN");
                return {
                    ...prevState,
                    userInfo: action.userInfo,
                    isLoading: false,
                };
            case "LOGOUT":
                return {
                    ...prevState,
                    userInfo: null,
                    isLoading: false,
                };
        }
    };

    const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

    const authContext = React.useMemo<IAuthContext>(
        () => ({
            signIn: (userInfo: AuthSession.TokenResponse) => {
                dispatch({ type: "LOGIN", userInfo: userInfo });
                // We call it doppelt gemoppelt
                //TODO: Store in context ?
                AuthenticationService.getInstance().setTokenResponse(userInfo);
            },
            signOut: () => {
                dispatch({ type: "LOGOUT" });
            },
            getUserInfo: () => {
                return loginState;
            },
        }),
        []
    );

    React.useEffect(() => {
        setTimeout(() => {
            //TODO: Load from local storage
            dispatch({ type: "RESTORE_TOKEN", token: "myCoolToken" });
        }, 1000);
    }, []);

    if (loginState.isLoading) {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size="large"></ActivityIndicator>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    return (
        <AuthContext.Provider value={authContext}>
            <LocalizationContext.Provider value={localizationContext}>
                <NavigationContainer>
                    {loginState.userInfo != null ? <LoggedInStack /> : <LoggedOutStack />}
                </NavigationContainer>
            </LocalizationContext.Provider>
        </AuthContext.Provider>
    );
}
export default App;
