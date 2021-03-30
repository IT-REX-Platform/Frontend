import { ToastService } from "../../services/toasts/ToastService";

export class ResponseToasts {
    private toast: ToastService;

    constructor() {
        this.toast = new ToastService();
    }

    public toastSuccess(successMsg?: string, toastTimeout?: false): void {
        if (successMsg != undefined) {
            this.toast.success(successMsg, toastTimeout);
        }
    }

    public toastError(errorMsg?: string, toastTimeout?: false): void {
        if (errorMsg != undefined) {
            this.toast.error(errorMsg, toastTimeout);
        }
    }
}
