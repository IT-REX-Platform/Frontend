import { EndpointsChapter } from "../api/endpoints/EndpointsChapter";
import { EndpointsCourse } from "../api/endpoints/EndpointsCourse";
import { RequestFactory } from "../api/requests/RequestFactory";
import { IChapter } from "../types/IChapter";
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
     */
    public createNewChapter(chapter: IChapter, course: ICourse): Promise<IChapter> {
        const postRequest: RequestInit = RequestFactory.createPostRequest(chapter);
        const chapterEndpoint = new EndpointsChapter();
        const courseEndpoint = new EndpointsCourse();
        return new Promise((resolve, reject) => {
            chapterEndpoint
                .createChapter(postRequest)
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
                    courseEndpoint.patchCourse(patchRequest).then((newCourse) => {
                        resolve(chapter);
                    });
                })
                .catch(reject);
        });
    }

    public deleteChapter(chapterId: string | undefined) {
        const chapterEndpoint = new EndpointsChapter();
        if (chapterId === undefined) {
            return;
        }

        const deleteRequest: RequestInit = RequestFactory.createDeleteRequest();

        const response = chapterEndpoint.deleteChapter(deleteRequest, chapterId);
        console.log(response);
    }
}
