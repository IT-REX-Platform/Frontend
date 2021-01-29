import { ICourseParameters } from "../../types/ICourseParameters";
import { ICourse } from "../../types/ICourse";

export interface IEndpointsCourseExtended {
    getFilteredCourses(getRequest: RequestInit, params?: ICourseParameters): Promise<ICourse[]>;
}
