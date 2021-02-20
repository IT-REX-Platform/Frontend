import { validateCourseDates, isValidDate, getDateIsoString } from "../../src/helperScripts/validateCourseDates";

describe("test validateCourseDates", () => {
    it("should return false for undefined startDate", () => {
        const startDate = undefined;
        const endDate = new Date();

        expect(validateCourseDates(startDate, endDate)).toBeFalsy();
    });
    it("should return false for undefined endDate", () => {
        const startDate = new Date();
        const endDate = undefined;

        expect(validateCourseDates(startDate, endDate)).toBeFalsy();
    });

    it("should return false if startDate is larger than endDate", () => {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() - 1);

        expect(validateCourseDates(startDate, endDate)).toBeFalsy();
    });

    it("should return true if startDate is before endDate", () => {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 1);
        const endDate = new Date();

        expect(validateCourseDates(startDate, endDate)).toBeTruthy();
    });
});

describe("test isValidDate", () => {
    it("returns false for wrong dates", () => {
        const testDate = new Date("asc");
        expect(isValidDate(testDate)).toBeFalsy;
    });
    it("returns false for undefined dates", () => {
        const testDate = undefined;
        expect(isValidDate(testDate)).toBeFalsy;
    });
    it("returns true for valid dates", () => {
        const testDate = new Date();
        expect(isValidDate(testDate)).toBeTruthy;
    });
});

describe("test getDateIsoString", () => {
    it("returns empty string if undefined", () => {
        const dateToTest = undefined;
        expect(getDateIsoString(dateToTest)).toEqual("");
    });

    it("returns correct ISO string", () => {
        const dateToTest = new Date();
        expect(getDateIsoString(dateToTest)).toEqual(dateToTest.toISOString().substr(0, 10));
    });
});
