import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ScreenLogin } from "../components/screens/ScreenLogin";
import { ScreenLogout } from "../components/screens/ScreenLogout";
import { NavigationRoutes } from "../constants/navigators/NavigationRoutes";
import i18n from "../locales";

const Stack = createStackNavigator();

export const LoggedOutNavigator: React.FC = () => {
    return (
        <NavigationContainer linking={NavigationRoutes.linking}>
            <Stack.Navigator headerMode="none">
                <Stack.Screen
                    options={{
                        title: i18n.t("itrex.tabTitle") + i18n.t("itrex.login"),
                    }}
                    name="Login"
                    component={ScreenLogin}
                />
                <Stack.Screen name="ROUTE_LOGOUT" component={ScreenLogout} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
