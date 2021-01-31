import { itRexVars } from "../constants/Constants";

export function sendRequest(request: RequestInit): void {
    const url = itRexVars().apiUrl + "services/courseservice/api/courses";

    fetch(url, request)
        .then((response) => response.json())
        .then((data) => console.log(data));
}
