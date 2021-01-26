import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { loggerFactory } from "./logger/LoggerConfig";
import { NavigationRoutes } from "./src/constants/NavigationRoutes";
import { ActivityIndicator, Linking } from "react-native";
import { CreateCourseComponent } from "./src/components/CreateCourseComponent";
import { LoginComponent } from "./src/components/LoginComponent";
import { HomeComponent } from "./src/components/HomeComponent";
import { UploadVideoComponent } from "./src/components/UploadVideoComponent";
import TestComponent from "./src/components/TestComponent";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "./src/components/Context";
import AuthenticationService from "./src/services/AuthenticationService";
import * as AuthSession from "expo-auth-session";
import { LoggedInStack } from "./src/navigation/LoggedInStack";
import { LoggedOutStack } from "./src/navigation/LoggedOutStack";
import { IAuthContext } from "./src/components/Context";

const loggerService = loggerFactory.getLogger("service.App");

function App(): JSX.Element {
    Linking.addEventListener("login", (url) => {
        loggerService.trace("URL" + url);
    });

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
            <NavigationContainer>
                {loginState.userInfo != null ? <LoggedInStack /> : <LoggedOutStack />}
            </NavigationContainer>
        </AuthContext.Provider>
        /*
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
        */
    );
}
export default App;
