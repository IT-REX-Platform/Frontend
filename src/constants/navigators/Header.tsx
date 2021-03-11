import React from "react";
import { Text, StyleSheet, View, ScaledSize, useWindowDimensions } from "react-native";
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
    console.log(props.title);
    React.useContext(LocalizationContext);
    const navigation = useNavigation();
    const dimensions: ScaledSize = useWindowDimensions();

    return (
        <View style={styles.container}>
            <MaterialCommunityIcons style={styles.iconLeft} />
            <Text style={styles.headerTitle}>{title}</Text>
            {showHamburger(dimensions)}
        </View>
    );
    function showHamburger(dimensions: ScaledSize) {
        if (dimensions.width < 1280) {
            return (
                <MaterialCommunityIcons
                    style={styles.iconRight}
                    name="menu"
                    size={28}
                    color="white"
                    onPress={() => navigation.openDrawer()}
                />
            );
        } else {
            return <MaterialCommunityIcons style={styles.iconRight} />;
        }
    }
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
        marginRight: 30,
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
