export class TestExample {
    public static testMethod1(input: number): number {
        return input + 1;
    }

    public testMethod2(input: number): boolean {
        if (input >= 0) {
            return true;
        } else {
            return false;
        }
    }

    public testMethod3(input: number): number {
        switch (input) {
            case 1:
                return 1;
            case 2:
                return 2;
            case 3:
                return 3;
            default:
                return 0;
        }
    }
}
