import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <Text
        onMouseEnter={(event) => onMouseOver(event)}
        onMouseOut={(event) => onMouseOut(event)}
      >
        Hello, world!
      </Text>
    </View>
  );
}

const onMouseOver = (event) => {
  const el = event.target;
  let colorhex = ["#000000"];
  el.style.color = colorhex[Math.floor(Math.random() * 12)];
};

const onMouseOut = (event) => {
  const el = event.target;
  let black = "#000000";
  el.style.color = black;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
