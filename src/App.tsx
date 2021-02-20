import { ReactElement } from "react";
import { loggerFactory } from "../logger/LoggerConfig";
import { ActivityIndicator, Linking, SafeAreaView } from "react-native";
import i18n from "./locales/index";
import * as Localization from "expo-localization";
import React from "react";
import { AuthContext } from "./components/Context";
import { LoggedInNavigator } from "./navigation/LoggedInNavigator";
import { LoggedOutNavigator } from "./navigation/LoggedOutNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AuthenticationService from "./services/AuthenticationService";
import * as AuthSession from "expo-auth-session";
import { IAuthContext } from "./components/Context";
import { ILoginReducerAction, ILoginReducerState } from "./types/ILoginReducer";
import { ILocalizationContext } from "./types/ILocalizationContext";

const loggerService = loggerFactory.getLogger("service.App");

export const LocalizationContext = React.createContext({} as ILocalizationContext);

function loginReducer(prevState: ILoginReducerState, action: ILoginReducerAction): ILoginReducerState {
    switch (action.type) {
        case "RESTORE_TOKEN":
            return {
                ...prevState,
                userInfo: null,
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
            signIn: (userInfo: AuthSession.TokenResponse) => {
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
        setTimeout(() => {
            //TODO: Load Token from local-Storage
            dispatch({ type: "RESTORE_TOKEN", token: "myCoolToken" } as ILoginReducerAction);
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
                {loginState.userInfo != null ? <LoggedInNavigator /> : <LoggedOutNavigator />}
            </LocalizationContext.Provider>
        </AuthContext.Provider>
    );
}
export default App;
