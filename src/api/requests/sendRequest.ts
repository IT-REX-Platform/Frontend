import i18n from "../../locales";
import { ToastService } from "../../services/toasts/ToastService";

/**
 * Function for sending requests to backend and receiving responses from backend.
 *
 * @param url Endpoint URL.
 * @param request Authorized GET/POST/PUT/PATCH/DELETE request.
 * @returns Response wrapped in promise.
 */
export function sendRequest(url: string, request: RequestInit): Promise<Response> {
    const toast: ToastService = new ToastService();
    return new Promise((resolve, reject) => {
        fetch(url, request)
            .then((response) => {
                resolve(response);
            })
            // This does not catch HTTP error responses, e.g. 404, 500, etc.
            .catch((error) => {
                toast.error(i18n.t("itrex.serviceError"));
                reject(error);
            });
    });
}
