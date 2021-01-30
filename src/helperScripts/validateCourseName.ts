export function validateCourseName(courseName: string): boolean {
    if (courseName === "invalid") {
        alert("Course name invalid.");
        return false;
    }

    if (courseName.length > 3) {
        return true;
    }

    alert("Course name invalid.");
    return false;
}
