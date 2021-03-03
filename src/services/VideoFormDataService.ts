import { VideoFormDataParams } from "../constants/VideoFormDataParams";

/**
 * Builds a FormData object from video URI.
 *
 * @param videoUri Video URI.
 * @param videoName Video name.
 * @param courseId Course ID.
 */
export async function buildVideoAsFormData(videoUri: string, videoName: string, courseId: string): Promise<FormData> {
    const response: Response = await fetch(videoUri);
    const fileBlob: Blob = await response.blob();
    const formData: FormData = new FormData();
    formData.append(VideoFormDataParams.PARAM_VIDEO_FILE, fileBlob, videoName);
    formData.append(VideoFormDataParams.PARAM_COURSE_ID, courseId);
    return formData;
}
