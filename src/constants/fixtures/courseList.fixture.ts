import { ICourse } from "../../types/ICourse";
import { CoursePublishState } from "../CoursePublishState";

const theoInf: ICourse = {
    courseDescription: "This is a description",
    startDate: new Date(),
    endDate: new Date(),
    id: "TestID12345",
    name: "Theoretische Grundlagen der Informatik",
    maxFoodSum: 20,
    publishState: CoursePublishState.PUBLISHED,
    ownership: ["Ulrich Hertrampf"],
};

const looseCoupling: ICourse = {
    courseDescription: "This is a description",
    startDate: new Date(),
    endDate: new Date(),
    id: "TestID12345",
    name: "Loose Coupling and message based systems",
    maxFoodSum: 20,
    publishState: CoursePublishState.PUBLISHED,
    ownership: ["Frank Leymann", "Uwe Breitenbücher"],
};

const cloudComputing: ICourse = {
    courseDescription: "This is a description",
    startDate: new Date(),
    endDate: new Date(),
    id: "TestID12345",
    name: "Loose Coupling and message based systems",
    maxFoodSum: 20,
    publishState: CoursePublishState.PUBLISHED,
    ownership: ["Frank Leymann", "Uwe Breitenbücher"],
};

export const courseList: ICourse[] = [theoInf, looseCoupling, cloudComputing];
