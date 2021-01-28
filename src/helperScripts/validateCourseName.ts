export function validateCourseName(courseName: string): boolean {
    if (courseName === "invalid") {
        return false;
    } else if (courseName.length > 3) {
        return true;
    }
    return false;
}
