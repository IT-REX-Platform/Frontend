import { createAlert } from "../../helperScripts/createAlert";

/**
 * Function for sending requests to backend and receiving responses from backend.
 *
 * @param url Endpoint URL.
 * @param request Authorized GET/POST/PUT/DELETE request.
 * @returns Response wrapped in promise.
 */
export function sendRequest(url: string, request: RequestInit): Promise<Response> {
    return new Promise((resolve, reject) => {
        fetch(url, request)
            .then((response) => {
                resolve(response);
            })
            // This does not catch HTTP error responses, e.g. 404, 500, etc.
            .catch((error) => {
                reject(error);
                createAlert("An error occured while accessing IT-REX service.");
            });
    });
}
