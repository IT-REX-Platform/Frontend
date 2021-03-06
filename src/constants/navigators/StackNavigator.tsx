/*
import React from "react";
import { StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import { CreateCourseComponent } from "../../components/CreateCourseComponent";
import { VideoUploadComponent } from "../../components/VideoUploadComponent";
import { NavigationRoutes } from "../../constants/navigators/NavigationRoutes";
import { dark } from "../themes/dark";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import i18n from "../../locales";
import { LocalizationContext } from "../../components/Context";

const Stack = createStackNavigator();

const MainStackNavigator: React.FC = ({ navigation }) => {
    React.useContext(LocalizationContext);
    return (
        <Stack.Navigator
            screenOptions={{
                headerTitleAlign: "center",
                headerStyle: {
                    backgroundColor: dark.theme.darkBlue1,
                    borderBottomWidth: 3,
                    borderBottomColor: dark.theme.darkBlue2,
                },
                headerTintColor: dark.theme.darkBlue1,
                headerBackTitle: "Back",
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
            <Stack.Screen name="Home" component={HomeComponent} options={{ title: i18n.t("itrex.itrex") }} />
        </Stack.Navigator>
    );
};

const CourseStackNavigator: React.FC = ({ navigation }) => {
    React.useContext(LocalizationContext);
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
                    <MaterialCommunityIcons
                        name="home-outline"
                        size={28}
                        color="#011B45"
                        style={styles.icon}
                        onPress={() => navigation.navigate(NavigationRoutes.ROUTE_HOME)}
                    />
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
            <Stack.Screen
                name={NavigationRoutes.ROUTE_COURSE_DETAILS}
                component={CourseDetailsComponent}
                options={({ route }) => ({ title: route.params.name })}
            />
        </Stack.Navigator>
    );
};

const UploadVideoStackNavigator: React.FC = ({ navigation }) => {
    React.useContext(LocalizationContext);
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
                    <MaterialCommunityIcons
                        name="home-outline"
                        size={28}
                        color="#011B45"
                        style={styles.icon}
                        onPress={() => navigation.navigate(NavigationRoutes.ROUTE_HOME)}
                    />
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
                component={VideoUploadComponent}
                options={{ title: i18n.t("itrex.toUploadVideo") }}
            />
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
export { MainStackNavigator, CourseStackNavigator, UploadVideoStackNavigator };
*/
