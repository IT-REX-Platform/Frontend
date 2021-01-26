import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ScreenLogin } from "../components/screens/ScreenLogin";

const Stack = createStackNavigator();

export const LoggedOutStack: React.FC = () => {
    return (
        <Stack.Navigator headerMode="none">
            <Stack.Screen name="Login" component={ScreenLogin} />
        </Stack.Navigator>
    );
};
