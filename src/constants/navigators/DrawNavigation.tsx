import React from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";
import { Image, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
    MainStackNavigator,
    CourseStackNavigator,
    UploadVideoStackNavigator,
    LoginComponentStackNavigator,
} from "./StackNavigator";
import { NavigationRoutes } from "./NavigationRoutes";
import i18n from "../../locales";

const Drawer = createDrawerNavigator();

const DrawerNavigator: React.FC = () => {
    return (
        <Drawer.Navigator>
            <Drawer.Screen
                name={NavigationRoutes.ROUTE_HOME}
                component={MainStackNavigator}
                options={{
                    title: i18n.t("itrex.home"),
                    drawerIcon: () => (
                        <Image source={require("../images/ITRex-Logo-ob.svg")} style={[styles.icon]}></Image>
                    ),
                }}
            />

            <Drawer.Screen
                name={NavigationRoutes.ROUTE_CREATE_COURSE}
                component={CourseStackNavigator}
                options={{
                    title: i18n.t("itrex.createCourse"),
                    drawerIcon: () => <MaterialIcons name="add" size={28} color="#011B45" style={styles.icon} />,
                }}
            />
            <Drawer.Screen
                name={NavigationRoutes.ROUTE_UPLOAD_VIDEO}
                component={UploadVideoStackNavigator}
                options={{
                    title: i18n.t("itrex.toUploadVideo"),
                    drawerIcon: () => (
                        <MaterialCommunityIcons name="upload-outline" size={28} color="#011B45" style={styles.icon} />
                    ),
                }}
            />

            <Drawer.Screen
                name={NavigationRoutes.ROUTE_LOGIN}
                component={LoginComponentStackNavigator}
                options={{
                    title: i18n.t("itrex.login"),
                    drawerIcon: () => <MaterialIcons name="login" size={28} color="#011B45" style={styles.icon} />,
                }}
            />
        </Drawer.Navigator>
    );
};
const styles = StyleSheet.create({
    icon: {
        width: 24,
        height: 24,
    },
});
export default DrawerNavigator;
