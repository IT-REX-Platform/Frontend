export function validateCourseName(courseName: string): boolean {
    if (courseName === "invalid") {
        return false;
    } else if (courseName.length > 3) {
        alert("Course created succesfully");
        return true;
    }
    alert("Course name invalid");
    return false;
}
