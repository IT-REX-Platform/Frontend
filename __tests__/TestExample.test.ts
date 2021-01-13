import { TestExample } from "../code_coverage_example/TestExample";

const testExample: TestExample = new TestExample();

test("adds 3 + 1 to equal 4", () => {
    expect(TestExample.testMethod1(3)).toBe(4);
});

test("basic", () => {
    expect(testExample.testMethod2(3)).toBe(true);
    // expect(testExample.testMethod2(-3)).toBe(false);
});

test("basic", () => {
    expect(testExample.testMethod3(1)).toBe(1);
    // expect(testExample.testMethod3(2)).toBe(2);
    // expect(testExample.testMethod3(3)).toBe(3);
    expect(testExample.testMethod3(4)).toBe(0);
});

/*
Jest doc:
https://jestjs.io/docs/en/expect
//*/
