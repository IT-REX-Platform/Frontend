/* eslint-disable complexity */
import { EndpointsCourse } from "../api/endpoints/EndpointsCourse";
import { EndpointsProgress } from "../api/endpoints/EndpointsProgress";
import { RequestFactory } from "../api/requests/RequestFactory";
import { ContentProgressTrackerState } from "../constants/ContentProgressTrackerState";
import i18n from "../locales";
import { IContent } from "../types/IContent";
import { IContentProgressTracker } from "../types/IContentProgressTracker";
import { ICourseProgressTracker } from "../types/ICourseProgressTracker";

/**
 * A singleton service instance providing studyprogress-related,
 * often used functions.
 */
export default class ProgressService {
    private static instance: ProgressService;

    private ProgressService() {
        // Private constructor due to singleton.
    }

    /**
     * @returns the singleton instance of the service.
     */
    public static getInstance(): ProgressService {
        if (ProgressService.instance == null) {
            ProgressService.instance = new ProgressService();
        }
        return ProgressService.instance;
    }

    /** The endpoints instance used for updates. */
    private endpointsProgress: EndpointsProgress = new EndpointsProgress();

    /** The endpoints instance for course requests. */
    private endpointsCourse: EndpointsCourse = new EndpointsCourse();

    /** The saved course progresses for reference. */
    private courseProgresses: Record<string, ICourseProgressTracker> = {};

    /**
     * Gets the course progress for a given course id and provides a consumer to react to it.
     * The consumer is needed as it can be a delayed return when needing to get the progress from the backend first.
     * Will only update the saved progress when it's not there yet.
     *
     * @param courseId the course id to get the course progress from.
     * @param consumer the consumer to react to the course progress instance.
     */
    public getCourseProgressFor(courseId: string, consumer: (courseProgress: ICourseProgressTracker) => void): void {
        if (this.courseProgresses[courseId] === undefined) {
            this.updateCourseProgressFor(courseId, consumer);
        } else {
            consumer(this.courseProgresses[courseId]);
        }
    }

    /**
     * Gets the course progress info for a given course id and provides a consumer to react to it.
     * The consumer, in addition to the course progress also provided by updateCourseProgressFor(), also
     * gets a numeric information about started progress items and the total.
     *
     * @param courseId the course id to get the course progress from.
     * @param consumer the consumer to react to the course progress.
     */
    public getCourseProgressInfo(
        courseId: string,
        consumer: (courseProgress: ICourseProgressTracker, progress: { total: number; totalMax: number }) => void
    ): void {
        this.updateCourseProgressFor(courseId, (courseProgress) => {
            const progress: { total: number; totalMax: number } = { total: 0, totalMax: 0 };

            if (courseProgress.contentProgressTrackers === undefined) {
                consumer(courseProgress, progress);
                return;
            }

            this.endpointsCourse
                .getCourse(RequestFactory.createGetRequest(), courseId, undefined, i18n.t("itrex.getCourseError"))
                .then((receivedCourse) => {
                    if (receivedCourse.chapters === undefined) {
                        consumer(courseProgress, progress);
                        return;
                    }

                    for (const curChapter of receivedCourse.chapters) {
                        if (curChapter.contentReferences === undefined) {
                            consumer(courseProgress, progress);
                            return;
                        }

                        for (const curContentRef of curChapter.contentReferences) {
                            if (curContentRef.id === undefined) {
                                continue;
                            }
                            progress.totalMax += 1;

                            // Add 1 to the total if the state is complete, 0 otherwise.
                            const curContentTracker = courseProgress.contentProgressTrackers[curContentRef.id];
                            if (curContentTracker !== undefined) {
                                progress.total += Number(
                                    curContentTracker.state === ContentProgressTrackerState.COMPLETED
                                );
                            }
                        }
                    }

                    consumer(courseProgress, progress);
                });
        });
    }

    /**
     * Updates the course progress for the given course id and provides a consumer to react to the update.
     * Will fetch the up-to-date course progress from the backend.
     *
     * @param courseId the course id to update the course progress for.
     * @param consumer the consumer to react to the updated course progress tracker.
     */
    public updateCourseProgressFor(courseId: string, consumer: (courseProgress: ICourseProgressTracker) => void): void {
        const progressRequest: RequestInit = RequestFactory.createGetRequest();
        this.endpointsProgress
            .getCourseProgress(progressRequest, courseId, undefined, i18n.t("itrex.getCourseProgressError"))
            .then(consumer);
    }

    /**
     * Gets the content progress tracker for the given course id and content reference.
     *
     * @param courseId the course id to get the content progress for.
     * @param contentRef the content reference to get the progress for.
     * @param consumer the consumer to react to the content progress tracker.
     */
    public getContentProgressFor(
        courseId: string,
        contentRef: IContent,
        consumer: (contentProgress: IContentProgressTracker | undefined) => void
    ): void {
        this.getCourseProgressFor(courseId, (courseProgress) => {
            if (courseProgress.contentProgressTrackers == undefined || contentRef.id === undefined) {
                consumer(undefined);
            } else {
                consumer(courseProgress.contentProgressTrackers[contentRef.id]);
            }
        });
    }

    /**
     * Gets the content progress status and its progress in number form for the given course id and content reference.
     *
     * @param courseId the course id to get the content progress status for.
     * @param contentRef the content reference to get the status for.
     * @param consumer the consumer to react to the content progress status and progress.
     */
    public getContentProgressInfo(
        courseId: string,
        contentRef: IContent,
        consumer: (status: ContentProgressTrackerState | undefined, progress: number) => void
    ): void {
        this.getCourseProgressFor(courseId, (courseProgress) => {
            if (courseProgress.contentProgressTrackers === undefined || contentRef.id === undefined) {
                return;
            }

            const contentProgress = courseProgress.contentProgressTrackers[contentRef.id];
            if (contentProgress === undefined) {
                consumer(undefined, 0);
            } else {
                consumer(contentProgress.state, contentProgress.progress ?? 0);
            }
        });
    }

    /**
     * Creates a content progress tracker for a given content reference in a course.
     * This updates the last accessed content reference for the course.
     *
     * @param courseId the course id to create a content progress tracker for.
     * @param contentRef the content reference for which to create the content progress for.
     * @param consumer the consumer to react to the created content progress tracker.
     */
    public createContentProgress(
        courseId: string,
        contentRef: IContent,
        consumer: (contentProgress: IContentProgressTracker) => void
    ): void {
        this.getContentProgressFor(courseId, contentRef, (contentProgress) => {
            // Does already exist, just handle it.
            if (contentProgress !== undefined) {
                consumer(contentProgress);
                return;
            }

            // Doesn't exist means we have to request/create one.
            const postReq = RequestFactory.createPostRequestWithBody(contentRef);
            this.getCourseProgressFor(courseId, (courseProgress) => {
                // Shouldn't happen, but check anyway or else TS is mad.
                if (courseProgress.id === undefined) {
                    return;
                }

                this.endpointsProgress.createContentProgress(postReq, courseProgress.id).then((receivedProgress) => {
                    this.updateLastAccessedContent(courseId, contentRef);
                    consumer(receivedProgress);
                });
            });
        });
    }

    /**
     * Updates the content progress to the given value for the given content reference in a course.
     * This updates the last accessed content reference for the course.
     *
     * @param courseId the course id to update the content progress for.
     * @param contentRef the content reference for which to update the content progress for.
     * @param progress the progress to which to update the content progress.
     * @param consumer the consumer to react to the changed content progress tracker, has info whether the update had to create the tracker first.
     */
    public updateContentProgress(
        courseId: string,
        contentRef: IContent,
        progress: number,
        consumer: (contentProgress: IContentProgressTracker, hasCreated: boolean) => void
    ): void {
        this.getContentProgressFor(courseId, contentRef, (contentProgress) => {
            if (contentProgress === undefined) {
                // No progress yet, create it first.
                this.createContentProgress(courseId, contentRef, (createdProgress) => {
                    this.updateContentProgressWithTracker(courseId, createdProgress, progress, (contentProgress) =>
                        consumer(contentProgress, true)
                    );
                });
            } else {
                this.updateContentProgressWithTracker(courseId, contentProgress, progress, (contentProgress) =>
                    consumer(contentProgress, false)
                );
            }
        });
    }

    /**
     * Updates the content progress to the given value for a given progress tracker.
     * This updates the last accessed content reference for the course.
     *
     * @param courseId the course id to update the content progress for.
     * @param contentProgress the content progress to update.
     * @param progress the progress to which to update the content progress.
     * @param consumer the consumer to react to the changed content progress tracker.
     */
    public updateContentProgressWithTracker(
        courseId: string,
        contentProgress: IContentProgressTracker,
        progress: number,
        consumer: (contentProgress: IContentProgressTracker) => void
    ): void {
        // Shouldn't happen, etc...
        if (contentProgress.id === undefined) {
            return;
        }

        const putReq = RequestFactory.createPutRequest({});
        this.endpointsProgress.updateContentProgress(putReq, contentProgress.id, progress).then((receivedProgress) => {
            if (contentProgress.contentReference !== undefined) {
                this.updateLastAccessedContent(courseId, contentProgress.contentReference);
            }
            consumer(receivedProgress);
        });
    }

    /**
     * Completes the content progress for the given content reference in a course.
     * This updates the last accessed content reference for the course.
     *
     * @param courseId the course id to complete the content progress for.
     * @param contentRef the content reference of which to complete the progress.
     * @param consumer the consumer to react to the completed content progress tracker.
     */
    public completeContentProgress(
        courseId: string,
        contentRef: IContent,
        consumer: (contentProgress: IContentProgressTracker) => void
    ): void {
        this.getContentProgressFor(courseId, contentRef, (contentProgress) => {
            // The update handler for a content progress tracker.
            const handleUpdate = (contentProgress: IContentProgressTracker) => {
                // Shouldn't happen, etc...
                if (contentProgress.id === undefined) {
                    return;
                }

                // Update the progress to complete.
                const putReq = RequestFactory.createPutRequest({});
                this.endpointsProgress.setContentStateComplete(putReq, contentProgress.id).then((receivedProgress) => {
                    this.updateLastAccessedContent(courseId, contentRef);
                    consumer(receivedProgress);
                });
            };

            if (contentProgress === undefined) {
                // No progress yet, create it first.
                this.createContentProgress(courseId, contentRef, handleUpdate);
            } else {
                handleUpdate(contentProgress);
            }
        });
    }

    /**
     * Updates the last accessed content reference for the given course progress tracker.
     *
     * @param courseId the course id to update its tracker's last accessed reference for.
     * @param toContentRef the content reference to update the tracker with.
     * @param consumer the consumer to handle the updated course progress tracker.
     */
    private updateLastAccessedContent(
        courseId: string,
        toContentRef: IContent,
        consumer: (courseProgress: ICourseProgressTracker) => void = () => {
            /*empty consumer by default*/
        }
    ): void {
        // TODO: Better way of handling response here/in calling methods.
        this.getCourseProgressFor(courseId, (courseProgress) => {
            if (courseProgress.id === undefined) {
                return;
            }

            const putReq = RequestFactory.createPutRequest(toContentRef);
            this.endpointsProgress.updateLastAccessedContentProgress(putReq, courseProgress.id).then(consumer);
        });
    }
}
