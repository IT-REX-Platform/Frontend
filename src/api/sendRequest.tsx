export function sendRequest(url: string, request: RequestInit): Promise<unknown> {
    return fetch(url, request).then((response) => response.json());
}
