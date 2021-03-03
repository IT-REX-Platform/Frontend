import { VideoFormDataParams } from "../constants/VideoFormDataParams";

/**
 * Builds a FormData object.
 *
 * @param videoFile Video file.
 * @param courseId Course ID.
 */
export async function buildVideoAsFormData(videoFile: File, courseId: string): Promise<FormData> {
    const formData: FormData = new FormData();
    formData.append(VideoFormDataParams.PARAM_VIDEO_FILE, videoFile, videoFile.name);
    formData.append(VideoFormDataParams.PARAM_COURSE_ID, courseId);
    return formData;
}
