import React from "react";
import { Text, StyleSheet, View } from "react-native";
import { dark } from "../themes/dark";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationRoutes } from "../../constants/navigators/NavigationRoutes";
import { useNavigation } from "@react-navigation/native";
import { LocalizationContext } from "../../components/Context";

interface Title {
    title: string;
}

export const Header: React.FC<Title> = (props) => {
    const title = props.title;
    React.useContext(LocalizationContext);
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <MaterialCommunityIcons
                name="menu"
                size={28}
                color="white"
                style={styles.iconLeft}
                onPress={() => navigation.openDrawer()}
            />
            <Text style={styles.headerTitle}>{title}</Text>
            <MaterialCommunityIcons
                name="home-outline"
                size={28}
                color="white"
                style={styles.iconRight}
                onPress={() => navigation.navigate(NavigationRoutes.ROUTE_HOME)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 64,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: dark.theme.darkBlue1,
        borderBottomColor: dark.theme.darkBlue2,
        borderBottomWidth: 3,
    },
    iconLeft: {
        padding: 10,
    },
    headerTitle: {
        alignSelf: "center",
        fontSize: 22,
        color: "white",
        textShadowColor: "white",
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 2,
    },
    iconRight: {
        padding: 10,
    },
});
