import { createAlert } from "../../src/helperScripts/createAlert";
import { Alert, Platform } from "react-native";

global.alert = jest.fn();
Alert.alert = jest.fn();

describe("CreateAlert", () => {
    it("creates an alert in Web.", () => {
        Platform.OS = "web";

        createAlert("Hello Web.");
        expect(global.alert).toHaveBeenCalled();
    });

    it("creates an alert in Android.", () => {
        Platform.OS = "android";

        createAlert("Hello Android.");
        expect(Alert.alert).toHaveBeenCalled();
    });

    it("creates an alert in iOS.", () => {
        Platform.OS = "ios";

        createAlert("Hello iOS.");
        expect(Alert.alert).toHaveBeenCalled();
    });
});
