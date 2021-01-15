const url = "http://localhost:8080/services/courseservice/api/courses";

export function sendCreateCourseRequest(courseName: string): void {
    const postRequest = {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: courseName,
        }),
    };

    fetch(url, postRequest)
        .then((response) => response.json())
        .then((data) => console.log(data));
}
