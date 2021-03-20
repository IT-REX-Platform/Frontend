import { ApiUrls } from "../constants/ApiUrls";
import { itRexVars } from "../constants/Constants";
import { VideoUrlSuffix } from "../constants/VideoUrlSuffix";

export function createVideoUrl(id: string): string {
    const url = itRexVars().apiUrl + ApiUrls.URL_VIDEOS;
    return url + VideoUrlSuffix.DOWNLOAD + "/" + id;
}
