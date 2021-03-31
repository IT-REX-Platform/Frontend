import { MaxCoursesAllowed } from "../constants/MaxCoursesAllowed";
import i18n from "../locales";
import { ToastService } from "./toasts/ToastService";

export let GLOBAL_COURSE_COUNTER = 0;

export function setCourseCounter(coursesNumber: number): void {
    GLOBAL_COURSE_COUNTER = coursesNumber;
}

export function areMoreCoursesAllowed(): boolean {
    const toast: ToastService = new ToastService();

    if (GLOBAL_COURSE_COUNTER >= MaxCoursesAllowed.MAX_COURSES) {
        toast.warn(i18n.t("itrex.courseLimitReached"));

        return false;
    }

    return true;
}
