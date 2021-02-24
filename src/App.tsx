import { ReactElement } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { loggerFactory } from "../logger/LoggerConfig";
import { Linking, TouchableOpacity, Text, StyleSheet, ActivityIndicator, Button, SafeAreaView } from "react-native";
import i18n from "./locales/index";
import * as Localization from "expo-localization";
import DrawerNavigator from "./constants/navigators/DrawNavigation";
import React from "react";
import { dark } from "./constants/themes/dark";
import { AuthContext, LocalizationContext } from "./components/Context";
import { LoggedInNavigator } from "./navigation/LoggedInNavigator";
import { LoggedOutNavigator } from "./navigation/LoggedOutNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AuthenticationService from "./services/AuthenticationService";
import * as AuthSession from "expo-auth-session";
import { IAuthContext } from "./components/Context";
import { ILoginReducerAction, ILoginReducerState } from "./types/ILoginReducer";
import { Provider as PaperProvider } from "react-native-paper";
import { AsyncStorageService, StorageConstants } from "./services/StorageService";

const loggerService = loggerFactory.getLogger("service.App");

function loginReducer(prevState: ILoginReducerState, action: ILoginReducerAction): ILoginReducerState {
    switch (action.type) {
        case "RESTORE_TOKEN":
            AuthenticationService.getInstance().setTokenResponse(action.userInfo);
            AuthenticationService.getInstance().refreshToken();
            return {
                ...prevState,
                userInfo: action.userInfo,
                isLoading: false,
            } as ILoginReducerState;
        case "LOGIN":
            AuthenticationService.getInstance().setTokenResponse(action.userInfo);
            return {
                ...prevState,
                userInfo: action.userInfo,
                isLoading: false,
            } as ILoginReducerState;
        case "LOGOUT":
            return {
                ...prevState,
                userInfo: null,
                isLoading: false,
            } as ILoginReducerState;
    }

    return {} as ILoginReducerState;
}

const initialLoginState: ILoginReducerState = {
    isLoading: true,
    userInfo: null,
};

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

    const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

    const authContext = React.useMemo<IAuthContext>(
        () => ({
            signIn: (userInfo: AuthSession.TokenResponseConfig) => {
                dispatch({ type: "LOGIN", userInfo: userInfo } as ILoginReducerAction);
                // We call it doppelt gemoppelt
                //TODO: Store in context ?
            },
            signOut: () => {
                dispatch({ type: "LOGOUT" } as ILoginReducerAction);
            },
            getUserInfo: () => {
                return loginState;
            },
        }),
        []
    );

    React.useEffect(() => {
        new AsyncStorageService().getItem(StorageConstants.OAUTH_REFRESH_TOKEN).then((value) => {
            if (value !== null) {
                const lastRefreshToken = JSON.parse(value) as AuthSession.TokenResponseConfig;
                console.log(lastRefreshToken);
                dispatch({ type: "RESTORE_TOKEN", userInfo: lastRefreshToken } as ILoginReducerAction);
            }
        });
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
        <PaperProvider>
            <AuthContext.Provider value={authContext}>
                <LocalizationContext.Provider value={localizationContext}>
                    {loginState.userInfo != null ? <LoggedInNavigator /> : <LoggedOutNavigator />}
                </LocalizationContext.Provider>
            </AuthContext.Provider>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    appButtonContainer: {
        elevation: 8,
        backgroundColor: dark.theme.blueGreen,
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    buttonText: {
        alignContent: "center",
        textAlign: "center",
        fontSize: 15,
        color: dark.theme.darkBlue1,
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
    },
});

export default App;
