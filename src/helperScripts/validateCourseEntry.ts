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

export function validateCourseDescription(courseDescription: string): boolean {
    const toast: ToastService = new ToastService();

    /*if (courseDescription.length > 0 && courseDescription.length < 5) {
        toast.warn(i18n.t("itrex.courseDescriptionInvalid"));
        return false;
    }*/

    return true;
}
