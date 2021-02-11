import React from "react";
import { StyleSheet, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import { HomeComponent } from "../components/HomeComponent";
import { CreateCourseComponent } from "../components/CreateCourseComponent";
import { UploadVideoComponent } from "../components/UploadVideoComponent";
import { LoginComponent } from "../components/LoginComponent";
import { dark } from "./themes/dark";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import i18n from "../locales";

const Stack = createStackNavigator();

const MainStackNavigator = ({ navigation }) => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerTitleAlign: "center",
                headerStyle: {
                    backgroundColor: dark.theme.blueGreen,
                },
                headerTintColor: dark.theme.darkBlue1,
                headerBackTitle: "Back",
                headerRight: () => (
                    <View style={{ flexDirection: "row" }}>
                        <MaterialCommunityIcons name="home-outline" size={28} color="#011B45" style={styles.icon} />
                    </View>
                ),
                headerLeft: () => (
                    <MaterialCommunityIcons
                        name="menu"
                        color="#011B45"
                        size={28}
                        onPress={() => navigation.openDrawer()}
                        style={styles.icon}
                    />
                ),
            }}>
            <Stack.Screen name="Home" component={HomeComponent} options={{ title: i18n.t("itrex.home") }} />
        </Stack.Navigator>
    );
};

const CourseStackNavigator = ({ navigation }) => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerTitleAlign: "center",
                headerStyle: {
                    backgroundColor: dark.theme.blueGreen,
                },
                headerTintColor: dark.theme.darkBlue1,
                headerBackTitle: "Back",
                headerRight: () => (
                    <View style={{ flexDirection: "row" }}>
                        <MaterialCommunityIcons name="home-outline" size={28} color="#011B45" style={styles.icon} />
                    </View>
                ),
                headerLeft: () => (
                    <MaterialCommunityIcons
                        name="menu"
                        color="#011B45"
                        size={28}
                        onPress={() => navigation.openDrawer()}
                        style={styles.icon}
                    />
                ),
            }}>
            <Stack.Screen
                name="CreateCourse"
                component={CreateCourseComponent}
                options={{ title: i18n.t("itrex.toCourse") }}
            />
        </Stack.Navigator>
    );
};

const UploadVideoStackNavigator = ({ navigation }) => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerTitleAlign: "center",
                headerStyle: {
                    backgroundColor: dark.theme.blueGreen,
                },
                headerTintColor: dark.theme.darkBlue1,
                headerBackTitle: "Back",
                headerRight: () => (
                    <View style={{ flexDirection: "row" }}>
                        <MaterialCommunityIcons name="home-outline" size={28} color="#011B45" style={styles.icon} />
                    </View>
                ),
                headerLeft: () => (
                    <MaterialCommunityIcons
                        name="menu"
                        color="#011B45"
                        size={28}
                        onPress={() => navigation.openDrawer()}
                        style={styles.icon}
                    />
                ),
            }}>
            <Stack.Screen
                name="UploadVideo"
                component={UploadVideoComponent}
                options={{ title: i18n.t("itrex.toUploadVideo") }}
            />
        </Stack.Navigator>
    );
};

const LoginComponentStackNavigator = ({ navigation }) => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerTitleAlign: "center",
                headerStyle: {
                    backgroundColor: dark.theme.blueGreen,
                },
                headerTintColor: dark.theme.darkBlue1,
                headerBackTitle: "Back",
                headerRight: () => (
                    <View style={{ flexDirection: "row" }}>
                        <MaterialCommunityIcons name="home-outline" size={28} color="#011B45" style={styles.icon} />
                    </View>
                ),
                headerLeft: () => (
                    <MaterialCommunityIcons
                        name="menu"
                        color="#011B45"
                        size={28}
                        onPress={() => navigation.openDrawer()}
                        style={styles.icon}
                    />
                ),
            }}>
            <Stack.Screen name="Login" component={LoginComponent} options={{ title: i18n.t("itrex.login") }} />
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    icon: {
        paddingLeft: 10,
        paddingRight: 10,
    },
    iconContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: 120,
    },
});
export { MainStackNavigator, CourseStackNavigator, UploadVideoStackNavigator, LoginComponentStackNavigator };
