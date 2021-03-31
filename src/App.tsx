import { ReactElement } from "react";
import { loggerFactory } from "../logger/LoggerConfig";
import { Linking, ActivityIndicator, SafeAreaView, Platform } from "react-native";
import i18n from "./locales/index";
import * as Localization from "expo-localization";
import React from "react";
import { AuthContext, LocalizationContext } from "./components/Context";
import { LoggedInNavigator } from "./navigation/LoggedInNavigator";
import { LoggedOutNavigator } from "./navigation/LoggedOutNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AuthenticationService from "./services/AuthenticationService";
import * as AuthSession from "expo-auth-session";
import { IAuthContext } from "./components/Context";
import { ILoginReducerAction, ILoginReducerState } from "./types/ILoginReducer";
import { AsyncStorageService, StorageConstants } from "./services/StorageService";
import { ToastContainer } from "react-toastify";

const loggerService = loggerFactory.getLogger("service.App");

/**
 * triggers login/logout/restore actions based on the given action
 * @param prevState
 * @param action
 * @returns
 */
function loginReducer(prevState: ILoginReducerState, action: ILoginReducerAction): ILoginReducerState {
    switch (action.type) {
        case "RESTORE_TOKEN":
            AuthenticationService.getInstance().setTokenResponse(action.userInfo);
            AuthenticationService.getInstance().autoRefresh();
            return {
                ...prevState,
                userInfo: action.userInfo,
                isLoading: false,
            } as ILoginReducerState;
        case "LOGIN":
            AuthenticationService.getInstance().setTokenResponse(action.userInfo);
            AuthenticationService.getInstance().autoRefresh();
            return {
                ...prevState,
                userInfo: action.userInfo,
                isLoading: false,
            } as ILoginReducerState;
        case "LOGOUT":
            AuthenticationService.getInstance().clearAuthentication();
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
        loggerService.trace("URL: " + url);
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
        // Try to restore the last saved token
        new AsyncStorageService().getItem(StorageConstants.OAUTH_REFRESH_TOKEN).then((value) => {
            if (value !== null) {
                const lastRefreshToken = JSON.parse(value) as AuthSession.TokenResponseConfig;
                AuthenticationService.getInstance().setTokenResponse(lastRefreshToken);
                AuthenticationService.getInstance()
                    .refreshToken()
                    .then(() => {
                        dispatch({ type: "RESTORE_TOKEN", userInfo: lastRefreshToken } as ILoginReducerAction);
                    })
                    .catch(() => {
                        dispatch({ type: "LOGOUT" } as ILoginReducerAction);
                    });
            } else {
                dispatch({ type: "LOGOUT" } as ILoginReducerAction);
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

    /**
     * Return the navigator based on the current log-in status
     * @returns
     */
    const _renderApp = () => {
        return (
            <AuthContext.Provider value={authContext}>
                <LocalizationContext.Provider value={localizationContext}>
                    {loginState.userInfo != null ? <LoggedInNavigator /> : <LoggedOutNavigator />}
                </LocalizationContext.Provider>
            </AuthContext.Provider>
        );
    };

    if (Platform.OS === "web") {
        return (
            <>
                <ToastContainer />
                {_renderApp()}
            </>
        );
    }

    return _renderApp();
}

export default App;
