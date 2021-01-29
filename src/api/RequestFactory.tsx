import { RequestAuthorization } from "./RequestAuthorization";
import { ICourse } from "../types/ICourse";
import { IMedia } from "../types/IMedia";

export class RequestFactory {
    public static createGetAllRequest(): RequestInit {
        return RequestAuthorization.createAuthorizedRequest();
    }

    public static createGetOneRequest(): void {
        // TODO: create GET request for /courses/{id}
    }

    public static createPostRequest(object: ICourse | IMedia): RequestInit {
        return RequestFactory.createPostOrPutRequest("POST", object);
    }

    public static createPutRequest(object: ICourse | IMedia): RequestInit {
        return RequestFactory.createPostOrPutRequest("PUT", object);
    }

    private static createPostOrPutRequest(httpMethod: string, object: ICourse | IMedia): RequestInit {
        const request: RequestInit = RequestAuthorization.createAuthorizedRequest();

        request.method = httpMethod;
        request.headers = {
            ...request.headers,
            Accept: "application/json",
            "Content-Type": "application/json",
        };
        request.body = JSON.stringify(object);

        return request;
    }

    public static createDeleteRequest(): RequestInit {
        const request: RequestInit = RequestAuthorization.createAuthorizedRequest();
        request.method = "DELETE";
        return request;
    }
}
