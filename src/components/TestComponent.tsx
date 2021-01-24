import React from "react";
import { StyleSheet, Text, View } from "react-native";

const TestComponent: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text onMouseEnter={(event) => onMouseOver(event)} onMouseOut={(event) => onMouseOut(event)}>
                Hello, world!
            </Text>
        </View>
    );
};

const onMouseOver = (event) => {
    const el = event.target;
    let colorhex = [
        "#7AF377",
        "#3498DB",
        "#F1C530",
        "#F29C29",
        "#8E44AD",
        "#4AA086",
        "#E74C3C",
        "#65CC71",
        "#D3541B",
        "#EB4367",
        "#74F7D9",
        "#DDA8FC",
    ];
    el.style.color = colorhex[Math.floor(Math.random() * 12)];
};

const onMouseOut = (event) => {
    const el = event.target;
    let black = "#000000";
    el.style.color = black;
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});

export default TestComponent;
