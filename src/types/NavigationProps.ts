import { ICourse } from "./ICourse";
import { IVideo } from "./IVideo";

export type NavigationProps = {
    route: {
        params: {
            course: ICourse;
            video: IVideo;
            courseId: string;
        };
    };
};
