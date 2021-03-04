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

export class FilePickerService {
    private loggerService;

    constructor() {
        this.loggerService = loggerFactory.getLogger("service.FilePickerService");
        this._requestIosPermission();
    }

    /**
     * Request iOS camera permission.
     * Required for image picker.
     */
    private _requestIosPermission() {
        if (Platform.OS === "ios") {
            this.loggerService.trace("Asking for iOS camera permission.");
            const response: Promise<MediaLibraryPermissionResponse> = requestMediaLibraryPermissionsAsync();
            response.then(() => {
                if (status !== "granted") {
                    this.loggerService.trace("iOS camera permission denied.");
                    alert(i18n.t("itrex.imagePickerPermAlert"));
                }
                this.loggerService.trace("iOS camera permission granted.");
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
        const files: DocumentResult = await getDocumentAsync({
            type: "video/mp4",
            multiple: true,
        });

        if (files.type === "cancel") {
            return [new File([], "")];
        }

        if (files.output == undefined) {
            return [new File([], "")];
        }

        this.loggerService.trace("Making sure only MP4 files are selected.");
        const videos: File[] = [];
        Array.prototype.forEach.call(files.output, function (file) {
            if (file.type !== "video/mp4") {
                return;
            }
            videos.push(file);
        });

        return videos;
    }

    /**
     * Expo image picker that only allows picking of video files.
     */
    private async _pickImage(): Promise<File[]> {
        const files: ImagePickerMultipleResult = await launchImageLibraryAsync({
            mediaTypes: MediaTypeOptions.Videos,
            allowsEditing: true,
            allowsMultipleSelection: true,
        });

        if (files.cancelled === true) {
            return [new File([], "")];
        }

        this.loggerService.trace("Making sure only MP4 files are selected.");
        const videos: File[] = [];
        files.selected.forEach((video: ImageInfo) => {
            if (video.type !== "video") {
                return;
            }

            if (video.base64 == undefined) {
                return;
            }

            const file: File = new File([video.base64], "unnamed_file");
            videos.push(file);
        });

        return videos;
    }
}
