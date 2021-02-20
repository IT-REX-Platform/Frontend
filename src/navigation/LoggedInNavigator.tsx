/* eslint-disable complexity */
import * as React from "react";
import { NavigationRoutes } from "../constants/navigators/NavigationRoutes";
import { NavigationContainer } from "@react-navigation/native";
import { DrawerNavigator } from "../constants/navigators/DrawNavigation";
import { LocalizationContext } from "../components/Context";

export const LoggedInNavigator: React.FC = () => {
    React.useContext(LocalizationContext);

    return (
        <NavigationContainer linking={NavigationRoutes.linking}>
            <DrawerNavigator />
        </NavigationContainer>
    );
};
