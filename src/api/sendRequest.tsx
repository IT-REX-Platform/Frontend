export function sendRequest(url: string, request: RequestInit): Promise<Response> {
    return fetch(url, request);
}
