import { ToastService } from "../services/toasts/ToastService";
import i18n from "../locales";

export function validateCourseName(courseName: string): boolean {
    const toast: ToastService = new ToastService();

    if (courseName === "invalid") {
        toast.warn(i18n.t("itrex.courseNameInvalid"));
        return false;
    }
    if (courseName.length > 3) {
        return true;
    }

    toast.warn("Course name invalid.");
    return false;
}

export function validateCourseDescription(courseDescription: string): boolean {
    const toast: ToastService = new ToastService();

    if (courseDescription.length > 0 && courseDescription.length < 5) {
        toast.warn(i18n.t("itrex.courseDescriptionInvalid"));
        return false;
    }

    return true;
}
