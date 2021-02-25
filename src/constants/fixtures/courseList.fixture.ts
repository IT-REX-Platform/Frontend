import { ICourse } from "../../types/ICourse";
import { CoursePublishState } from "../CoursePublishState";

const startDate = new Date();
startDate.setDate(startDate.getDate() - 5);

const endDate = new Date();
startDate.setDate(endDate.getDate() + 5);

const theoInf: ICourse = {
    courseDescription: "This is a description",
    startDate: startDate,
    endDate: endDate,
    id: "TestID0",
    name: "Theoretische Grundlagen der Informatik",
    maxFoodSum: 5,
    publishState: CoursePublishState.PUBLISHED,
};

const looseCoupling: ICourse = {
    courseDescription: "This is a description",
    startDate: startDate,
    endDate: endDate,
    id: "TestID1",
    name: "Loose Coupling and message based systems",
    maxFoodSum: 10,
    publishState: CoursePublishState.PUBLISHED,
};

const cloudComputing: ICourse = {
    courseDescription: "This is a description",
    startDate: startDate,
    endDate: endDate,
    id: "TestID2",
    name: "Cloud Computing: Concepts & Technologies ",
    maxFoodSum: 20,
    publishState: CoursePublishState.PUBLISHED,
};

const pse: ICourse = {
    courseDescription: "This is a description",
    startDate: startDate,
    endDate: endDate,
    id: "TestID3",
    name: "Programmierung und Softwareentwicklung",
    maxFoodSum: 30,
    publishState: CoursePublishState.UNPUBLISHED,
};

const minimalCourse: ICourse = {
    id: "TestID4",
    name: "TestKurs",
    publishState: CoursePublishState.UNPUBLISHED,
};

export const courseList: ICourse[] = [theoInf, looseCoupling, cloudComputing, pse, minimalCourse];
