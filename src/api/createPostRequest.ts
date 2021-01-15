export interface Course {
    name: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    maxFoodSum?: number;
}

export interface Media {
    fileName: string;
}

export function createPostRequest(object: Course | Media): RequestInit {
    return {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(object),
    };
}
