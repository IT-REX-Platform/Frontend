import { Platform } from "react-native";
import "../../setupTests.ts";
import { FilePickerService } from "../../src/services/FilePickerService";

describe("test file picker service", () => {
    const filePicker: FilePickerService = new FilePickerService();

    it("check if the service is instantiated for Android", () => {
        Platform.OS = "android";
        const instance: FilePickerService = new FilePickerService();
        expect(instance).toBeInstanceOf(FilePickerService);
    });

    it("check if the service is instantiated for iOS", () => {
        Platform.OS = "ios";
        const instance: FilePickerService = new FilePickerService();
        expect(instance).toBeInstanceOf(FilePickerService);
    });

    it("check if method pickFile on Web or Android has been called", async () => {
        Platform.OS = "android";
        filePicker.pickFile();

        // TODO: test document picker.
    });

    it("check if method pickFile on iOS has been called", async () => {
        Platform.OS = "ios";
        filePicker.pickFile();

        // TODO: test image picker.
    });
});
