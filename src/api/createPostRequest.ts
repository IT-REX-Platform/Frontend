import AuthenticationService from "../services/AuthenticationService";

export interface Course {
    name: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    maxFoodSum?: number;
}

export interface Media {
    fileName: string;
}

export function createPostRequest(object: Course | Media): RequestInit {
    const request = createRequest();
    request.method = "POST";
    request.headers = {
        ...request.headers,
        Accept: "application/json",
        "Content-Type": "application/json",
    };
    request.body = JSON.stringify(object);

    return request;
}

export function createRequest(): RequestInit {
    const authService = AuthenticationService.getInstance();
    return {
        headers: {
            Authorization: authService.getToken().tokenType + " " + authService.getToken().accessToken,
        },
        credentials: "include",
    };
}
