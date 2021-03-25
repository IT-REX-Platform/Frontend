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
import { EndpointsCourse } from "../../api/endpoints/EndpointsCourse";
import AuthenticationService from "../../services/AuthenticationService";
import { ITREXRoles } from "../ITREXRoles";
import { dark } from "../themes/dark";
import { CommonActions } from "@react-navigation/native";

export const DrawerContent: React.FC<DrawerContentComponentProps> = (props: DrawerContentComponentProps) => {
    const loggerService = loggerFactory.getLogger("service.CreateCourseComponent");
    const endpointsCourse: EndpointsCourse = new EndpointsCourse();
    const { navigation } = props;

    // Courses array.
    const drawerItems = [];

    // Courses state.
    const initialCourseState: ICourse[] = [];
    const [courses, setCourses] = useState(initialCourseState);

    // Localisation.
    const { locale, setLocale } = React.useContext(LocalizationContext);
    const toggleIsGerman = () => {
        if (locale == "de-DE") {
            setLocale("en");
        } else {
            setLocale("de-DE");
        }
    };

    const { signOut } = React.useContext(AuthContext);

    useEffect(() => {
        _getAllCourses();
    }, [AuthenticationService.getInstance().tokenResponse]);

    if (courses.length < 1) {
        _displayNoCourses();
    }

    for (const course of courses) {
        drawerItems.push(
            <DrawerItem
                {...props}
                icon={() => <MaterialCommunityIcons name="notebook-outline" size={28} color="white" />}
                label={"" + course.name}
                key={course.id}
                onPress={() => {
                    navigation.dispatch({
                        ...CommonActions.reset({
                            index: 0,
                            routes: [{ name: NavigationRoutes.ROUTE_COURSE_DETAILS, params: { courseId: course.id } }],
                        }),
                    });
                }}
            />
        );
    }

    return (
        <>
            <View style={styles.titleContainer}>
                <Image style={styles.titleImage} source={require("../images/Logo_white.png")} />
                <Text style={styles.titleText}>IT-REX</Text>
            </View>

            <DrawerItemList {...props} />

            <Text style={styles.sectionHeader}>{i18n.t("itrex.myCoursesDivider")}</Text>
            <DrawerContentScrollView {...props}>{drawerItems}</DrawerContentScrollView>

            <Text style={styles.sectionHeader}>{i18n.t("itrex.quickSettings")}</Text>
            <View style={styles.settingsContainer}>
                <View style={styles.horizontalContainer}>
                    <Text style={{ color: "white" }}>{i18n.t("itrex.switchLang")}</Text>
                    <Switch value={locale == "de-DE"} onValueChange={toggleIsGerman} />
                </View>
            </View>

            <DrawerItem
                {...props}
                icon={() => <MaterialCommunityIcons name="logout" size={28} color="white" />}
                label={i18n.t("itrex.logout")}
                onPress={() => signOut()}
            />
        </>
    );

    function _getAllCourses(): void {
        loggerService.trace("Getting all courses.");
        const request: RequestInit = RequestFactory.createGetRequest();
        endpointsCourse
            .getUserCourses(request, undefined, undefined, undefined, i18n.t("itrex.getCoursesError"))
            .then((receivedCourses) => setCourses(receivedCourses));
    }

    function _displayNoCourses() {
        if (
            AuthenticationService.getInstance().getRoles().includes(ITREXRoles.ROLE_LECTURER) ||
            AuthenticationService.getInstance().getRoles().includes(ITREXRoles.ROLE_ADMIN)
        ) {
            drawerItems.push(<Text style={styles.textNoCourses}>{i18n.t("itrex.noCoursesLecturer")}</Text>);
        } else {
            drawerItems.push(<Text style={styles.textNoCourses}>{i18n.t("itrex.noCoursesStudent")}</Text>);
        }
    }
};

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: "row",
        justifyContent: "center",
        margin: 10,
    },
    titleImage: {
        width: 36,
        height: 36,
        alignSelf: "center",
        color: "white",
    },
    titleText: {
        marginStart: 10,
        fontSize: 30,
        color: "white",
        textShadowColor: "white",
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 2,
    },
    sectionHeader: {
        marginTop: 20,
        marginStart: 10,
        color: "white",
    },
    settingsContainer: {
        marginHorizontal: 10,
        marginVertical: 5,
        backgroundColor: dark.theme.darkBlue2,
        borderRadius: 4,
    },
    horizontalContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        margin: 5,
    },
    textNoCourses: {
        alignSelf: "center",
        margin: 5,
        color: "white",
    },
});
