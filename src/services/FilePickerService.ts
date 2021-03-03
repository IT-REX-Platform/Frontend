import { Platform } from "react-native";
import {
    ImagePickerResult,
    launchImageLibraryAsync,
    MediaLibraryPermissionResponse,
    MediaTypeOptions,
    requestMediaLibraryPermissionsAsync,
} from "expo-image-picker";
import { DocumentResult, getDocumentAsync } from "expo-document-picker";
import { IPickedFile } from "../types/IPickedFile";
import i18n from "../locales";
import { loggerFactory } from "../../logger/LoggerConfig";

const loggerService = loggerFactory.getLogger("service.FilePickerService");

export class FilePickerService {
    constructor() {
        this._requestIosPermission();
    }

    /**
     * Request iOS camera permission.
     * Required for image picker.
     */
    private _requestIosPermission() {
        if (Platform.OS === "ios") {
            loggerService.trace("Asking for iOS camera permission.");
            const response: Promise<MediaLibraryPermissionResponse> = requestMediaLibraryPermissionsAsync();
            response.then(() => {
                if (status !== "granted") {
                    loggerService.trace("iOS camera permission denied.");
                    alert(i18n.t("itrex.imagePickerPermAlert"));
                }
                loggerService.trace("iOS camera permission granted.");
            });
        }
    }

    /**
     * Open a file picker, so the user can choose a file.
     */
    public async pickFile(): Promise<IPickedFile> {
        if (Platform.OS !== "ios") {
            return await this._pickDocument();
        } else {
            return await this._pickImage();
        }
    }

    /**
     * Expo image picker that only allows picking of video files.
     */
    private async _pickImage(): Promise<IPickedFile> {
        const video: ImagePickerResult = await launchImageLibraryAsync({
            mediaTypes: MediaTypeOptions.Videos,
            allowsEditing: true,
        });

        if (video.cancelled === true) {
            return { uri: "", name: "" };
        }

        return { uri: video.uri, name: "Unnamed video file" };
    }

    /**
     * Expo document picker that only allows picking of video files in mp4 format.
     */
    private async _pickDocument(): Promise<IPickedFile> {
        const document: DocumentResult = await getDocumentAsync({
            type: "video/mp4",
        });

        if (document.type === "cancel") {
            return { uri: "", name: "" };
        }

        return { uri: document.uri, name: document.name };
    }
}
