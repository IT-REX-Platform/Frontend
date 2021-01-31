// import { EndpointsCourse } from "../src/api/endpoints/EndpointsCourse";
// import { ICourse } from "../src/types/ICourse";
// import { RequestFactory } from "../src/api/requests/RequestFactory";
// import { CoursePublishState } from "../src/constants/CoursePublishState";

// describe("EndpointsCourse", () => {
//     let instance: EndpointsCourse = new EndpointsCourse();
//     expect(instance).toBeInstanceOf(EndpointsCourse);

//     it("should get an array of courses.", () => {
//         let getRequest: RequestInit = RequestFactory.createGetRequest();
//         const response: Promise<ICourse[]> = instance.getAllCourses(getRequest);
//         // TODO
//     });

//     it("should get one course.", () => {
//         let getRequest: RequestInit = RequestFactory.createGetRequest();
//         let id: number = 12345;
//         const response: Promise<ICourse> = instance.getCourse(getRequest, id);
//         // TODO
//     });

//     it("should create a course.", () => {
//         let course: ICourse = { name: "test_course_1" };
//         let postRequest: RequestInit = RequestFactory.createPostRequest(course);
//         const response: Promise<ICourse> = instance.createCourse(postRequest);
//         // TODO
//     });

//     it("should update a course.", () => {
//         let course: ICourse = { name: "test_course_2" };
//         let putRequest: RequestInit = RequestFactory.createPutRequest(course);
//         const response: Promise<ICourse> = instance.updateCourse(putRequest);
//         // TODO
//     });

//     it("should delete a course.", () => {
//         let deleteRequest: RequestInit = RequestFactory.createDeleteRequest();
//         let id: number = 12345;
//         instance.deleteCourse(deleteRequest, id);
//         // TODO
//     });
// });
