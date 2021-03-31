/* eslint-disable complexity */
import { EndpointsCourse } from "../api/endpoints/EndpointsCourse";
import { EndpointsQuiz } from "../api/endpoints/EndpointsQuiz";
import { EndpointsVideo } from "../api/endpoints/EndpointsVideo";
import { RequestFactory } from "../api/requests/RequestFactory";
import { dateConverter } from "../helperScripts/validateCourseDates";
import i18n from "../locales";
import { CONTENTREFERENCETYPE, IContent } from "../types/IContent";
import { ICourse } from "../types/ICourse";

/**
 * This function fetches a course with all its "dependencies", like referenced videos or quizzes
 * @param courseId the id of the course which should be fetched
 * @returns the whole curse structure with video/quiz and timePeriod Information
 */
export function getCourseInformation(courseId: string): Promise<ICourse> {
    const request: RequestInit = RequestFactory.createGetRequest();
    const courseEndpoint = new EndpointsCourse();
    const endpointsVideos = new EndpointsVideo();
    const endpointsQuiz = new EndpointsQuiz();
    return new Promise((resolve) => {
        courseEndpoint
            .getCourse(request, courseId, undefined, i18n.t("itrex.getCourseError"))
            .then((receivedCourse) => {
                if (receivedCourse.chapters !== undefined) {
                    for (const chapter of receivedCourse.chapters) {
                        if (chapter.contentReferences !== undefined) {
                            for (const contentRef of chapter.contentReferences) {
                                const timePeriod = receivedCourse.timePeriods?.find(
                                    (period) => period.id === contentRef.timePeriodId
                                );
                                if (timePeriod !== undefined) {
                                    contentRef.timePeriod = timePeriod;

                                    if (timePeriod?.chapters === undefined) {
                                        timePeriod.chapters = [];
                                    }

                                    // Search for chapter in timePeriod
                                    let foundChapter = timePeriod.chapters.find(
                                        (tmpChapter) => tmpChapter.id === chapter.id
                                    );

                                    if (foundChapter === undefined) {
                                        foundChapter = {
                                            courseId: chapter.courseId,
                                            id: chapter.id,
                                            name: chapter.name,
                                            chapterNumber: chapter.chapterNumber,
                                        };
                                        foundChapter.contentReferences = [];
                                        timePeriod.chapters.push(foundChapter);
                                    }

                                    foundChapter?.contentReferences?.push(contentRef);
                                }
                            }
                        }
                    }

                    // Set TimePeriodNames
                    receivedCourse.timePeriods?.forEach((timePeriod, idx) => {
                        timePeriod.name = i18n.t("itrex.week") + " " + (idx + 1);
                        timePeriod.fullName =
                            timePeriod.name +
                            " ( " +
                            dateConverter(timePeriod?.startDate) +
                            " - " +
                            dateConverter(timePeriod?.endDate) +
                            " )";
                    });

                    const contents: { [key: string]: IContent[] } = {};

                    // Map Contents to different dictionaries, later we can pass the contentIds to the correct service
                    for (const chapter of receivedCourse.chapters) {
                        if (chapter.contentReferences !== undefined) {
                            for (const content of chapter.contentReferences) {
                                if (content.contentReferenceType !== undefined && content.contentId !== undefined) {
                                    if (contents[content.contentReferenceType] === undefined) {
                                        contents[content.contentReferenceType] = [];
                                    }
                                    contents[content.contentReferenceType].push(content);
                                }
                            }
                        }
                    }

                    // Array of contentId's from die video List
                    const videoIds: string[] =
                        contents[CONTENTREFERENCETYPE.VIDEO] !== undefined
                            ? contents[CONTENTREFERENCETYPE.VIDEO].map((content) => {
                                  if (content.contentId !== undefined) {
                                      return content.contentId;
                                  }
                                  return "";
                              })
                            : [];

                    // Array of contentId's from die quiz List
                    const quizIds: string[] =
                        contents[CONTENTREFERENCETYPE.QUIZ] !== undefined
                            ? contents[CONTENTREFERENCETYPE.QUIZ].map((content) => {
                                  if (content.contentId !== undefined) {
                                      return content.contentId;
                                  }
                                  return "";
                              })
                            : [];

                    // Ask the MediaService for the video metadata
                    const videoPromise = new Promise((resolve, reject) => {
                        if (videoIds != undefined) {
                            // Create POST request with video IDs in body.
                            const postVideoRequest = RequestFactory.createPostRequestWithBody(videoIds);

                            // Get Videos by ContentIds
                            endpointsVideos.findAllWithIds(postVideoRequest).then((videos) => {
                                videos.forEach((video) => {
                                    const contentVideo = contents[CONTENTREFERENCETYPE.VIDEO].filter(
                                        (item) => item.contentId === video.id
                                    );
                                    if (contentVideo !== undefined) {
                                        for (const currContent of contentVideo) {
                                            currContent.video = video;
                                        }
                                    }
                                });
                                resolve(true);
                            });
                        } else {
                            reject();
                        }
                    });

                    // Load Quiz-Informations
                    const postQuizRequest = RequestFactory.createPostRequestWithBody(quizIds);
                    const quizPromise = new Promise((resolve, reject) => {
                        if (quizIds != undefined) {
                            endpointsQuiz.findAllByIds(postQuizRequest).then((quizzes) => {
                                quizzes.forEach((quiz) => {
                                    const contentQuiz = contents[CONTENTREFERENCETYPE.QUIZ].filter(
                                        (item) => item.contentId === quiz.id
                                    );
                                    if (contentQuiz !== undefined) {
                                        for (const currContent of contentQuiz) {
                                            currContent.quiz = quiz;
                                        }
                                    }
                                });
                                resolve(true);
                            });
                        } else {
                            reject();
                        }
                    });

                    Promise.all([videoPromise, quizPromise]).then(() => {
                        resolve(receivedCourse);
                    });
                }
            });
    });
}
