import React from "react";
import { View, StyleSheet, Button } from "react-native";
import { CourseCard } from "./CourseCard";
import { ICourse } from "../types/ICourse";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NavigationRoutes } from "../constants/navigators/NavigationRoutes";
import { dark } from "../constants/themes/dark";

interface CourseListProps {
    courses: ICourse[];
}

export const CourseList: React.FC<CourseListProps> = (props) => {
    const { courses } = props;

    return <> {getList(courses)}</>;
};

function getList(courses: ICourse[]) {
    const navigation = useNavigation();
    if (courses === undefined || courses.length === 0) {
        return (
            <View style={styles.cardView}>
                <Button
                    color={dark.theme.blueGreen}
                    title="Create a new Course!"
                    onPress={() => navigation.navigate(NavigationRoutes.ROUTE_CREATE_COURSE)}></Button>
            </View>
        );
    } else if (courses.length > 0) {
        return (
            <View style={styles.cardView}>
                {courses.map((course) => {
                    return <CourseCard course={course} />;
                })}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    cardView: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignContent: "space-around",
        justifyContent: "center",
    },
});
