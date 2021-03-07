import { RequestAuthorization } from "./RequestAuthorization";
import { ICourse } from "../../types/ICourse";
import { IVideo } from "../../types/IVideo";
import { IChapter } from "../../types/IChapter";

/**
 * Class for backend request creation.
 */
export class RequestFactory {
    public static createGetRequest(): RequestInit {
        const request = RequestAuthorization.createAuthorizedRequest();
        request.method = "GET";
        return request;
    }

    public static createPostRequestWithFormData(formData: FormData): RequestInit {
        const request: RequestInit = RequestAuthorization.createAuthorizedRequest();
        request.method = "POST";
        request.body = formData;
        return request;
    }

    public static createPostRequestWithoutBody(): RequestInit {
        const request = RequestAuthorization.createAuthorizedRequest();
        request.method = "POST";
        return request;
    }

    public static createPostRequestWithBody(object: ICourse | IVideo | IChapter): RequestInit {
        return RequestFactory.createRequestWithJson("POST", object);
    }

    public static createPutRequest(object: ICourse | IVideo): RequestInit {
        return RequestFactory.createRequestWithJson("PUT", object);
    }

    public static createPatchRequest(object: ICourse | IVideo | IChapter): RequestInit {
        return RequestFactory.createRequestWithJson("PATCH", object);
    }

    private static createRequestWithJson(httpMethod: string, object: ICourse | IVideo): RequestInit {
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
