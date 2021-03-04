import { CourseRoles } from "../constants/CourseRoles";
import { ITREXRoles } from "../constants/ITREXRoles";

export type IUser = {
    id?: string;
    userName?: string;
    name?: string;
    givenName?: string;
    familiyName?: string;
    email?: string;
    rexRole?: ITREXRoles;
    courses?: Map<string, CourseRoles>;
};
