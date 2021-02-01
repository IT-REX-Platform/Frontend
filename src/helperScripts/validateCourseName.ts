import { Alert, Platform } from "react-native";

export function validateCourseName(courseName: string): boolean {
    if (courseName === "invalid") {
        alert("Course name invalid.");
        return false;
    } else if (courseName.length > 3) {
        createAlert("Course created succesfully");
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
