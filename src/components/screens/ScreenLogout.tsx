import { Platform, StyleSheet, Text, View } from "react-native";

export const ScreenLogout: React.FC = () => {
    if (Platform.OS === "web") {
        window.close();
    }
    return (
        <View style={styles.container}>
            <Text>Erfolgreich ausgeloggt</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
