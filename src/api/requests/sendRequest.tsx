/**
 * Function for sending requests to backend and receiving responses from backend.
 *
 * @param url Endpoint URL.
 * @param request Authorized GET/POST/PUT/DELETE request.
 * @returns Response wrapped in promise.
 */
export function sendRequest(url: string, request: RequestInit): Promise<Response> {
    return fetch(url, request);
}
