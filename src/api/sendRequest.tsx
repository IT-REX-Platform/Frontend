import ITREXVARS from "../Constants";
import { ApiUrls } from "../constants/ApiUrls";

export function sendRequest(request: RequestInit): Promise<unknown> {
    const url = ITREXVARS().apiUrl + ApiUrls.URL_COURSES;

    return fetch(url, request).then((response) => response.json());
}
