import React from "react";
import { Button, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NavigationRoutes } from "../constants/NavigationRoutes";

export const HomeComponent: React.FC = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Button title="Go to Login" onPress={() => navigation.navigate(NavigationRoutes.ROUTE_LOGIN)} />
            <Button
                title="Go to Create Course"
                onPress={() => navigation.navigate(NavigationRoutes.ROUTE_CREATE_COURSE)}
            />
            <Button
                title="Go to Upload Video"
                onPress={() => navigation.navigate(NavigationRoutes.ROUTE_UPLOAD_VIDEO)}
            />
            <Button title="Go to Test" onPress={() => navigation.navigate(NavigationRoutes.ROUTE_TEST)} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
