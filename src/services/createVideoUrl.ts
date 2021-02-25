import { ApiUrls } from "../constants/ApiUrls";
import { itRexVars } from "../constants/Constants";

export function createVideoUrl(id: string): string {
    const url = itRexVars().apiUrl + ApiUrls.URL_VIDEOS;
    return url + "/" + id;
}
