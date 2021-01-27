import ITREXVARS from "../constants/Constants";

const url = ITREXVARS().apiUrl + "services/courseservice/api/courses";

export function sendRequest(request: RequestInit): void {
    fetch(url, request)
        .then((response) => response.json())
        .then((data) => console.log(data));
}
