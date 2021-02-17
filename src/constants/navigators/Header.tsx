import React from "react";
import { Text, StyleSheet, View } from "react-native";
import { dark } from "../themes/dark";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationRoutes } from "../../constants/navigators/NavigationRoutes";
import { useNavigation } from "@react-navigation/native";
import { LocalizationContext } from "../../components/Context";

export const Header: React.FC<string> = ({ title }) => {
    React.useContext(LocalizationContext);
    const navigation = useNavigation();
    return (
        <View
            style={{
                // marginTop:Constant.statusBarHeight,

                top: 0,
                left: 0,
                right: 0,
                height: 65,
                backgroundColor: dark.theme.darkBlue1,
                flexDirection: "row",
                justifyContent: "space-between",
            }}>
            <View
                style={{
                    flexDirection: "row",
                    margin: 5,
                }}>
                <MaterialCommunityIcons
                    name="menu"
                    color="white"
                    size={28}
                    style={styles.iconLeft}
                    onPress={() => navigation.openDrawer()}
                />
                <Text
                    style={{
                        fontSize: 22,
                        marginLeft: 395,
                        marginTop: 10,
                        color: "white",
                        textAlignVertical: "center",
                        justifyContent: "center",
                    }}>
                    {title}
                </Text>
            </View>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    width: 150,
                    margin: 5,
                }}>
                <MaterialCommunityIcons
                    name="home-outline"
                    size={28}
                    color="white"
                    style={styles.iconRight}
                    onPress={() => navigation.navigate(NavigationRoutes.ROUTE_HOME)}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    iconLeft: {
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 10,
        marginLeft: 0,
    },
    iconRight: {
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 10,
        marginRight: -100,
    },
});
