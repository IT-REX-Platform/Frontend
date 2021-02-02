import React from "react";
import { Button, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NavigationRoutes } from "../constants/NavigationRoutes";
import { LocalizationContext } from "../App";

export const HomeComponent: React.FC = () => {
    const navigation = useNavigation();

    const { t } = React.useContext(LocalizationContext);

    return (
        <View style={styles.container}>
            <Button title={t("itrex.login")} onPress={() => navigation.navigate(NavigationRoutes.ROUTE_LOGIN)} />
            <Button
                title={t("itrex.toCourse")}
                onPress={() => navigation.navigate(NavigationRoutes.ROUTE_CREATE_COURSE)}
            />
            <Button
                title={t("itrex.toUploadVideo")}
                onPress={() => navigation.navigate(NavigationRoutes.ROUTE_UPLOAD_VIDEO)}
            />
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
