import { Platform } from "react-native";
import {
    launchImageLibraryAsync,
    MediaLibraryPermissionResponse,
    MediaTypeOptions,
    requestMediaLibraryPermissionsAsync,
} from "expo-image-picker";
import { DocumentResult, getDocumentAsync } from "expo-document-picker";
import i18n from "../locales";
import { loggerFactory } from "../../logger/LoggerConfig";
import { ImageInfo, ImagePickerMultipleResult } from "expo-image-picker/build/ImagePicker.types";

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
    public async pickFile(): Promise<File[]> {
        if (Platform.OS !== "ios") {
            return await this._pickDocument();
        } else {
            return await this._pickImage();
        }
    }

    /**
     * Expo document picker that only allows picking of video files in mp4 format.
     */
    private async _pickDocument(): Promise<File[]> {
        const videos: DocumentResult = await getDocumentAsync({
            type: "video/mp4",
            multiple: true,
        });

        if (videos.type === "cancel") {
            return [new File([], "")];
        }

        if (videos.output == undefined) {
            return [new File([], "")];
        }

        return Array.from(videos.output);
    }

    /**
     * Expo image picker that only allows picking of video files.
     */
    private async _pickImage(): Promise<File[]> {
        const videos: ImagePickerMultipleResult = await launchImageLibraryAsync({
            mediaTypes: MediaTypeOptions.Videos,
            allowsEditing: true,
            allowsMultipleSelection: true,
        });

        if (videos.cancelled === true) {
            return [new File([], "")];
        }

        const selectedFiles: File[] = [];
        videos.selected.forEach((video: ImageInfo) => {
            if (video.type !== "video") {
                return;
            }

            if (video.base64 == undefined) {
                return;
            }

            const file: File = new File([video.base64], "unnamed_file");
            selectedFiles.push(file);
        });

        return selectedFiles;
    }
}
