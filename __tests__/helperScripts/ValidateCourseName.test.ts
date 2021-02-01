import { validateCourseName } from "../../src/helperScripts/validateCourseName";

global.alert = jest.fn();

describe("test validateCourseName", () => {
    it("check if validation works", () => {
        expect(validateCourseName("invalid")).toBeFalsy;
        expect(validateCourseName("abcde")).toBeTruthy;
        expect(validateCourseName("ab")).toBeFalsy;
    });
});
