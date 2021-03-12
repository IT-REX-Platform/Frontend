import { EndpointsChapter } from "../api/endpoints/EndpointsChapter";
import { EndpointsCourse } from "../api/endpoints/EndpointsCourse";
import { RequestFactory } from "../api/requests/RequestFactory";
import i18n from "../locales";
import { IChapter } from "../types/IChapter";
import { ICourse } from "../types/ICourse";
import { ToastService } from "./toasts/ToastService";

export default class CourseService {
    toast: ToastService = new ToastService();

    /**
     * This Method returns an course with all its Chapters and Contents
     * @param courseId of the course to be fetched
     * @deprecated
     */
    public getCourse(courseId: string): Promise<ICourse> {
        return new Promise((resolve) => {
            const request: RequestInit = RequestFactory.createGetRequest();

            const courseEndpoint = new EndpointsCourse();
            const chapterEndpoint = new EndpointsChapter();

            courseEndpoint.getCourse(request, courseId, undefined, i18n.t("itrex.getCourseError")).then((course) => {
                if (course.chapters !== undefined) {
                    // Do something after all promises are "finished"
                    Promise.all(
                        course.chapters?.map((chapterId) => {
                            return new Promise((resolve) => {
                                chapterEndpoint
                                    .getChapter(request, chapterId, undefined, i18n.t("itrex.getChapterError"))
                                    .then((chapter) => {
                                        course.chapterObjects?.push(chapter);
                                        resolve(chapter);
                                    });
                            });
                        })
                    ).then(() => {
                        // Push the Chapter to the right index
                        // Promises may resolve in a different order
                        const order: { [id: string]: number } = {};
                        if (course.chapters !== undefined && course.chapterObjects != undefined) {
                            course.chapters.forEach(function (a, i) {
                                order[a] = i;
                            });
                            course.chapterObjects.sort(function (a, b) {
                                if (a.id !== undefined && b.id !== undefined) {
                                    return order[a.id] - order[b.id];
                                }
                                return 0;
                            });
                        }

                        resolve(course);
                    });
                }
            });
        });
    }

    /**
     * This Methode creates an new chapter and create a link to the existing course
     * @param chapter the chapter to be created
     * @param course the course which the chapter should by linked
     * @deprecated
     */
    public createNewChapter(chapter: IChapter, course: ICourse): Promise<IChapter> {
        const postRequest: RequestInit = RequestFactory.createPostRequestWithBody(chapter);
        const chapterEndpoint = new EndpointsChapter();
        const courseEndpoint = new EndpointsCourse();
        return new Promise((resolve) => {
            chapterEndpoint
                .createChapter(postRequest, undefined, i18n.t("itrex.createUpdateChapterError"))
                .then((chapter) => {
                    // Chapter created successfully
                    // ONYL for DEMO, linking should apply automatically on the backend
                    let myChapters: string[] = [];
                    if (course.chapters !== undefined) {
                        myChapters = course.chapters;
                    }
                    if (chapter.id != undefined) {
                        myChapters.push(chapter.id);
                    }

                    const partialCourse: ICourse = {
                        id: course.id,
                        chapters: myChapters,
                    };

                    const patchRequest: RequestInit = RequestFactory.createPatchRequest(partialCourse);
                    courseEndpoint
                        .patchCourse(
                            patchRequest,
                            i18n.t("itrex.chapterCreatedSuccess"),
                            i18n.t("itrex.createChapterError")
                        )
                        .then(() => resolve(chapter));
                });
        });
    }

    public deleteChapter(chapterId: string | undefined): void {
        const chapterEndpoint = new EndpointsChapter();
        if (chapterId === undefined) {
            return;
        }

        const deleteRequest: RequestInit = RequestFactory.createDeleteRequest();

        chapterEndpoint
            .deleteChapter(deleteRequest, chapterId, undefined, i18n.t("itrex.deleteChapterError"))
            .then((response) => console.log(response));
    }
}
