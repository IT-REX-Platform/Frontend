import { createAlert } from "./createAlert";

export function validateCourseDates(startDate: Date, endDate: Date): boolean {
    if (endDate.getTime() < startDate.getTime()) {
        createAlert("endDate can't be higher than startDate");
        return false;
    }

    return true;
}
