import { useRoute } from "@react-navigation/native";
import React from "react";
import { Text, ImageBackground, StyleSheet } from "react-native";
import { LocalizationContext } from "../App";
import { dark } from "../constants/themes/dark";
import { Header } from "../constants/navigators/Header";

export const CourseDetailsComponent: React.FC = () => {
    const route = useRoute();
    const courseDetails = route.params;
    console.log(courseDetails);

    React.useContext(LocalizationContext);

    return (
        <>
            <ImageBackground source={require("../constants/images/Background_forest.svg")} style={styles.image}>
                <Header title={"This is a course details page!"} />
                <Text style={styles.container}>Hier könnte ihre Werbung stehen</Text>
                <Text>{JSON.stringify(courseDetails)}</Text>;
            </ImageBackground>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 70,
        textDecorationColor: dark.theme.pink,
        fontSize: 50,
        color: dark.theme.pink,
        justifyContent: "center",
        textAlign: "center",
    },
    image: {
        flex: 1,
        resizeMode: "stretch",
    },
    icon: {
        alignItems: "center",
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 20,
    },
});
