import React from "react";
import { Text, StyleSheet, View, ScaledSize, useWindowDimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LocalizationContext } from "../../components/Context";
import { MinimalScreenForDrawer } from "../MinimalScreenForDrawer";
import { dark } from "../themes/dark";

interface Title {
    title: string;
}

export const Header: React.FC<Title> = (props) => {
    const title = props.title;
    React.useContext(LocalizationContext);
    const navigation = useNavigation();
    const dimensions: ScaledSize = useWindowDimensions();

    return (
        <View style={styles.container}>
            <MaterialCommunityIcons style={styles.placeholderIcon} />
            <Text style={styles.headerTitle}>{title}</Text>
            {_showHamburger(dimensions)}
        </View>
    );

    function _showHamburger(dimensions: ScaledSize) {
        if (dimensions.width < MinimalScreenForDrawer.SIZE) {
            return (
                <MaterialCommunityIcons
                    style={styles.hamburgerIcon}
                    name="menu"
                    size={28}
                    color="white"
                    onPress={() => navigation.openDrawer()}
                />
            );
        }

        return <MaterialCommunityIcons style={styles.placeholderIcon} />;
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
    placeholderIcon: {
        marginRight: 50,
    },
    headerTitle: {
        fontSize: 22,
        color: "white",
        textShadowColor: "white",
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 2,
    },
    hamburgerIcon: {
        padding: 10,
    },
});
