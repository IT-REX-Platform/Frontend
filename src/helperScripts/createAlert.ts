import { Alert, Platform } from "react-native";

export function createAlert(message: string): void {
    if (Platform.OS === "android") {
        Alert.alert(message);
        return;
    }

    if (Platform.OS === "ios") {
        Alert.alert(message);
        return;
    }

    alert(message);
}
