import { ToastService } from "../services/toasts/ToastService";
import i18n from "../locales";

export function validateCourseName(courseName: string): boolean {
    const toast: ToastService = new ToastService();

    if (courseName === "invalid") {
        toast.warn(i18n.t("itrex.courseNameInvalid"));
        return false;
    }
    if (courseName.length < 1) {
        toast.warn(i18n.t("itrex.courseNameTooShort"));
        return false;
    }

    return true;
}
