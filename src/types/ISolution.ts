export type ISolutionMultipleChoice = {
    [index: string]: boolean | undefined;

    // Alternative:
    // "0": boolean,
    // "1": boolean,
    // "2": boolean,
    // "3": boolean,
};

export type ISolutionNumeric = {
    result: number;
    epsilon: number;
};
