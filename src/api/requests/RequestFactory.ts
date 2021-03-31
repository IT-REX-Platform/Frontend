import { RequestAuthorization } from "./RequestAuthorization";
import { ICourse } from "../../types/ICourse";
import { IVideo } from "../../types/IVideo";
import { IChapter } from "../../types/IChapter";
import { IQuiz } from "../../types/IQuiz";
import { IQuestionMultipleChoice, IQuestionNumeric, IQuestionSingleChoice } from "../../types/IQuestion";
import { IContent } from "../../types/IContent";

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

    // POST does not exist for following types: IVideo.
    public static createPostRequestWithBody(
        body:
            | ICourse
            | IChapter
            | IContent
            | IQuiz
            | IQuestionSingleChoice
            | IQuestionMultipleChoice
            | IQuestionNumeric
            | string[]
    ): RequestInit {
        return RequestFactory.createRequestWithJson("POST", body);
    }

    // PUT does not exist for following types: ICourse, IVideo, IChapter.
    public static createPutRequest(
        object: IContent | IQuiz | IQuestionSingleChoice | IQuestionMultipleChoice | IQuestionNumeric
    ): RequestInit {
        return RequestFactory.createRequestWithJson("PUT", object);
    }

    // PATCH does not exist for following types: IQuiz, IQuestionSingleChoice, IQuestionMultipleChoice, IQuestionNumeric, IContent.
    public static createPatchRequest(object: ICourse | IChapter | IVideo): RequestInit {
        return RequestFactory.createRequestWithJson("PATCH", object);
    }

    private static createRequestWithJson(
        httpMethod: string,
        body:
            | ICourse
            | IVideo
            | IContent
            | IChapter
            | IQuiz
            | IQuestionSingleChoice
            | IQuestionMultipleChoice
            | IQuestionNumeric
            | string[]
    ): RequestInit {
        const request: RequestInit = RequestAuthorization.createAuthorizedRequest();

        request.method = httpMethod;
        request.headers = {
            ...request.headers,
            Accept: "application/json",
            "Content-Type": "application/json",
        };
        request.body = JSON.stringify(body);

        return request;
    }

    public static createDeleteRequest(): RequestInit {
        const request: RequestInit = RequestAuthorization.createAuthorizedRequest();
        request.method = "DELETE";
        return request;
    }
}
