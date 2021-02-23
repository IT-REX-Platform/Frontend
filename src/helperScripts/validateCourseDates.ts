import { createAlert } from "./createAlert";

// eslint-disable-next-line complexity
export function validateCourseDates(startDate: Date | undefined, endDate: Date | undefined): boolean {
    if (!isValidDate(startDate)) {
        createAlert("startDate is undefined");
        return false;
    }
    if (!isValidDate(endDate)) {
        createAlert("endDate is undefined");
        return false;
    }

    if (endDate && startDate) {
        if (endDate < startDate) {
            createAlert("startDate can't be higher than endDate");
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
