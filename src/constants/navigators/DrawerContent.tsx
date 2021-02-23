import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Switch, Text, View } from "react-native";
import {
    DrawerContentComponentProps,
    DrawerContentScrollView,
    DrawerItem,
    DrawerItemList,
} from "@react-navigation/drawer";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { ICourse } from "../../types/ICourse";
import { loggerFactory } from "../../../logger/LoggerConfig";
import { RequestFactory } from "../../api/requests/RequestFactory";
import { NavigationRoutes } from "./NavigationRoutes";
import { AuthContext, LocalizationContext } from "../../components/Context";
import i18n from "../../locales";
import { Drawer } from "react-native-paper";
import { dark } from "../themes/dark";
import { EndpointsCourse } from "../../api/endpoints/EndpointsCourse";
import AuthenticationService from "../../services/AuthenticationService";
import { ITREXRoles } from "../ITREXRoles";

export const DrawerContent: React.FC<DrawerContentComponentProps> = (props: DrawerContentComponentProps) => {
    const { signOut } = React.useContext(AuthContext);

    const { navigation } = props;

    // Display all courses
    const initialCourseState: ICourse[] = [];
    const [courses, setCourses] = useState(initialCourseState);

    const loggerService = loggerFactory.getLogger("service.CreateCourseComponent");
    const endpointsCourse: EndpointsCourse = new EndpointsCourse();

    const drawerItems = [];

    const [isDarkTheme, setIsDarkTheme] = React.useState(false);
    const toggleIsDarkTheme = () => setIsDarkTheme((previousState) => !previousState);

    const { locale, setLocale } = React.useContext(LocalizationContext);

    const toggleIsGerman = () => {
        if (locale == "de-DE") {
            setLocale("en");
        } else {
            setLocale("de-DE");
        }
    };

    function getAllCourses(): void {
        loggerService.trace("Getting all courses.");
        const request: RequestInit = RequestFactory.createGetRequest();
        endpointsCourse.getFilteredCourses(request).then((receivedCourses) => {
            setCourses(receivedCourses);
        });
    }

    function noCourses() {
        if (
            AuthenticationService.getInstance().getRoles().includes(ITREXRoles.ROLE_LECTURER) ||
            AuthenticationService.getInstance().getRoles().includes(ITREXRoles.ROLE_ADMIN)
        ) {
            drawerItems.push(<Text style={styles.textNoCourses}>{i18n.t("itrex.noCoursesLecturer")}</Text>);
        } else {
            drawerItems.push(<Text style={styles.textNoCourses}>{i18n.t("itrex.noCoursesStudent")}</Text>);
        }
    }

    if (courses.length > 0) {
        for (const course of courses) {
            drawerItems.push(
                <DrawerItem
                    {...props}
                    icon={() => (
                        <MaterialCommunityIcons name="notebook-outline" size={28} color="white" style={styles.icon} />
                    )}
                    label={"" + course.name}
                    key={course.id}
                    onPress={() => {
                        console.log("Course Details");
                        navigation.navigate(NavigationRoutes.ROUTE_COURSE_DETAILS, {
                            courseId: course.id,
                        });
                    }}></DrawerItem>
            );
        }
    } else {
        noCourses();
    }

    useEffect(() => {
        getAllCourses();
    }, []);

    return (
        <View style={{ flex: 1 }}>
            {/* https://stackoverflow.com/questions/65773696/react-native-paper-drawer-section-not-working-as-intended*/}
            <Drawer.Section
                style={{
                    backgroundColor: dark.theme.darkBlue1,
                    borderBottomWidth: 3,
                    borderBottomColor: dark.theme.darkBlue2,
                }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", height: 56 }}>
                    <Image source={require("../images/Logo_white.png")} style={[styles.icon]}></Image>
                    <Text style={styles.textWithShadow}>IT-REX</Text>
                </View>
            </Drawer.Section>
            <Drawer.Section
                style={{
                    backgroundColor: dark.theme.darkBlue1,
                    borderBottomWidth: 3,
                    borderBottomColor: dark.theme.darkBlue2,
                }}>
                <DrawerItemList {...props} />
            </Drawer.Section>

            <DrawerContentScrollView {...props}>
                <Drawer.Section
                    style={{
                        backgroundColor: dark.theme.darkBlue1,
                        borderBottomWidth: 3,
                        borderBottomColor: dark.theme.darkBlue2,
                    }}>
                    <View>
                        <Text style={styles.sectionHeader}> {i18n.t("itrex.myCoursesDevider")}</Text>
                    </View>
                    {drawerItems}
                </Drawer.Section>
            </DrawerContentScrollView>
            <Drawer.Section>
                <View>
                    <Text style={styles.sectionHeader}> {i18n.t("itrex.fastSettings")}</Text>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingVertical: 12,
                        paddingHorizontal: 16,
                    }}>
                    <Text style={{ color: "white" }}>{i18n.t("itrex.darkTheme")}</Text>
                    <Switch value={isDarkTheme} onValueChange={toggleIsDarkTheme}></Switch>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingVertical: 12,
                        paddingHorizontal: 16,
                    }}>
                    <Text style={{ color: "white" }}>{i18n.t("itrex.switchLang")}</Text>
                    <Switch value={locale == "de-DE"} onValueChange={toggleIsGerman}></Switch>
                </View>
                <DrawerItem
                    {...props}
                    icon={() => <MaterialCommunityIcons name="logout" size={28} color="white" style={styles.icon} />}
                    label={i18n.t("itrex.logout")}
                    onPress={() => {
                        signOut();
                    }}></DrawerItem>
            </Drawer.Section>
        </View>
    );
};

const styles = StyleSheet.create({
    icon: {
        marginTop: 10,
        width: 36,
        height: 36,
    },
    textWithShadow: {
        marginLeft: 10,
        marginTop: 10,
        textShadowColor: "white",
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 2,
        fontSize: 30,
        tintColor: "white",
        color: "white",
    },
    sectionHeader: {
        color: dark.theme.darkBlue4,
        marginTop: 3,
        marginBottom: 10,
        fontSize: 15,
    },
    textNoCourses: { justifyContent: "center", color: "white", alignContent: "center", marginLeft: 25, fontSize: 15 },
});
