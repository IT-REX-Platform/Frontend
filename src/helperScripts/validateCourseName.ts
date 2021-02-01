import { Alert, Platform } from "react-native";

export function validateCourseName(courseName: string): boolean {
    if (courseName === "invalid") {
        createAlert("Course name invalid.");
        return false;
    }

    if (courseName.length > 3) {
        return true;
    }

    createAlert("Course name invalid");
    return false;
}

function createAlert(message: string) {
    if (Platform.OS === ("android" || "ios")) {
        Alert.alert(message);
    } else {
        alert(message);
    }
}
