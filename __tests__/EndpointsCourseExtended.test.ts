// import { EndpointsCourseExtended } from "../src/api/endpoints/EndpointsCourseExtended";
// import { ICourse } from "../src/types/ICourse";
// import { RequestFactory } from "../src/api/requests/RequestFactory";
// import { CoursePublishState } from "../src/constants/CoursePublishState";

// describe("EndpointsCourseExtended", () => {
//     let instance: EndpointsCourseExtended = new EndpointsCourseExtended();
//     expect(instance).toBeInstanceOf(EndpointsCourseExtended);

//     const params: ICourse = { publishState: CoursePublishState.PUBLISHED };

//     it("createGetRequest() should get an array of published courses.", () => {
//         let getRequest: RequestInit = RequestFactory.createGetRequest();
//         let params: ICourse = { publishState: CoursePublishState.PUBLISHED };
//         const response: Promise<ICourse[]> = instance.getFilteredCourses(getRequest, params);
//         // TODO
//     });
// });
