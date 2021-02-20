import { ICourse } from "../../types/ICourse";
import { IVideo } from "../../types/IVideo";

export class ResponseParser {
    public static parseCourse(response: Promise<Response>): Promise<ICourse> {
        const json: Promise<unknown> = response.then((response) => response.json());
        const course: Promise<ICourse> = json.then((data) => data as ICourse);
        return course;
    }

    public static parseCourses(response: Promise<Response>): Promise<ICourse[]> {
        const json: Promise<unknown> = response.then((response) => response.json());
        const courses: Promise<ICourse[]> = json.then((data) => data as ICourse[]);
        return courses;
    }

    public static async parseVideo(response: Response): Promise<IVideo> {
        const data = await response.json();
        const video: IVideo = data as IVideo;
        return video;
    }

    public static async parseVideos(response: Response): Promise<IVideo[]> {
        const data = await response.json();
        const videos: IVideo[] = data as IVideo[];
        return videos;
    }
}
