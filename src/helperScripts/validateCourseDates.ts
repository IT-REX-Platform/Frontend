import { ToastService } from "../services/toasts/ToastService";
import i18n from "../locales";

// eslint-disable-next-line complexity
export function validateCourseDates(startDate: Date | undefined, endDate: Date | undefined): boolean {
    const toast: ToastService = new ToastService();

    if (!isValidDate(startDate)) {
        toast.warn(i18n.t("itrex.noStartDate"));
        return false;
    }
    if (!isValidDate(endDate)) {
        toast.warn(i18n.t("itrex.noEndDate"));
        return false;
    }

    if (endDate && startDate) {
        if (endDate < startDate) {
            toast.warn(i18n.t("itrex.startDateInvalid"));
            return false;
        }
    }

    return true;
}

export function isValidDate(dateToTest: Date | undefined): boolean {
    if (dateToTest) {
        if (!isNaN(dateToTest.getTime())) {
            return true;
        }
    }
    return false;
}

export function getDateIsoString(dateToTest: Date | undefined): string {
    if (isValidDate(dateToTest) && dateToTest) {
        return dateToTest.toISOString().substr(0, 10);
    }
    return "";
}
export function dateConverter(dateToConvert: Date | undefined): string {
    if (isValidDate(dateToConvert) && dateToConvert) {
        const date = dateToConvert.getDate() + "." + dateToConvert.getMonth() + "." + dateToConvert.getFullYear();
        return date;
    }
    return "";
}
