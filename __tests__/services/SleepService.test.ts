import "../../setupTests.ts";
import { sleep } from "../../src/services/SleepService";

describe("test sleep service", () => {
    it("check if function resolves", async () => {
        await expect(sleep()).resolves.toBe(undefined);
        await expect(sleep()).resolves.not.toThrow();
    });
});
