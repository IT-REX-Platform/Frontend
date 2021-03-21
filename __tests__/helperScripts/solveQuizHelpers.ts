import { validateCourseDates, isValidDate, getDateIsoString } from "../../src/helperScripts/validateCourseDates";

describe("test validateCourseDates", () => {
    it("should return false for undefined startDate", () => {
        const startDate = undefined;
        const endDate = new Date();

        expect(validateCourseDates(startDate, endDate)).toBeFalsy();
    });
});
