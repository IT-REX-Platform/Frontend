export function calculateVideoSize(bytes?: number, decimals = 2): string {
    if (bytes == undefined) {
        return "-";
    }

    if (bytes === 0) {
        return "0 Bytes";
    }

    const dm: number = decimals < 0 ? 0 : decimals;
    const sizes: string[] = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const baseValue = 1024;
    const exponentValue = Math.floor(Math.log(bytes) / Math.log(baseValue));

    const videoSize: string =
        parseFloat((bytes / Math.pow(baseValue, exponentValue)).toFixed(dm)) + " " + sizes[exponentValue];

    return videoSize;
}
