import { createAlert } from "./createAlert";

export function validateCourseName(courseName: string): boolean {
    if (courseName === "invalid") {
        createAlert("Course name invalid.");
        return false;
    }
    if (courseName.length > 3) {
        return true;
    }
    createAlert("Course name invalid");
    return false;
}

export function validateCourseDescription(courseDescription: string): boolean {
    if (courseDescription.length > 0 && courseDescription.length < 5) {
        createAlert("Course description invalid.");
        return false;
    }

    return true;
}
