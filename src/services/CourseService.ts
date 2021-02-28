import { EndpointsChapter } from "../api/endpoints/EndpointsChapter";
import { EndpointsCourse } from "../api/endpoints/EndpointsCourse";
import { RequestFactory } from "../api/requests/RequestFactory";
import { ICourse } from "../types/ICourse";

export default class CourseService {
    /**
     * This Method returns an course with all its Chapters and Contents
     * @param id of the course to be fetched
     */
    public getCourse(id: string): Promise<ICourse> {
        return new Promise((resolve) => {
            const request: RequestInit = RequestFactory.createGetRequest();

            const courseEndpoint = new EndpointsCourse();
            const chapterEndpoint = new EndpointsChapter();

            courseEndpoint.getCourse(request, id).then((course) => {
                if (course.chapters !== undefined) {
                    // Do something after all promises are "finished"
                    Promise.all(
                        course.chapters?.map((chapterId) => {
                            return new Promise((resolve) => {
                                chapterEndpoint.getChapter(request, chapterId).then((chapter) => {
                                    course.chapterObjects?.push(chapter);
                                    resolve(chapter);
                                });
                            });
                        })
                    ).then(() => resolve(course));
                }
            });
        });
    }
}
